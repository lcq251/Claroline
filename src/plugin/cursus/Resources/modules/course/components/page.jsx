import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ContentLoader} from '#/main/app/content/components/loader'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {ToolPage, selectors as toolSelectors} from '#/main/core/tool'

import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'

const Course = (props) => {

  return (
    <ToolPage
      title={get(props.course, 'name', trans('loading'))}
      poster={get(props.course, 'poster')}
      description={get(props.course, 'description')}
      breadcrumb={[
        /*{
          type: LINK_BUTTON,
          label: get(props.course, 'name', trans('loading')),
          target: !isEmpty(props.course) ? route(props.course, null, props.basePath) : ''
        }*/
      ].concat(props.course ? props.breadcrumb : [])}
    >
      {isEmpty(props.course) &&
        <ContentLoader
          size="lg"
          description={trans('training_loading', {}, 'cursus')}
        />
      }

      {!isEmpty(props.course) && props.children}
    </ToolPage>
  )
}

Course.propTypes = {
  path: T.string,
  basePath: T.string.isRequired,
  breadcrumb: T.array,
  course: T.shape(
    CourseTypes.propTypes
  ),
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  currentUser: T.object,
  contextType: T.string,
  children: T.any
}

Course.defaultProps = {
  breadcrumb: []
}

const CoursePage = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state),
    contextType: toolSelectors.contextType(state),
    basePath: toolSelectors.path(state)
  })
)(Course)

export {
  CoursePage
}
