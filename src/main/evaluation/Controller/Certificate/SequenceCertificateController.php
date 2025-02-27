<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\EvaluationBundle\Controller\Certificate;

use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\TextNormalizer;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\UserEvaluation\SequenceEvaluation;
use Claroline\EvaluationBundle\Manager\SequenceCertificateManager;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

#[Route(path: '/sequence_certificate')]
class SequenceCertificateController
{
    use RequestDecoderTrait;
    use PermissionCheckerTrait;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly SequenceCertificateManager $certificateManager
    ) {
        $this->authorization = $authorization;
    }

    #[Route(path: '/', name: 'apiv2_sequence_download_certificate', methods: ['POST'])]
    public function downloadCertificateAction(Request $request): BinaryFileResponse
    {
        $sequenceEvaluationIds = $this->decodeRequest($request);

        if (!empty($sequenceEvaluationIds)) {
            $sequenceEvaluations = $this->om->getRepository(SequenceEvaluation::class)->findBy(['uuid' => $sequenceEvaluationIds]);
            if (!empty($sequenceEvaluations)) {
                $sequence = $sequenceEvaluations[0]->getSequence();

                return $this->downloadCertificates($sequence, $sequenceEvaluations);
            }
        }

        throw new NotFoundHttpException('No sequence evaluation found.');
    }

    #[Route(path: '/{sequence}/all', name: 'apiv2_sequence_download_all_certificates', methods: ['GET'])]
    public function downloadAllCertificatesAction(
        #[MapEntity(mapping: ['sequence' => 'uuid'])]
        Sequence $sequence
    ): BinaryFileResponse {
        $sequenceEvaluations = $this->om->getRepository(SequenceEvaluation::class)->findBy([
            'sequence' => $sequence,
        ]);

        return $this->downloadCertificates($sequence, $sequenceEvaluations);
    }

    #[Route(path: '/{sequence}/user/{user}', name: 'apiv2_sequence_download_user_certificate', methods: ['GET'])]
    public function downloadUserCertificateAction(
        #[MapEntity(mapping: ['sequence' => 'uuid'])]
        Sequence $sequence,
        #[MapEntity(mapping: ['user' => 'uuid'])]
        User $user
    ): BinaryFileResponse {
        $sequenceEvaluations = $this->om->getRepository(SequenceEvaluation::class)->findBy([
            'sequence' => $sequence,
            'user' => $user,
        ]);

        return $this->downloadCertificates($sequence, $sequenceEvaluations);
    }

    #[Route(path: '/{evaluation}/generate', name: 'apiv2_sequence_generate_user_certificate', methods: ['GET'])]
    public function regenerateUserCertificateAction(
        #[MapEntity(mapping: ['evaluation' => 'uuid'])]
        SequenceEvaluation $evaluation
    ): BinaryFileResponse {
        $this->checkPermission('OPEN', $evaluation, [], true);

        return $this->downloadCertificates($evaluation->getSequence(), [$evaluation], true);
    }

    #[Route(path: '/regenerate', name: 'apiv2_sequence_regenerate_certificate', methods: ['POST'])]
    public function regenerateCertificateAction(Request $request): BinaryFileResponse
    {
        $sequenceEvaluationIds = $this->decodeRequest($request);

        if (!empty($sequenceEvaluationIds)) {
            $sequenceEvaluations = $this->om->getRepository(SequenceEvaluation::class)->findBy(['uuid' => $sequenceEvaluationIds]);
            if (!empty($sequenceEvaluations)) {
                return $this->downloadCertificates($sequenceEvaluations[0]->getSequence(), $sequenceEvaluations, true);
            }
        }

        throw new NotFoundHttpException('No sequence evaluation found.');
    }

    private function downloadCertificates(Sequence $sequence, array $sequenceEvaluations, bool $regenerate = false): BinaryFileResponse
    {
        if (empty($sequenceEvaluations)) {
            throw new NotFoundHttpException('No sequence evaluation found.');
        }

        $certificateFiles = [];
        foreach ($sequenceEvaluations as $evaluation) {
            if ($this->checkPermission('OPEN', $evaluation)) {
                $certificateFiles[] = $this->certificateManager->getCertificate($evaluation, $regenerate);
            }
        }

        if (empty($certificateFiles)) {
            throw new NotFoundHttpException('No certificate is available yet.');
        }

        if (count($certificateFiles) > 1) {
            $archive = $this->certificateManager->createArchive($certificateFiles);

            return new BinaryFileResponse($archive, 200, [
                'Content-Type' => 'application/zip',
                'Content-Disposition' => 'attachment; filename='.TextNormalizer::toKey($sequence->getName()).'.zip',
            ]);
        }

        return new BinaryFileResponse($certificateFiles[0], 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename='.TextNormalizer::toKey($sequence->getName()).'.pdf',
        ]);
    }
}
