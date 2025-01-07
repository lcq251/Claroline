<?php

namespace Claroline\AppBundle\Controller;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Component\Context\ContextProvider;
use Claroline\AppBundle\Manager\ClientManager;
use Claroline\AppBundle\Manager\SecurityManager;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\LocaleManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Twig\Environment;

class PlatformController
{
    public function __construct(
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly TokenStorageInterface $tokenStorage,
        private readonly Environment $templating,
        private readonly ObjectManager $om,
        private readonly PlatformConfigurationHandler $config,
        private readonly LocaleManager $localeManager,
        private readonly SecurityManager $securityManager,
        private readonly ContextProvider $contextProvider,
        private readonly SerializerProvider $serializer,
        private readonly ClientManager $clientManager
    ) {
    }

    /**
     * Renders the Claroline web application.
     */
    #[Route(path: '/', name: 'claro_index', methods: ['GET'])]
    public function indexAction(): Response
    {
        $currentUser = null;
        if ($this->tokenStorage->getToken()?->getUser() instanceof User) {
            $currentUser = $this->tokenStorage->getToken()?->getUser();
        }

        $userPreferences = $this->clientManager->getUserPreferences($currentUser);

        return new Response(
            $this->templating->render('@ClarolineApp/index.html.twig', [
                'baseUrl' => $this->clientManager->getBaseUrl(),
                'parameters' => array_merge($this->clientManager->getParameters(), $userPreferences), // for retro-compatibility
                // 'userPreferences' => $this->clientManager->getUserPreferences($currentUser),

                'currentUser' => $currentUser ? $this->serializer->serialize(
                    $currentUser, [Options::SERIALIZE_MINIMAL]
                ) : null,
                'impersonated' => $this->securityManager->isImpersonated(),
                'contexts' => $this->contextProvider->getAvailableContexts(),
                'contextFavorites' => $this->contextProvider->getFavoriteContexts(),
                'currentOrganization' => $currentUser ? $this->serializer->serialize($currentUser->getMainOrganization(), [Options::SERIALIZE_MINIMAL]) : null,
                'footer' => [
                    'content' => $this->config->getParameter('footer.content'),
                    'display' => [
                        'show' => $this->config->getParameter('footer.show'),
                        'locale' => $this->config->getParameter('footer.show_locale'),
                        'help' => $this->config->getParameter('footer.show_help'),
                        // 'termsOfService' => $this->privacyManager->getTosEnabled($request->getLocale()),
                    ],
                ],

                // assets injected from plugins
                'javascripts' => $this->clientManager->getJavascripts(),
                'stylesheets' => $this->clientManager->getStylesheets(),
            ])
        );
    }

    /**
     * Change current user locale.
     */
    #[Route(path: '/locale/{locale}', name: 'claroline_locale_change', methods: ['GET'])]
    public function changeLocaleAction(Request $request, string $locale): RedirectResponse
    {
        $user = $this->tokenStorage->getToken()?->getUser();
        if ($user instanceof User) {
            $this->localeManager->setUserLocale($locale);
        }

        $request->setLocale($locale);
        $request->getSession()->set('_locale', $locale);

        return new RedirectResponse(
            $request->headers->get('referer')
        );
    }

    /**
     * Change current organization.
     */
    #[Route(path: '/o/{organization}', name: 'claro_organization_change', methods: ['GET', 'PUT'])]
    public function changeOrganizationAction(
        #[MapEntity(mapping: ['organization' => 'uuid'])]
        Organization $organization
    ): JsonResponse {
        $currentUser = $this->tokenStorage->getToken()?->getUser();
        if (!$this->authorization->isGranted('IS_AUTHENTICATED_FULLY') || !$currentUser->hasOrganization($organization)) {
            throw new AccessDeniedException();
        }

        $currentUser->setMainOrganization($organization);
        $this->om->persist($currentUser);
        $this->om->flush();

        return new JsonResponse(null, 204);
    }

    #[Route(path: '/manifest', name: 'claro_manifest', methods: ['GET'])]
    public function getManifestAction(Request $request): JsonResponse
    {
        $response = new JsonResponse([
            // the primary locale of the app as a valid HTML language attribute
            // (see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang)
            'lang' => $this->localeManager->getUserLocale($request),

            // the name of the web application as it is usually displayed to the user
            'name' => $this->config->getParameter('name'),
            // a shorter variant of the app name to be displayed when there is not
            // enough space (e.g. as a label for an icon on the phone home screen).
            'short_name' => $this->config->getParameter('name'),

            // use it to explain what the application does
            'description' => $this->config->getParameter('meta.description'),

            // the preferred URL to be loaded when the user launches the web app
            // (this is just a hint, so user agents can ignore this value)
            'start_url' => $this->clientManager->getBaseUrl(),

            // the preferred orientation of the web app contents
            // (see https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation)
            'orientation' => 'any',

            // determines how much of browser interface is displayed when running the app
            // "browser" = display the full browser window; "fullscreen" = display no browser interface
            // (see https://developer.mozilla.org/en-US/docs/Web/Manifest/display)
            'display' => 'fullscreen',

            // the placeholder background color used for the app before its stylesheet is loaded
            // Once the stylesheet is loaded, the real background color from the app is used
            // 'background_color' => '#42a7ff',
            // the default theme color for the application, which affects how the operating system
            // displays the site (e.g. on Android's task switcher, the theme color surrounds the site)
            // 'theme_color' => 'rgb(29, 164, 14)',

            // an array of objects representing image files that can serve as app icons for different contexts
            // (see https://developer.mozilla.org/en-US/docs/Web/Manifest/icons)
            'icons' => [
                /*{ "src": "icon/lowres.webp", "sizes": "48x48", "type": "image/webp" },
                { "src": "icon/lowres", "sizes": "48x48" },
                { "src": "icon/hd_hi.ico", "sizes": "72x72 96x96 128x128 256x256" },
                { "src": "icon/hd_hi.svg", "sizes": "any" }*/
            ],
        ]);

        $response->headers->set('Content-Type', 'application/manifest+json');

        return $response;
    }
}
