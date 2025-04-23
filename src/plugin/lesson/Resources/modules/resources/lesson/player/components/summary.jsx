import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {hasPermission} from '#/main/app/security'
import {Tree} from '#/main/app/components/tree'
import {SearchMinimal} from '#/main/app/content/search/components/minimal'

import {selectors as resourceSelectors} from '#/main/core/resource'

const PlayerSummary = (props) => {
  const canAdd = useSelector((state) => hasPermission('edit', resourceSelectors.resourceNode(state)))

  return (
    <div className="d-flex flex-column h-100" role="presentation">
      <h2 className="app-page-aside-title">
        {props.title}
      </h2>

      <SearchMinimal
        className="mb-3"
        onSearch={() => true}
      />

      {props.showOverview &&
        <Button
          type={LINK_BUTTON}
          icon="fa fa-fw fa-home fs-sm"
          className="btn btn-text-body mx-n3 focus-ring text-start py-2 d-flex flex-row align-items-center"
          label={trans('resource_overview', {}, 'resource')}
          target={`${props.path}/`}
          exact={true}
          onClick={props.autoClose}
        />
      }

      <Tree
        className="mx-n1"
        items={props.summary}
        onClick={props.autoClose}
      />

      {canAdd &&
        <Button
          className="btn btn-text-body mt-auto mx-n3 mb-n2 focus-ring text-start"
          type={LINK_BUTTON}
          icon="fa fa-fw fa-plus"
          label={trans('add_page', {}, 'actions')}
          target={`${props.path}/new`}
          onClick={props.autoClose}
        />
      }
    </div>
  )
}

PlayerSummary.propTypes = {
  path: T.string.isRequired,
  title: T.string.isRequired,
  summary: T.array,
  showOverview: T.bool.isRequired,
  // from aside
  autoClose: T.func
}

export {
  PlayerSummary
}
