<?php

namespace Claroline\EvaluationBundle\Serializer\Sequence;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Serializer\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\CoreBundle\Repository\Resource\ResourceNodeRepository;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Entity\Sequence\Step;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class SequenceSerializer
{
    use SerializerTrait;

    private ResourceNodeRepository $resourceNodeRepo;

    public function __construct(
        private readonly AuthorizationCheckerInterface $authorization,
        private readonly ObjectManager $om,
        private readonly UserSerializer $userSerializer,
        private readonly WorkspaceSerializer $workspaceSerializer,
        private readonly ResourceNodeSerializer $resourceNodeSerializer,
        private readonly StepSerializer $stepSerializer
    ) {
        $this->resourceNodeRepo = $om->getRepository(ResourceNode::class);
    }

    public function getClass(): string
    {
        return Sequence::class;
    }

    public function getSchema(): string
    {
        return '#/main/evaluation/sequence.json';
    }

    public function getName(): string
    {
        return 'sequence';
    }

    public function serialize(Sequence $sequence, array $options = []): array
    {
        $serializedWorkspace = null;
        if ($sequence->getWorkspace()) {
            $serializedWorkspace = $this->workspaceSerializer->serialize($sequence->getWorkspace(), [SerializerInterface::SERIALIZE_MINIMAL]);
        }

        if (in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            return [
                'id' => $sequence->getUuid(),
                'name' => $sequence->getName(),
                'code' => $sequence->getCode(),
                'thumbnail' => $sequence->getThumbnail(),
                'meta' => [
                    'description' => $sequence->getDescription(),
                    'published' => $sequence->isPublished(), // not required but nice to have
                ],
                // for now this is required in the minimal representation to generate the correct sequence path
                'workspace' => $serializedWorkspace,
            ];
        }

        $serialized = [
            'id' => $sequence->getUuid(),
            'autoId' => $sequence->getId(),
            'name' => $sequence->getName(),
            'code' => $sequence->getCode(),
            'thumbnail' => $sequence->getThumbnail(),
            'poster' => $sequence->getPoster(),
            'meta' => [
                'description' => $sequence->getDescription(),
                'descriptionHtml' => $sequence->getDescriptionHtml(),
                'creator' => $sequence->getCreator() ?
                    $this->userSerializer->serialize($sequence->getCreator(), [SerializerInterface::SERIALIZE_MINIMAL]) :
                    null,
                'created' => DateNormalizer::normalize($sequence->getCreatedAt()),
                'updated' => DateNormalizer::normalize($sequence->getUpdatedAt()),
                'published' => $sequence->isPublished(),
            ],
            'workspace' => $serializedWorkspace,
            'display' => [
                'numbering' => $sequence->getNumbering() ?: 'none',
                'showScore' => $sequence->getShowScore(),
            ],
            'opening' => [
                'secondaryResources' => $sequence->getSecondaryResourcesTarget(),
            ],
            'steps' => array_values(array_map(function (Step $step) use ($options) {
                return $this->stepSerializer->serialize($step, $options);
            }, $sequence->getRootSteps())),
            'score' => [
                'success' => $sequence->getSuccessScore(),
                'total' => $sequence->getScoreTotal(),
            ],
            'evaluation' => [
                'evaluated' => $sequence->isEvaluated(),
                'required' => $sequence->isRequired(),
                'estimatedDuration' => $sequence->getEstimatedDuration(),
                'endMessage' => $sequence->getEndMessage(),
                'successMessage' => $sequence->getSuccessMessage(),
                'failureMessage' => $sequence->getFailureMessage(),
            ],
            'overview' => [
                'resource' => $sequence->getOverviewResource() ? $this->resourceNodeSerializer->serialize($sequence->getOverviewResource(), [SerializerInterface::SERIALIZE_MINIMAL]) : null,
            ],
            'end' => [
                // 'message' => $sequence->getEndMessage(),
                // 'navigation' => $sequence->hasEndNavigation(),
                'back' => [
                    'type' => $sequence->getEndBackType(),
                    'label' => $sequence->getEndBackLabel(),
                    'target' => $sequence->getEndBackTarget() ? $this->resourceNodeSerializer->serialize($sequence->getEndBackTarget(), [SerializerInterface::SERIALIZE_MINIMAL]) : null,
                ],
            ],
            'restrictions' => [
                'dates' => DateRangeNormalizer::normalize($sequence->getAccessibleFrom(), $sequence->getAccessibleUntil()),
            ],
        ];

        if (!in_array(SerializerInterface::SERIALIZE_TRANSFER, $options)) {
            $administrate = $this->authorization->isGranted('ADMINISTRATE', $sequence);

            $serialized['permissions'] = [
                'open' => $administrate || $this->authorization->isGranted('OPEN', $sequence),
                'delete' => $administrate,
                'edit' => $administrate || $this->authorization->isGranted('EDIT', $sequence),
                'administrate' => $administrate,
            ];
        }

        return $serialized;
    }

    public function deserialize(array $data, Sequence $sequence, array $options = []): Sequence
    {
        if (!in_array(SerializerInterface::REFRESH_UUID, $options)) {
            $this->sipe('id', 'setUuid', $data, $sequence);
            $this->sipe('slug', 'setSlug', $data, $sequence);
        } else {
            $sequence->refreshUuid();
        }

        $this->sipe('name', 'setName', $data, $sequence);
        $this->sipe('code', 'setCode', $data, $sequence);
        $this->sipe('poster', 'setPoster', $data, $sequence);
        $this->sipe('thumbnail', 'setThumbnail', $data, $sequence);
        $this->sipe('meta.published', 'setPublished', $data, $sequence);
        $this->sipe('meta.description', 'setDescription', $data, $sequence);
        $this->sipe('meta.descriptionHtml', 'setDescriptionHtml', $data, $sequence);

        $this->sipe('display.numbering', 'setNumbering', $data, $sequence);
        $this->sipe('display.showScore', 'setShowScore', $data, $sequence);

        $this->sipe('opening.secondaryResources', 'setSecondaryResourcesTarget', $data, $sequence);

        $this->sipe('score.success', 'setSuccessScore', $data, $sequence);
        $this->sipe('score.total', 'setScoreTotal', $data, $sequence);

        if (isset($data['evaluation'])) {
            $this->sipe('evaluation.endMessage', 'setEndMessage', $data, $sequence);
            $this->sipe('evaluation.successMessage', 'setSuccessMessage', $data, $sequence);
            $this->sipe('evaluation.failureMessage', 'setFailureMessage', $data, $sequence);

            $this->sipe('evaluation.evaluated', 'setEvaluated', $data, $sequence);
            $this->sipe('evaluation.required', 'setRequired', $data, $sequence);
            $this->sipe('evaluation.estimatedDuration', 'setEstimatedDuration', $data, $sequence);
        }

        if (!empty($data['workspace'])) {
            $workspace = $this->om->getRepository(Workspace::class)->findOneBy(['uuid' => $data['workspace']['id']]);
            if ($workspace) {
                $sequence->setWorkspace($workspace);
            }
        }

        if (!empty($data['overview'])) {
            if (array_key_exists('resource', $data['overview'])) {
                $overviewResource = null;
                if (!empty($data['overview']['resource'])) {
                    $overviewResource = $this->resourceNodeRepo->findOneBy(['uuid' => $data['overview']['resource']['id']]);
                }

                $sequence->setOverviewResource($overviewResource);
            }
        }

        if (!empty($data['end'])) {
            // $this->sipe('end.message', 'setEndMessage', $data, $sequence);
            // $this->sipe('end.navigation', 'setEndNavigation', $data, $sequence);

            if (!empty($data['end']['back'])) {
                $this->sipe('end.back.type', 'setEndBackType', $data, $sequence);
                $this->sipe('end.back.label', 'setEndBackLabel', $data, $sequence);

                if (array_key_exists('target', $data['end']['back'])) {
                    $targetResource = null;
                    if (!empty($data['end']['back']['target'])) {
                        $targetResource = $this->resourceNodeRepo->findOneBy(['uuid' => $data['end']['back']['target']['id']]);
                    }

                    $sequence->setEndBackTarget($targetResource);
                }
            }
        }

        if (isset($data['restrictions']['dates'])) {
            $dateRange = DateRangeNormalizer::denormalize($data['restrictions']['dates']);

            $sequence->setAccessibleFrom($dateRange[0]);
            $sequence->setAccessibleUntil($dateRange[1]);
        }

        if (isset($data['steps'])) {
            $this->deserializeSteps($data['steps'] ?? [], $sequence, $options);
        }

        return $sequence;
    }

    private function deserializeSteps(array $stepsData, Sequence $sequence, array $options = []): void
    {
        $ids = [];

        // updates steps
        foreach ($stepsData as $stepIndex => $stepData) {
            if ($stepData['id']) {
                $step = $sequence->getStep($stepData['id']);
            }

            if (empty($step)) {
                $step = new Step();
            }

            $step->setPath($sequence);
            $step->setOrder($stepIndex);

            $this->stepSerializer->deserialize($step, $stepData, $options);
            $ids[] = $step->getUuid();
        }

        // removes steps which no longer exists
        $currentSteps = $sequence->getRootSteps();
        foreach ($currentSteps as $currentStep) {
            if (!in_array($currentStep->getUuid(), $ids)) {
                $currentStep->setPath(null);
            }
        }
    }
}
