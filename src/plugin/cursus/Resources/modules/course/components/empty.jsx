import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ToolPage} from '#/main/core/tool'
import {trans} from '#/main/app/intl/translation'

import {ContentSizing} from '#/main/app/content/components/sizing'
import {CreationType} from '#/plugin/cursus/course/components/type'
import {PageContent} from '#/main/app/page'

const EmptyCourse = (props) =>
  <ToolPage>
    <PageContent>
      <ContentSizing size="lg">
        <p className="text-center my-5">
          <span className="h1 fa fa-graduation-cap mb-3 text-body-tertiary"/>
          <b className="h5 d-block">{trans('no_course', {}, 'cursus')}</b>
          <span className="text-body-secondary">{trans('no_course_help', {}, 'cursus')}</span>
        </p>
        <CreationType {...props} />
      </ContentSizing>
    </PageContent>
  </ToolPage>

EmptyCourse.propTypes = {
  path: T.string.isRequired,
  canEdit: T.bool.isRequired,
  contextId: T.string
}

export {
  EmptyCourse
}
