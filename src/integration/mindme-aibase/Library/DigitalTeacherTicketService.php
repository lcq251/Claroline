<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\AibaseBundle\Library;

use Psr\Cache\CacheItemPoolInterface;

/**
 * One-time ticket issuing/validation for the ai-avatar-bot widget iframe.
 *
 * The widget (served from a separate nginx sidecar) is gated by an
 * `auth_request` subrequest: when the player opens the iframe it first asks
 * Claroline for a short-lived ticket (issue), then the nginx `/widget.html`
 * location sends the ticket to `/digital-teacher/validate` (validate). A ticket
 * is single-use and expires after 60s.
 *
 * Tickets are held in the app cache (no DB rows). The payload only carries
 * opaque ids (resource node id + user id) — never secrets.
 */
class DigitalTeacherTicketService
{
    private const TTL = 60;

    public function __construct(
        private readonly CacheItemPoolInterface $cache,
    ) {
    }

    /**
     * Issues a single-use ticket bound to a resource node and a user.
     */
    public function issue(int $nodeId, int $userId): string
    {
        $ticket = bin2hex(random_bytes(24));
        $item = $this->cache->getItem('dt_ticket_'.$ticket);
        $item->set(['nodeId' => $nodeId, 'userId' => $userId]);
        $item->expiresAfter(self::TTL);
        $this->cache->save($item);

        return $ticket;
    }

    /**
     * Validates (and atomically consumes) a ticket.
     *
     * @return array{nodeId: int, userId: int}|null null when invalid/expired/already used
     */
    public function validate(string $ticket): ?array
    {
        $ticket = trim($ticket);
        if ('' === $ticket) {
            return null;
        }

        $item = $this->cache->getItem('dt_ticket_'.$ticket);
        if (!$item->isHit()) {
            return null;
        }

        $data = $item->get();
        $this->cache->deleteItem('dt_ticket_'.$ticket);

        return is_array($data) && isset($data['nodeId']) ? $data : null;
    }
}
