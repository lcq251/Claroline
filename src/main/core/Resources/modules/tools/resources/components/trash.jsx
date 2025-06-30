import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {selectors} from '#/main/core/tools/resources/store'
import {ToolPage} from '#/main/core/tool'

import {ResourceList} from '#/main/core/resource/components/list'
import {PageListSection} from '#/main/app/page'

const ResourcesTrash = (props) =>
  <ToolPage
    title={trans('trash')}
  >
    <PageListSection
      title={trans('trash')}
    >
      <ResourceList
        className="mb-5"
        path={props.path}
        name={selectors.STORE_NAME+ '.trash'}
        url={['claro_resource_archive_list', {
          workspace: props.contextId
        }]}
      />
    </PageListSection>
  </ToolPage>

ResourcesTrash.propTypes = {
  path: T.string.isRequired,
  contextId: T.string.isRequired
}

export {
  ResourcesTrash
}
