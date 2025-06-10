import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {ModalEmpty} from '#/main/app/overlays/modal/components/empty'
import {Html} from '#/main/app/components/html'
import {DataMicro} from '#/main/app/data/components/micro'

const ConfirmModal = (props) =>
  <ModalEmpty
    {...omit(props, 'dangerous', 'question', 'additional', 'items', 'confirmAction')}
    centered={true}
    size="sm"
    enforceFocus={true}
  >
    <div className="modal-body mt-3" role="presentation">
      <Html className="lead" align="center">
        {props.question || trans('action_confirm_message')}
      </Html>

      {props.items && 0 < props.items.length &&
        <ul className="list-group list-group-flush border-top border-bottom mt-4">
          {props.items.map((item) =>
            <li key={item.id} className="list-group-item px-0">
              <DataMicro object={item} />
            </li>
          )}
        </ul>
      }

      {props.additional &&
        <Html className="text-body-secondary fw-bold mt-4" align="center">
          {props.additional}
        </Html>
      }

      {props.children}
    </div>

    <div className="modal-footer bg-transparent" role="toolbar">
      <Button
        className="btn btn-body flex-fill"
        label={props.cancel || trans('cancel', {}, 'actions')}
        type={CALLBACK_BUTTON}
        callback={props.fadeModal}
      />

      <Button
        label={trans('confirm', {}, 'actions')}
        {...omit(props.confirmAction, 'icon', 'tooltip', 'size', 'className')}
        className="flex-fill"
        variant="btn"
        onClick={props.fadeModal}
        dangerous={props.dangerous}
        primary={!props.dangerous}
      />
    </div>
  </ModalEmpty>

ConfirmModal.propTypes = {
  dangerous: T.bool,
  question: T.string.isRequired, // It can be plain text or HTML
  additional: T.string,
  items: T.arrayOf(T.shape({
    thumbnail: T.string,
    id: T.string.isRequired,
    name: T.string.isRequired
  })),
  cancel: T.oneOfType([T.bool, T.string]),
  confirmAction: T.shape(
    ActionTypes.propTypes
  ).isRequired,
  children: T.any,

  // from modal,
  fadeModal: T.func.isRequired
}

export {
  ConfirmModal
}
