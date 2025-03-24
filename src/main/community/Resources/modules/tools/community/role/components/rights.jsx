import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {Role as RoleTypes} from '#/main/community/role/prop-types'
import {MODAL_ROLE_RIGHTS} from '#/main/community/tools/community/role/modals/rights'

const RightsTable = (props) => {
  const allPerms = uniq(Object.keys(props.rights)
    .reduce((accumulator, current) => accumulator.concat(
      Object.keys(props.rights[current])
    ), []))

  return (
    <table className={classes('table table-striped table-hover content-rights-advanced', props.className)}>
      <thead>
        <tr>
          <th scope="col">{trans('tool')}</th>

          {allPerms.map(permission =>
            <th key={`${permission}-header`} scope="col">
              <div className="permission-name-container">
                <span className="permission-name">{trans(permission, {}, 'actions')}</span>
              </div>
            </th>
          )}
        </tr>
      </thead>

      <tbody>
        {Object.keys(props.rights).map((toolName) => (
          <tr key={toolName}>
            <th scope="row">{trans(toolName, {}, 'tools')}</th>
            {allPerms.map(toolPerm => (
              <td
                key={toolPerm}
                className="checkbox-cell"
              >
                {!isUndefined(props.rights[toolName][toolPerm]) &&
                  <input
                    type="checkbox"
                    checked={get(props.rights, `${toolName}.${toolPerm}`, false)}
                    disabled={true}
                  />
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

RightsTable.propsTypes = {
  rights: T.object
}

const RoleRights = (props) =>
  <>
    {hasPermission('administrate', props.role) &&
      <Button
        className=" btn btn-primary mt-4 me-auto"
        {...{
          name: 'edit-rights',
          type: MODAL_BUTTON,
          label: trans('edit_permissions', {}, 'actions'),
          modal: [MODAL_ROLE_RIGHTS, {
            title: props.title,
            role: props.role,
            contextType: props.contextType,
            contextId: props.contextId,
            rights: props.rights,
            onSave: () => props.reload(props.role.id, props.contextId)
          }]
        }}
      />
    }

    {!isEmpty(props.rights) &&
      <RightsTable
        className="mt-4 mb-5"
        rights={props.rights}
      />
    }
  </>

RoleRights.propTypes = {
  contextType: T.string.isRequired,
  contextId: T.string,
  role: T.shape(RoleTypes.propTypes),
  rights: T.object,
  reload: T.func.isRequired
}

export {
  RoleRights
}
