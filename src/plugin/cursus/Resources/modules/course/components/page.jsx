import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {ContentLoader} from '#/main/app/content/components/loader'
import {ToolPage} from '#/main/core/tool'
import {PageContent} from '#/main/app/page'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'

const CoursePage = (props) =>
  <ToolPage
    title={trans('course_name', {name: get(props.course, 'name', trans('loading'))}, 'cursus')}
    description={get(props.course, 'plainDescription')}
  >
    {isEmpty(props.course) &&
      <ContentLoader
        size="lg"
        description={trans('training_loading', {}, 'cursus')}
      />
    }

    {!isEmpty(props.course) &&
      <PageContent poster={get(props.course, 'poster')}>
        {props.children}
      </PageContent>
    }
  </ToolPage>

CoursePage.propTypes = {
  course: T.shape(
    CourseTypes.propTypes
  ),
  children: T.any
}

export {
  CoursePage
}
