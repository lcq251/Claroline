import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import omit from 'lodash/omit'

import {Modal} from '#/main/app/overlays'
import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {Button} from '#/main/app/action'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list'

import {Assertion as AssertionTypes} from '#/plugin/open-badge/prop-types'
import {MODAL_BADGE_EVIDENCE} from '#/plugin/open-badge/assertion/modals/evidence'
import {selectors} from '#/plugin/open-badge/assertion/modals/evidences/store'

const EvidencesModal = (props) =>
  <Modal
    {...omit(props, 'assertion')}
    title={trans('evidences', {}, 'badge')}
  >
    <ListData
      className="border-top"
      flush={true}
      name={selectors.STORE_NAME}
      fetch={{
        url: ['apiv2_badge_assertion_evidences', {assertion: props.assertion.id}],
        autoload: true
      }}
      primaryAction={(row) => ({
        type: MODAL_BUTTON,
        modal: [MODAL_BADGE_EVIDENCE, {
          evidence: row,
          assertion: props.assertion
        }],
        disabled: !hasPermission('administrate', props.assertion)
      })}
      delete={{
        url: ['apiv2_evidence_delete_bulk'],
        displayed: () => hasPermission('administrate', props.assertion)
      }}
      definition={[
        {
          name: 'name',
          type: 'translation',
          label: trans('name'),
          displayed: true,
          primary: true,
          options: {
            domain: 'badge'
          }
        }, {
          name: 'narrative',
          type: 'string',
          label: trans('description'),
          displayed: true
        }
      ]}
    />

    {hasPermission('administrate', props.assertion) &&
      <div className="modal-footer" role="presentation">
        <Button
          className="btn btn-primary"
          type={MODAL_BUTTON}
          label={trans('add_evidence', {}, 'badge')}
          modal={[MODAL_BADGE_EVIDENCE, {
            assertion: props.assertion
          }]}
          primary={true}
        />
      </div>
    }
  </Modal>

EvidencesModal.propTypes = {
  assertion: T.shape(
    AssertionTypes.propTypes
  )
}

export {
  EvidencesModal
}
