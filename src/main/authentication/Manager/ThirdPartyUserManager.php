<?php

namespace Claroline\AuthenticationBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AuthenticationBundle\Entity\ThirdPartyUser;
use Claroline\AuthenticationBundle\Repository\ThirdPartyUserRepository;
use Claroline\CoreBundle\Entity\User;

/**
 * Manages third-party platform user identities (WeChat, GitHub, etc.).
 *
 * Each third-party login creates a ThirdPartyUser record linked to a
 * Claroline User. The User is created with a synthetic username/email.
 * After first login, the user must complete their profile (name, email).
 */
class ThirdPartyUserManager
{
    public function __construct(
        private readonly ObjectManager $om,
    ) {
    }

    /**
     * Find an existing ThirdPartyUser by platform and platform ID.
     */
    public function findExisting(string $platform, string $platformId): ?ThirdPartyUser
    {
        /** @var ThirdPartyUserRepository $repo */
        $repo = $this->om->getRepository(ThirdPartyUser::class);

        return $repo->findByPlatformId($platform, $platformId);
    }

    /**
     * Create a new Claroline User + ThirdPartyUser record for WeChat login.
     *
     * The User is created with minimal data. The frontend will redirect
     * to a profile completion form for name/email.
     *
     * @param array{openid: string, nickname: string, headimgurl: string, unionid: string} $wechatData
     */
    public function createWeChatUser(array $wechatData): User
    {
        $openId = $wechatData['openid'];
        $nickname = $wechatData['nickname'] ?? '';
        $avatarUrl = $wechatData['headimgurl'] ?? '';

        // Create the Claroline User
        $user = new User();
        $user->setUsername('wechat'.$openId);
        $user->setFirstName($nickname ?: 'WeChat User');
        $user->setLastName('');
        $user->setEmail('wechat'.$openId.'@placeholder.local');
        $user->setPlainPassword(bin2hex(random_bytes(16)));
        $user->setIsMailValidated(false);

        if ($avatarUrl) {
            $user->setPoster($avatarUrl);
        }

        $this->om->persist($user);

        // Create the ThirdPartyUser link
        $thirdParty = new ThirdPartyUser();
        $thirdParty->setUser($user);
        $thirdParty->setPlatform('wechat');
        $thirdParty->setPlatformId($openId);
        $thirdParty->setRawData($wechatData);

        $this->om->persist($thirdParty);
        $this->om->forceFlush();

        return $user;
    }

    /**
     * Check whether the user has completed the required profile fields.
     *
     * Third-party users must add a real email and optionally a name
     * after their first login.
     */
    public function needsProfileCompletion(User $user): bool
    {
        $email = $user->getEmail();

        // Check if the email is still the synthetic placeholder
        return empty($email) || str_ends_with($email, '@placeholder.local');
    }
}
