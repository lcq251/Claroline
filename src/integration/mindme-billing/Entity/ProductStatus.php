<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Mindme\BillingBundle\Entity;

/**
 * Product status constants.
 * Only APPROVED status is defined (no approval process).
 */
class ProductStatus
{
    /** Product is approved and visible */
    public const APPROVED = 'approved';
}