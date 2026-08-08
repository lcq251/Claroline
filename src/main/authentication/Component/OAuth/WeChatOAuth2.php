<?php

namespace Claroline\AuthenticationBundle\Component\OAuth;

use Claroline\AuthenticationBundle\Component\OAuth\WeChat\WeChatProvider;
use Claroline\AuthenticationBundle\Entity\OAuthClient;
use League\OAuth2\Client\Provider\AbstractProvider;

/**
 * WeChat Open Platform OAuth2 integration for QR code login.
 *
 * Registered via service tag "claroline.component.oauth2" — automatically
 * discovered by OAuth2Provider and available in the OAuth client configuration.
 *
 * @see OAuth2Component
 * @see OAuth2Interface
 */
class WeChatOAuth2 extends OAuth2Component
{
    public static function getName(): string
    {
        return 'wechat';
    }

    public static function getIcon(): string
    {
        return 'fa fa-wechat';
    }

    /**
     * Field mapping from WeChat userinfo to Claroline User fields.
     *
     * WeChat does NOT provide email. The OAuthManager will try to match users
     * by 'email' first and fall back to 'username' (openid).
     *
     * Important: set "createOnLogin"=true on the OAuthClient entity so new
     * WeChat users are automatically created.
     */
    public function getDefaultMapping(): array
    {
        return [
            'username' => 'openid',
            'firstName' => 'nickname',
            'lastName' => '',
            'email' => '',       // WeChat has no email — leave empty
            'picture' => 'picture',
        ];
    }

    /**
     * Build the WeChat OAuth2 provider instance from client configuration.
     */
    public function getProvider(OAuthClient $client): AbstractProvider
    {
        return new WeChatProvider([
            'clientId' => $client->getClientId(),
            'clientSecret' => $client->getClientSecret(),
            'redirectUri' => $client->getAdditionalParameter('redirectUri') ?? null,
            'urlAuthorize' => $client->getUrlAuthorize() ?: null,
            'urlAccessToken' => $client->getUrlAccessToken() ?: null,
            'urlResourceOwnerDetails' => $client->getUrlResourceOwnerDetails() ?: null,
        ]);
    }
}
