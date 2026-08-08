<?php

namespace Claroline\AuthenticationBundle\Component\OAuth\WeChat;

use League\OAuth2\Client\Provider\ResourceOwnerInterface;

/**
 * Resource owner for WeChat Open Platform.
 *
 * Maps the WeChat userinfo response to standard fields used by Claroline.
 *
 * WeChat userinfo response shape:
 * {
 *     "openid": "xxx",
 *     "nickname": "User",
 *     "sex": 1,
 *     "province": "Beijing",
 *     "city": "Beijing",
 *     "country": "CN",
 *     "headimgurl": "https://...",
 *     "privilege": [],
 *     "unionid": "xxx"
 * }
 */
class WeChatResourceOwner implements ResourceOwnerInterface
{
    private array $data;

    public function __construct(array $response)
    {
        $this->data = $response;
    }

    public function getId(): string
    {
        return $this->data['openid'] ?? '';
    }

    public function getOpenId(): string
    {
        return $this->data['openid'] ?? '';
    }

    public function getUnionId(): string
    {
        return $this->data['unionid'] ?? '';
    }

    public function getNickname(): string
    {
        return $this->data['nickname'] ?? '';
    }

    public function getHeadImgUrl(): string
    {
        return $this->data['headimgurl'] ?? '';
    }

    /**
     * Returns all resource owner data as an array.
     *
     * Keys are normalized to match Claroline's OAuthManager field mapping:
     *   - username: used as user identifier (we use openid)
     *   - firstName: user's first name (we use nickname)
     *   - lastName: no equivalent in WeChat
     *   - email: WeChat does NOT provide email
     *   - picture: avatar URL
     */
    public function toArray(): array
    {
        return [
            'openid' => $this->getOpenId(),
            'unionid' => $this->getUnionId(),
            'username' => $this->getOpenId(),        // Claroline maps username → identifier
            'nickname' => $this->getNickname(),
            'firstName' => $this->getNickname(),      // nickname → firstName
            'lastName' => '',
            'email' => '',                             // WeChat does not provide email
            'picture' => $this->getHeadImgUrl(),
        ];
    }
}
