import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'
import {Button} from '#/main/app/action'

import {getTypes} from '#/main/core/resource/utils'
import {ResourceIcon} from '#/main/core/resource/components/icon'

const CreationType = props => {
  const resourceTypes = getTypes()

  return (
    <>
      <div className="modal-body" role="presentation">
        <ContentMenu
          className="mb-3"
          color={false}
          search={true}
          items={resourceTypes
            .filter(resourceType => props.types.includes(resourceType.name))
            .filter(resourceType => ![
              'innova_path',
              'shortcut',
              'directory',
            ].includes(resourceType.name))
            .sort((a, b) => {
              if (trans(a.name, {}, 'resource') > trans(b.name, {}, 'resource')) {
                return 1
              } else if (trans(a.name, {}, 'resource') < trans(b.name, {}, 'resource')) {
                return -1
              }

              return 0
            })
            .map(resourceType => {
              return ({
                id: resourceType.name,
                icon: createElement(ResourceIcon, {
                  mimeType: `custom/${resourceType.name}`
                }),
                label: trans(resourceType.name, {}, 'resource'),
                description: trans(`${resourceType.name}_desc`, {}, 'resource'),
                action: {
                  type: CALLBACK_BUTTON,
                  callback: () => {
                    props.startCreation(resourceType.name)
                    if (!isEmpty(resourceType.adapters) && resourceType.requireAdapter) {
                      if (1 === resourceType.adapters.length) {
                        props.changeStep(resourceType.adapters[0])
                      } else {
                        props.changeStep('adapter')
                      }
                    } else {
                      props.changeStep('info')
                    }
                  }
                }
              })
            })
          }
        />
      </div>
      <div className="modal-footer">
        <Button
          type={CALLBACK_BUTTON}
          label={trans('back')}
          className="btn btn-text-body me-auto"
          callback={() => props.changeStep('start')}
        />
      </div>
    </>
  )
}

CreationType.propTypes = {
  types: T.arrayOf(T.string),
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationType
}
