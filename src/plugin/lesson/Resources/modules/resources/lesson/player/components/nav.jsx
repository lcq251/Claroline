import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LinkButton} from '#/main/app/buttons'

import {selectors} from '#/plugin/lesson/resources/lesson/store'

const LessonPlayerNavSkeleton = () => {
  return (
    <nav className="d-flex flex-row content-md px-2 mt-auto pb-5">
      <span
        className="btn btn-text-body focus-ring w-50 text-start d-flex flex-row align-items-center gap-4 justify-content-start"
      >
        {/*<span className="fa fa-chevron-left fs-lg text-body-tertiary" aria-hidden={true} />*/}

        <div className="d-flex flex-column overflow-hidden flex-fill align-items-start gap-1" role="presentation">
          <b className="placeholder rounded-1">{trans('previous')}</b>
          <span className="text-truncate fs-sm placeholder rounded-1 w-75" role="presentation" />
        </div>
      </span>

      <span
        className="btn btn-text-body focus-ring w-50 text-end d-flex flex-row align-items-center gap-4 justify-content-end ms-auto"
      >
        <div className="d-flex flex-column overflow-hidden flex-fill align-items-end gap-1" role="presentation">
          <b className="placeholder rounded-1">{trans('next')}</b>
          <span className="text-truncate fs-sm placeholder rounded-1 w-75" role="presentation" />
        </div>

        {/*<span className="fa fa-chevron-right fs-lg text-body-tertiary" aria-hidden={true} />*/}
      </span>
    </nav>
  )
}

const LessonPlayerNav = (props) => {
  const nextPath = useSelector(selectors.nextPath)
  const nextTitle = useSelector(selectors.nextTitle)

  const previousPath = useSelector(selectors.previousPath)
  const previousTitle = useSelector(selectors.previousTitle)

  if (previousPath || nextPath) {
    return (
      <nav className="d-flex flex-row content-md px-2 mt-auto pb-5">
        {previousPath &&
          <LinkButton
            className="btn btn-text-body focus-ring w-50 text-start d-flex flex-row align-items-center gap-4 justify-content-start"
            target={props.path+previousPath}
            exact={true}
          >
            <span className="fa fa-chevron-left fs-lg" aria-hidden={true} />

            <div className="d-flex flex-column overflow-hidden flex-fill align-items-start" role="presentation">
              <b>{trans('previous')}</b>
              <span className="text-truncate fs-sm" role="presentation">
                {previousTitle}
              </span>
            </div>
          </LinkButton>
        }

        {nextPath &&
          <LinkButton
            className="btn btn-text-body focus-ring w-50 text-end d-flex flex-row align-items-center gap-4 justify-content-end ms-auto"
            target={props.path+nextPath}
          >
            <div className="d-flex flex-column overflow-hidden flex-fill align-items-end" role="presentation">
              <b>{trans('next')}</b>
              <span className="text-truncate fs-sm" role="presentation">
                {nextTitle}
              </span>
            </div>

            <span className="fa fa-chevron-right fs-lg" aria-hidden={true} />
          </LinkButton>
        }
      </nav>
    )
  }

  return null
}

LessonPlayerNav.propTypes = {
  path: T.string.isRequired
}

export {
  LessonPlayerNav,
  LessonPlayerNavSkeleton
}
