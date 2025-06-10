<?php

namespace Claroline\ForumBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractType;
use Claroline\AppBundle\API\Finder\FinderBuilderInterface;
use Claroline\AppBundle\API\Finder\FinderInterface;
use Claroline\AppBundle\API\Finder\Type\BooleanType;
use Claroline\AppBundle\API\Finder\Type\CreatorType;
use Claroline\AppBundle\API\Finder\Type\DateType;
use Claroline\AppBundle\API\Finder\Type\EntityType;
use Claroline\AppBundle\API\Finder\Type\RelatedEntityType;
use Claroline\AppBundle\API\Finder\Type\TextType;
use Claroline\CoreBundle\Finder\ResourceNodeType;
use Claroline\CoreBundle\Finder\WorkspaceType;
use Claroline\ForumBundle\Entity\Message;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MessageType extends AbstractType
{
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Message::class,
            'fulltext' => ['content'],
        ]);
    }

    public function buildFinder(FinderBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('content', TextType::class)
            ->add('forum', RelatedEntityType::class)
            ->add('first', BooleanType::class)
            ->add('creator', CreatorType::class)
            ->add('flagged', BooleanType::class, ['default' => false])
            ->add('createdAt', DateType::class)
            ->add('updatedAt', DateType::class)
            ->add('parent', RelatedEntityType::class)
            ->add('resourceNode', ResourceNodeType::class, [
                'joinQuery' => function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    $this->joinResourceNode($queryBuilder, $finder, $finder->getAlias());
                },
            ])
            ->add('workspace', WorkspaceType::class, [
                'joinQuery' => function (QueryBuilder $queryBuilder, FinderInterface $finder): void {
                    $this->joinResourceNode($queryBuilder, $finder, $finder->getParent()->getAlias().'_resourceNode');
                    $queryBuilder->leftJoin($finder->getParent()->getAlias().'_resourceNode.workspace', $finder->getAlias());
                },
            ])
        ;
    }

    public function getParent(): ?string
    {
        return EntityType::class;
    }

    private function joinResourceNode(QueryBuilder $queryBuilder, FinderInterface $finder, string $finderAlias): void
    {
        $alias = $finder->getAlias();
        if (!$finder->isRoot()) {
            $alias = $finder->getParent()->getAlias();
        }

        $allAliases = $queryBuilder->getAllAliases();

        if (in_array($finderAlias, $allAliases)) {
            return;
        }

        $queryBuilder->leftJoin($alias.'.subject', 'subject');
        $queryBuilder->leftJoin('subject.forum', 'forum');
        $queryBuilder->leftJoin('forum.resourceNode', $finderAlias);
    }
}
