import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ToolPage} from '#/main/core/tool'

import {TeamForm} from '#/main/community/team/components/form'
import {selectors} from '#/main/community/tools/community/team/store'
import {PageContent} from '#/main/app/page'

const TeamCreate = (props) =>
  <ToolPage
    title={trans('new_team', {}, 'community')}
  >
    <PageContent>
      <TeamForm
        className="mt-3"
        path={props.path}
        name={selectors.FORM_NAME}
      />
    </PageContent>
  </ToolPage>

TeamCreate.propTypes = {
  path: T.string
}

export {
  TeamCreate
}
