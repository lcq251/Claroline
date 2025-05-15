import React, {useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {param} from '#/main/app/config'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'
import {actions as listActions} from '#/main/app/content/list/store'

import {CourseCard} from '#/plugin/cursus/course/components/card'
import {getActions, getDefaultAction} from '#/plugin/cursus/course/utils'

import {DataMicro} from '#/main/app/data/components/micro'

const CourseList = (props) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(securitySelectors.currentUser)

  const refresher = useMemo(() => ({
    add:    () => dispatch(listActions.invalidateData(props.name)),
    update: () => dispatch(listActions.invalidateData(props.name)),
    delete: () => dispatch(listActions.invalidateData(props.name))
  }), [props.path])

  return (
    <ListData
      primaryAction={(row) => getDefaultAction(row, refresher, props.path, currentUser)}
      actions={(rows) => getActions(rows, refresher, props.path, currentUser)}
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
        }/*, {
          name: 'display.order',
          alias: 'order',
          type: 'number',
          label: trans('order'),
          displayable: false,
          filterable: false
        }*/
      ]}
      display={{
        current: listConst.DISPLAY_TILES
      }}

      {...omit(props, 'path', 'url', 'autoload')}

      name={props.name}
      fetch={{
        url: props.url,
        autoload: props.autoload
      }}
      card={CourseCard}
    />
  )
}

CourseList.propTypes = {
  path: T.string.isRequired,
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array])
}

CourseList.defaultProps = {
  url: ['apiv2_cursus_course_list'],
  autoload: true
}

export {
  CourseList
}
