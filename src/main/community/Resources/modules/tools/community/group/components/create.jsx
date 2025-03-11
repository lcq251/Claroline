import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'

import {GroupForm} from '#/main/community/group/components/form'
import {selectors} from '#/main/community/tools/community/group/store'
import {PageContent} from '#/main/app/page'

const GroupCreate = (props) =>
  <ToolPage
    title={trans('new_group', {}, 'community')}
  >
    <PageContent>
      <GroupForm
        className="mt-3"
        path={props.path}
        name={selectors.FORM_NAME}
      />
    </PageContent>
  </ToolPage>

GroupCreate.propTypes = {
  path: T.string
}

export {
  GroupCreate
}
