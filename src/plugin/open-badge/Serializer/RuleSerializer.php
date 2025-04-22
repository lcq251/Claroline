<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerInterface;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\OpenBadgeBundle\Entity\Rule;

class RuleSerializer
{
    use SerializerTrait;

    public function __construct(
        private readonly ObjectManager $om,
        private readonly SerializerProvider $serializer
    ) {
    }

    public function getName(): string
    {
        return 'open_badge_rule';
    }

    public function getClass(): string
    {
        return Rule::class;
    }

    public function serialize(Rule $rule, ?array $options = []): array
    {
        if (in_array(SerializerInterface::SERIALIZE_MINIMAL, $options)) {
            return [
                'id' => $rule->getUuid(),
                'type' => $rule->getAction(),
            ];
        }

        $serialized = [
            'id' => $rule->getUuid(),
            'type' => $rule->getAction(),
        ];

        if (!empty($rule->getData())) {
            $serialized['data'] = $rule->getData();
        }

        if ($rule->getSubjectClass() && $rule->getSubjectId()) {
            $subject = $this->om->getRepository($rule->getSubjectClass())->findOneBy([
                'uuid' => $rule->getSubjectId(),
            ]);

            if ($subject) {
                $serialized['subject'] = $this->serializer->serialize($subject, [SerializerInterface::SERIALIZE_MINIMAL]);
            }
        }

        return $serialized;
    }

    public function deserialize(array $data, Rule $rule, ?array $options = []): Rule
    {
        $rule->setAction($data['type']);

        $this->sipe('data', 'setData', $data, $rule);
        $this->sipe('subjectClass', 'setSubjectClass', $data, $rule);

        if (array_key_exists('subject', $data)) {
            $this->sipe('subject.id', 'setSubjectId', $data, $rule);
        }

        return $rule;
    }
}
