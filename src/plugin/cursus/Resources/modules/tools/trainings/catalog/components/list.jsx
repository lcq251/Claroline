import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageListSection} from '#/main/app/page'

import {CourseList} from '#/plugin/cursus/course/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/catalog/store'
import {MODAL_COURSE_TYPE_CREATION} from '#/plugin/cursus/course/modals/creation'

const CatalogList = (props) =>
  <ToolPage
    title={trans('catalog', {}, 'cursus')}
  >
    <PageListSection
      title={trans('catalog', {}, 'cursus')}
      addAction={{
        name: 'add',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_course', {}, 'cursus'),
        modal: [MODAL_COURSE_TYPE_CREATION, {
          path: props.path + '/course'
        }],
        displayed: props.canEdit,
        primary: true
      }}
    >
      <CourseList
        className="mb-5"
        flush={true}
        autoFocus={true}
        path={props.path}
        name={selectors.LIST_NAME}
        url={['apiv2_cursus_course_list']}
      />
    </PageListSection>
  </ToolPage>

CatalogList.propTypes = {
  path: T.string.isRequired,
  canEdit: T.bool.isRequired,
  contextType: T.string
}

export {
  CatalogList
}
