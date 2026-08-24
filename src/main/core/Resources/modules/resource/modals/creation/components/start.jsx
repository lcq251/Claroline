import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ContentMenu} from '#/main/app/content/components/menu'

import {MODAL_RESOURCES} from '#/main/core/modals/resources'

const CreationStart = props =>
  <div className="modal-body" role="presentation">
    <ContentMenu
      className="mb-3"
      items={[
        {
          id: 'create-empty',
          icon: 'plus',
          label: trans('create_empty', {}, 'resource'),
          description: trans('create_empty_desc', {}, 'resource'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => props.changeStep('type')
          }
        }, {
          id: 'create-directory',
          icon: 'folder',
          label: trans('create_directory', {}, 'resource'),
          description: trans('create_directory_desc', {}, 'resource'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => {
              props.startCreation('directory', {meta: {published: true}})
              props.changeStep('info')
            }
          }
        }, {
          id: 'create-from-file',
          icon: 'file',
          label: trans('create_from_file', {}, 'resource'),
          description: trans('create_from_file_desc', {}, 'resource'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => props.changeStep('file')
          },
          group: trans('from_existing_content', {}, 'resource')
        }, {
          id: 'create-from-url',
          icon: 'link',
          label: trans('create_from_url', {}, 'resource'),
          description: trans('create_from_url_desc', {}, 'resource'),
          action: {
            type: CALLBACK_BUTTON,
            callback: () => props.changeStep('url')
          },
          group: trans('from_existing_content', {}, 'resource')
        }, {
          id: 'create-shortcut',
          icon: 'arrow-up-right-from-square',
          label: trans('create_shortcut', {}, 'resource'),
          description: trans('create_shortcut_desc', {}, 'resource'),
          action: {
            type: MODAL_BUTTON,
            modal: [MODAL_RESOURCES, {
              contextId: props.contextId,
              multiple: false,
              selectAction: (selected) => ({
                type: CALLBACK_BUTTON,
                callback: () => {
                  props.startCreation('shortcut', {
                    name: selected[0].name,
                    code: selected[0].code,
                    poster: selected[0].poster,
                    meta: {
                      published: true,
                      description: get(selected[0], 'meta.description')
                    }
                  }, {
                    target: merge({}, selected[0])
                  })

                  props.changeStep('info')
                }
              })
            }]
          }
        }, {
          id: 'create-from-copy',
          icon: 'clone',
          label: trans('create_from_copy', {}, 'resource'),
          description: trans('create_from_copy_desc', {}, 'resource'),
          action: {
            type: MODAL_BUTTON,
            modal: [MODAL_RESOURCES, {
              contextId: props.contextId,
              multiple: false,
              selectAction: (selected) => ({
                type: CALLBACK_BUTTON,
                callback: () => {
                  props.startCreation(get(selected[0], 'meta.type'), merge({}, selected[0]))
                  props.changeStep('info')
                }
              })
            }]
          },
          group: trans('from_existing_content', {}, 'resource')
        },
      ]}
    />
  </div>

CreationStart.propTypes = {
  contextId: T.string,
  changeStep: T.func.isRequired,
  startCreation: T.func.isRequired
}

export {
  CreationStart
}
