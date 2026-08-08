<?php

namespace Claroline\AuthenticationBundle\Component\OAuth\WeChat;

use League\OAuth2\Client\Grant\AbstractGrant;
use League\OAuth2\Client\Provider\AbstractProvider;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Token\AccessToken;
use Psr\Http\Message\ResponseInterface;

/**
 * Custom OAuth2 provider for WeChat Open Platform (QR code login).
 *
 * WeChat OAuth2 differs from standard OAuth2:
 *   - Authorization URL ends with #wechat_redirect
 *   - Token endpoint returns openid alongside access_token
 *   - UserInfo endpoint uses query params, not Bearer header
 *   - Authorization uses 'appid' instead of 'client_id'
 */
class WeChatProvider extends AbstractProvider
{
    public function __construct(array $options = [], array $collaborators = [])
    {
        // Set WeChat defaults if not overridden by client config
        $options['urlAuthorize'] ??= 'https://open.weixin.qq.com/connect/qrconnect';
        $options['urlAccessToken'] ??= 'https://api.weixin.qq.com/sns/oauth2/access_token';
        $options['urlResourceOwnerDetails'] ??= 'https://api.weixin.qq.com/sns/userinfo';

        parent::__construct($options, $collaborators);
    }

    public function getBaseAuthorizationUrl(): string
    {
        return 'https://open.weixin.qq.com/connect/qrconnect';
    }

    public function getBaseAccessTokenUrl(array $params): string
    {
        return 'https://api.weixin.qq.com/sns/oauth2/access_token';
    }

    public function getResourceOwnerDetailsUrl(AccessToken $token): string
    {
        $openId = $token->getValues()['openid'] ?? '';

        return 'https://api.weixin.qq.com/sns/userinfo?access_token='.$token->getToken().'&openid='.$openId;
    }

    protected function getDefaultScopes(): array
    {
        return ['snsapi_login'];
    }

    public function getAuthorizationUrl(array $options = []): string
    {
        $url = parent::getAuthorizationUrl($options);

        if (!str_contains($url, '#wechat_redirect')) {
            $url .= '#wechat_redirect';
        }

        return $url;
    }

    protected function getScopeSeparator(): string
    {
        return ',';
    }

    protected function getAuthorizationParameters(array $options): array
    {
        $options['appid'] = $this->clientId;
        unset($options['client_id']);

        return parent::getAuthorizationParameters($options);
    }

    protected function createAccessToken(array $response, AbstractGrant $grant): AccessToken
    {
        return new AccessToken(array_merge($response, [
            'resource_owner_id' => $response['openid'] ?? null,
        ]));
    }

    protected function checkResponse(ResponseInterface $response, $data): void
    {
        if (isset($data['errcode']) && 0 !== $data['errcode']) {
            throw new IdentityProviderException(
                $data['errmsg'] ?? 'Unknown WeChat error',
                $data['errcode'],
                $data
            );
        }
    }

    protected function createResourceOwner(array $response, AccessToken $token): WeChatResourceOwner
    {
        return new WeChatResourceOwner($response);
    }
}
