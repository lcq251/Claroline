import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

import {getType} from '#/main/core/resource/utils'
import {ResourceIcon} from '#/main/core/resource/components/icon'
import {Button} from '#/main/app/action'

const CreationType = props =>
  <>
    <div className="modal-body" role="presentation">
      <ContentMenu
        className="mb-3"
        items={props.types
          .filter(name => !isEmpty(getType({meta: {type: name}})))
          .filter(resourceType => ![
            'icap_blog',
            'icap_wiki',
            'claroline_announcement_aggregate',
            'innova_path',
            'text',
            'file',
            'hevinci_url',
            'shortcut',
            'directory'
          ].includes(resourceType))
          .sort((a, b) => {
            if (trans(a, {}, 'resource') > trans(b, {}, 'resource')) {
              return 1
            } else if (trans(a, {}, 'resource') < trans(b, {}, 'resource')) {
              return -1
            }

            return 0
          })
          .map(name => {
            return ({
              id: name,
              icon: React.createElement(ResourceIcon, {
                mimeType: `custom/${name}`
              }),
              label: trans(name, {}, 'resource'),
              description: trans(`${name}_desc`, {}, 'resource'),
              action: {
                type: CALLBACK_BUTTON,
                callback: () => {
                  props.startCreation(name)
                  props.changeStep('info')
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

CreationType.propTypes = {
  types: T.arrayOf(T.string),
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationType
}
