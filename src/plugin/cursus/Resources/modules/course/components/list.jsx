import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {param} from '#/main/app/config'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'
import {actions as listActions} from '#/main/app/content/list/store'

import {CourseCard} from '#/plugin/cursus/course/components/card'
import {getActions, getDefaultAction} from '#/plugin/cursus/course/utils'

import {ContentSizing} from '#/main/app/content/components/sizing'
import {DataMicro} from '#/main/app/data/components/micro'

const Courses = (props) => {
  const refresher = merge({
    add:    () => props.invalidate(props.name),
    update: () => props.invalidate(props.name),
    delete: () => props.invalidate(props.name)
  }, props.refresher || {})

  return (
    <ListData
      primaryAction={(row) => getDefaultAction(row, refresher, props.path, props.currentUser)}
      actions={(rows) => getActions(rows, refresher, props.path, props.currentUser)}
      definition={[
        {
          name: 'name',
          type: 'string',
          label: trans('name'),
          displayed: true,
          primary: true,
          render: (course) => <DataMicro object={course} />
        }, {
          name: 'plainDescription',
          type: 'string',
          label: trans('description'),
          sortable: false,
          options: {long: true}
        }, {
          name: 'code',
          type: 'string',
          label: trans('code')
        }, {
          name: 'location',
          type: 'location',
          label: trans('location'),
          displayable: false,
          sortable: false
        }, {
          name: 'meta.duration',
          alias: 'duration',
          type: 'number',
          label: trans('duration'),
          displayed: true,
          filterable: false,
          options: {unit: trans('hours')}
        }, {
          name: 'pricing.price',
          alias: 'price',
          label: trans('price'),
          type: 'currency',
          displayable: param('pricing.enabled'),
          filterable: false,
          sortable: param('pricing.enabled')
        }, {
          name: 'tags',
          type: 'tag',
          label: trans('tags'),
          sortable: false,
          options: {
            objectClass: 'Claroline\\CursusBundle\\Entity\\Course'
          }
        }, {
          name: 'display.order',
          alias: 'order',
          type: 'number',
          label: trans('order'),
          displayable: false,
          filterable: false
        }
      ]}
      display={{
        current: listConst.DISPLAY_TILES_SM
      }}

      {...omit(props, 'path', 'url', 'autoload', 'refresher', 'invalidate')}

      name={props.name}
      fetch={{
        url: props.url,
        autoload: props.autoload
      }}
      card={CourseCard}
    >
      <ContentSizing size="md" className="mt-4">
        {props.children}
      </ContentSizing>
    </ListData>
  )
}

Courses.propTypes = {
  path: T.string.isRequired,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]),
  currentUser: T.object,
  refresher: T.object,
  invalidate: T.func.isRequired,
  children: T.node
}

Courses.defaultProps = {
  url: ['apiv2_cursus_course_list'],
  autoload: true
}

const CourseList = connect(
  (state) => ({
    currentUser: securitySelectors.currentUser(state)
  }),
  (dispatch) => ({
    invalidate(name) {
      dispatch(listActions.invalidateData(name))
    }
  })
)(Courses)

export {
  CourseList
}
