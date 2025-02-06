import React from 'react'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {selectors as resourceSelectors} from '#/main/core/resource'
import {selectors} from '#/plugin/lesson/resources/lesson/store'

import {trans} from '#/main/app/intl'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {PageSection} from '#/main/app/page/components/section'
import {PageContent} from '#/main/app/page'
import {Html} from '#/main/app/components/html'
import {ContentSummary} from '#/main/app/content/components/summary'
import {LINK_BUTTON} from '#/main/app/buttons'
import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'

const LessonPlayerOverview = () => {
  const resourcePath = useSelector(resourceSelectors.path)
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const showHeader = useSelector(resourceSelectors.showHeader)
  const embedded = useSelector(resourceSelectors.embedded)
  const description = get(resourceNode, 'meta.descriptionHtml', null)

  const numbering = useSelector(selectors.numbering)
  const tree = useSelector(selectors.treeData)
  const chapters = get(tree, 'children', [])

  function getChapterSummary(chapter) {
    return {
      id: chapter.id,
      type: LINK_BUTTON,
      numbering: getNumbering(numbering, chapters, chapter),
      label: chapter.title,
      target: `${resourcePath}/${chapter.slug}`,
      children: chapter.children ? chapter.children.map(getChapterSummary) : []
    }
  }

  return (
    <PageContent poster={showHeader ? get(resourceNode, 'poster') : undefined} className="d-flex flex-column">
      {description &&
        <PageSection size="md" className={classes({
          'pt-5': !embedded || showHeader
        })}>
          <Html className="content-text mb-5">{description}</Html>
        </PageSection>
      }

      <PageSection
        size="md"
        title={trans('summary')}
        className={classes({
          'mt-5': !description && (!embedded || showHeader)
        })}
      >
        {isEmpty(chapters) ?
          <ContentPlaceholder
            className="mb-5"
            title={trans('no_chapter', {}, 'lesson')}
            size="lg"
          /> :
          <ContentSummary
            className="mb-5"
            links={chapters.map(getChapterSummary)}
            noCollapse={true}
          />
        }
      </PageSection>
    </PageContent>
  )
}

export {
  LessonPlayerOverview
}
