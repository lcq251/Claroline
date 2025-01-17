import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {LinkButton} from '#/main/app/buttons'
import {ProgressBar} from '#/main/app/components/progress-bar'

import {Chapter as ChapterTypes} from '#/plugin/lesson/resources/lesson/prop-types'
import {PageContent} from '#/main/app/page'

const LessonCurrent = props => {
  const currentIndex = props.all.findIndex(chapter => props.current.id === chapter.id)

  return (
    <PageContent>
      <ProgressBar
        className="progress-minimal"
        value={Math.floor(((currentIndex+1) / props.all.length) * 100)}
        size="xs"
        variant="learning"
      />

      {props.children}

      <nav className="lesson-navigation">
        {!isEmpty(props.all[currentIndex - 1]) &&
          <LinkButton
            className="btn-link btn-previous"
            size="lg"
            target={`${props.prefix}/${props.all[currentIndex - 1].slug}`}
            onClick={() => {
              if (props.onNavigate) {
                props.onNavigate(props.all[currentIndex - 1])
              }
            }}
          >
            <span className="fa fa-angle-double-left icon-with-text-right" aria-hidden={true} />
            {trans('previous')}
          </LinkButton>
        }

        {!isEmpty(props.all[currentIndex + 1]) &&
          <LinkButton
            className="btn-link btn-next"
            primary={true}
            size="lg"
            target={`${props.prefix}/${props.all[currentIndex + 1].slug}`}
            onClick={() => {
              if (props.onNavigate) {
                props.onNavigate(props.all[currentIndex + 1])
              }
            }}
          >
            {trans('next')}
            <span className="fa fa-angle-double-right icon-with-text-left" aria-hidden={true} />
          </LinkButton>
        }
      </nav>
    </PageContent>
  )
}

LessonCurrent.propTypes = {
  prefix: T.string.isRequired,
  current: T.shape(
    ChapterTypes.propTypes
  ),
  all: T.arrayOf(T.shape(
    ChapterTypes.propTypes
  )),
  onNavigate: T.func,
  // the current step content
  children: T.node
}

LessonCurrent.defaultProps = {
  all: []
}

export {
  LessonCurrent
}
