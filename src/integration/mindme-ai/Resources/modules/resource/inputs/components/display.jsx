import React from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {useFetch} from '#/main/app/api/fetch'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {ResourceIcon} from '#/main/core/resource/components/icon'
import {route} from '#/main/core/resource'

import {API} from '#/integration/mindme-ai/resource/inputs/constants'

/**
 * Displays the list of resources used as inputs of a host resource.
 * Clicking on an input navigates to the target resource.
 *
 * @param {string} hostId - the uuid of the host ResourceNode
 */
const ResourceInputs = ({hostId}) => {
  const [data, status] = useFetch(`resourceInputs-${hostId}`, API(hostId))

  if ('pending' === status) {
    return null
  }

  const inputs = data || []

  if (0 === inputs.length) {
    return (
      <ContentPlaceholder
        icon="fa fa-plug"
        title={trans('no_inputs', {}, 'resource')}
      />
    )
  }

  return (
    <div className="resource-inputs">
      <h3>{trans('inputs', {}, 'resource')}</h3>

      <div className="d-flex flex-wrap gap-2">
        {inputs.map(input => {
          const target = input.target

          if (!target) {
            // dangling reference (the target resource has been deleted)
            return (
              <div key={input.id} className="card resource-input resource-input-deleted">
                <div className="card-body d-flex align-items-center gap-2">
                  <ResourceIcon mimeType={null} />
                  <span className="text-muted">{trans('resource_deleted', {}, 'resource')}</span>
                </div>
              </div>
            )
          }

          return (
            <a
              key={input.id}
              className="card resource-input"
              href={route(target)}
              title={target.name}
            >
              <div className="card-body d-flex align-items-center gap-2">
                <ResourceIcon mimeType={get(target, 'meta.mimeType')} />
                <span className="text-truncate">{target.name}</span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export {
  ResourceInputs
}
