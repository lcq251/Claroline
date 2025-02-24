<?php

namespace Claroline\EvaluationBundle\Serializer\Sequence;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CommunityBundle\Repository\RoleRepository;
use Claroline\CommunityBundle\Serializer\RoleSerializer;
use Claroline\CoreBundle\Entity\Role;
use Claroline\EvaluationBundle\Entity\Sequence\Assignment;
use Claroline\EvaluationBundle\Entity\Sequence\Requirement;
use Claroline\EvaluationBundle\Entity\Sequence\Sequence;
use Claroline\EvaluationBundle\Repository\SequenceRepository;

class AssignmentSerializer
{
    use SerializerTrait;

    private RoleRepository $roleRepo;
    private SequenceRepository $sequenceRepo;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly RoleSerializer $roleSerializer,
        // private readonly SequenceSerializer $sequenceSerializer
    ) {
        $this->roleRepo = $om->getRepository(Role::class);
        $this->sequenceRepo = $om->getRepository(Sequence::class);
    }

    public function getClass(): string
    {
        return Assignment::class;
    }

    public function getName(): string
    {
        return 'sequence_assignment';
    }

    public function serialize(Assignment $assignment, array $options = []): array
    {
        return [
            // 'id' => $assignment->getUuid(),
            'required' => $assignment->isRequired(),
            'scored' => $assignment->isScored(),
            'role' => $assignment->getRole() ?
                $this->roleSerializer->serialize($assignment->getRole(), [SerializerInterface::SERIALIZE_MINIMAL]) : null,
            /*'sequence' => $assignment->getSequence() ?
                $this->sequenceSerializer->serialize($assignment->getSequence(), [SerializerInterface::SERIALIZE_MINIMAL]) : null,*/
        ];
    }

    public function deserialize(array $data, Assignment $assignment, array $options = []): Assignment
    {
        /*if (!in_array(SerializerInterface::REFRESH_UUID, $options)) {
            $this->sipe('id', 'setUuid', $data, $assignment);
        } else {
            $assignment->refreshUuid();
        }*/

        $this->sipe('required', 'setRequired', $data, $assignment);
        $this->sipe('scored', 'setScored', $data, $assignment);

        if (array_key_exists('sequence', $data)) {
            $sequence = isset($data['sequence']['id']) ?
                $this->sequenceRepo->findOneBy(['uuid' => $data['sequence']['id']]) :
                null;
            $assignment->setSequence($sequence);
        }

        if (array_key_exists('role', $data)) {
            $role = isset($data['role']['id']) ?
                $this->roleRepo->findOneBy(['uuid' => $data['role']['id']]) :
                null;
            $assignment->setRole($role);
        }

        return $assignment;
    }
}
