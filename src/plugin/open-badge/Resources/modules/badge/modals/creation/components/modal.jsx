import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl'
import {CreationModal} from '#/main/app/data/modals/creation/components/modal'

import {BadgesModal} from '#/plugin/open-badge/modals/badges/containers/modal'
import {BadgeCreationStart} from '#/plugin/open-badge/badge/modals/creation/components/start'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const BadgeCreationModal = (props) => {
  return (
    <CreationModal
      {...omit(props, 'contextType', 'contextId')}
      title={trans('new_badge', {}, 'badge')}
      steps={[
        {
          name: 'start',
          title: trans('Attribuez un badge à vos utilisateurs pour les récompenser pour leur activité.'),
          component: BadgeCreationStart
        }, {
          name: 'organization',
          title: trans('Sélectionnez le(s) badge(s) à rendre accessible dans l\'organisation.'),
          previous: 'start',
          render: (stepProps) => {
            return (
              <BadgesModal
                {...stepProps}
                multiple={true}
                selectAction={(selected) => ({
                  type: CALLBACK_BUTTON,
                  label: trans('Ajouter à l\'organization'),
                  callback: () => true
                })}
              />
            )
          }
        }
      ]}
    />
  )
}

BadgeCreationModal.propTypes = {
  contextType: T.string.isRequired,
  contextId: T.string
}

export {
  BadgeCreationModal
}
