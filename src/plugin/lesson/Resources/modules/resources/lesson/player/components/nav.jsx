import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LinkButton} from '#/main/app/buttons'

import {getNumbering} from '#/plugin/lesson/resources/lesson/utils'
import {selectors} from '#/plugin/lesson/resources/lesson/store'

const LessonPlayerNav = (props) => {
  const showOverview = useSelector(selectors.showOverview)
  const numbering = useSelector(selectors.numbering)

  const next = useSelector(selectors.nextPage)
  const nextNumbering = next ? getNumbering(numbering, props.treeData.children, next) : null

  const previous = useSelector(selectors.previousPage)
  const previousNumbering = previous ? getNumbering(numbering, props.treeData.children, previous) : null

  if (showOverview || previous || next) {
    return (
      <nav className="d-flex flex-row content-md px-2 mt-auto pb-5">
        {(previous || showOverview) &&
          <LinkButton
            className="btn btn-text-body focus-ring w-50 text-start d-flex flex-row align-items-center gap-4 justify-content-start"
            target={`${props.path}/${previous ? previous.slug : ''}`}
            exact={true}
          >
            <span className="fa fa-chevron-left fs-lg" aria-hidden={true} />

            <div className="d-flex flex-column overflow-hidden" role="presentation">
              <b>{trans('previous')}</b>
              {previous ?
                <span className="text-truncate fs-sm" role="presentation">
                  {previousNumbering ?
                    previousNumbering + ' ' + previous.title :
                    previous.title
                  }
                </span> :
                <span className="text-truncate fs-sm" role="presentation">
                  {trans('resource_overview', {}, 'resource')}
                </span>
              }
            </div>
          </LinkButton>
        }

        {next &&
          <LinkButton
            className="btn btn-text-body focus-ring w-50 text-end d-flex flex-row align-items-center gap-4 justify-content-end ms-auto"
            target={`${props.path}/${next.slug}`}
          >
            <div className="d-flex flex-column overflow-hidden" role="presentation">
              <b>{trans('next')}</b>
              <span className="text-truncate fs-sm" role="presentation">
                {nextNumbering ?
                  nextNumbering + ' ' + next.title :
                  next.title
                }
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
  path: T.string.isRequired,
  treeData: T.object
}

export {
  LessonPlayerNav
}
