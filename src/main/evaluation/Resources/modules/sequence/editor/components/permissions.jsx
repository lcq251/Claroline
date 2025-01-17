import React, {useCallback} from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {actions, selectors} from '#/main/evaluation/sequence/editor/store'

const restrictedByDates = (formData) => get(formData, 'restrictions.enableDates') || !isEmpty(get(formData, 'restrictions.dates'))

const SequenceEditorPermissions = () => {
  const dispatch = useDispatch()
  const updateProp = useCallback((prop, value) => {
    dispatch(actions.update(value, prop))
  }, [selectors.STORE_NAME])

  return (
    <EditorPage
      title={trans('permissions')}
      help={trans('Gérez les différents droits d\'accès et de modifications de vos utilisateurs.')}
      managerOnly={true}
      definition={[
        {
          name: 'roles',
          icon: 'fa fa-fw fa-id-badges',
          title: trans('roles'),
          subtitle: trans('Assignez des permissions aux rôles pour personnaliser les droits des utilisateurs possédant ce rôle.'),
          primary: true,
          fields: [
            {
              name: 'roles',
              type: 'role',
              label: trans('roles'),
              hideLabel: true,
              options: {multiple: true}
            }
          ]
        }, {
          name: 'restrictions',
          icon: 'fa fa-fw fa-key',
          title: trans('access_restrictions'),
          subtitle: trans('Ajoutez des conditions d\'accès supplémentaires à vos contenus. Les utilisateurs ayant la permission "Administrer" ne sont pas affectés.'),
          primary: true,
          fields: [
            {
              name: 'restrictions.enableDates',
              label: trans('restrict_by_dates'),
              help: trans('restrict_by_dates_help'),
              type: 'boolean',
              calculated: restrictedByDates,
              onChange: activated => {
                if (!activated) {
                  updateProp('restrictions.dates', [])
                }
              },
              linked: [
                {
                  name: 'restrictions.dates',
                  type: 'date-range',
                  label: trans('access_dates'),
                  displayed: restrictedByDates,
                  required: true,
                  options: {
                    time: true
                  }
                }
              ]
            }
          ]
        }
      ]}
    />
  )
}

export {
  SequenceEditorPermissions
}
