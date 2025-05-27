import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useDispatch} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {FormModal} from '#/main/app/data/modals/form/components/modal'
import {actions as formActions} from '#/main/app/content/form'

const STORE_NAME = 'ipForm'

const IpFormModal = props => {
  const dispatch = useDispatch()
  const isNew = !props.ip || !props.ip.id

  return (
    <FormModal
      {...omit(props, 'ip', 'userDisabled')}
      name={STORE_NAME}
      title={trans(isNew ? 'new_ip' : 'ip', {}, 'security')}
      data={props.ip}
      isNew={isNew}
      target={isNew ?
        ['apiv2_ip_user_create'] :
        ['apiv2_ip_user_update', {id: props.ip.id}]
      }
      saveLabel={trans('save', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          fields: [
            {
              name: 'range',
              type: 'boolean',
              label: trans('define_ip_range', {}, 'security'),
              onChange: (checked) => {
                if (checked) {
                  dispatch(formActions.updateProp(STORE_NAME, 'ip', []))
                } else {
                  dispatch(formActions.updateProp(STORE_NAME, 'ip', ''))
                }
              },
              linked: [
                {
                  name: 'ip[0]',
                  type: 'string',
                  label: trans('start'),
                  required: true,
                  displayed: (data) => data.range
                }, {
                  name: 'ip[1]',
                  type: 'string',
                  label: trans('end'),
                  required: true,
                  displayed: (data) => data.range
                }
              ]
            }, {
              name: 'ip',
              type: 'string',
              label: trans('ip_address'),
              required: true,
              displayed: (data) => !data.range
            }, {
              name: 'description',
              type: 'string',
              label: trans('description'),
              recommended: true,
              options: {long: true}
            }, {
              name: 'user',
              type: 'user',
              label: trans('user'),
              disabled: props.userDisabled,
              required: true
            }
          ]
        }
      ]}
    />
  )
}

IpFormModal.propTypes = {
  ip: T.shape({
    id: T.string,
    ip: T.oneOfType([T.string, T.arrayOf(T.string)]),
    user: T.object,
    range: T.bool
  }),
  userDisabled: T.bool,
  onSave: T.func
}

export {
  IpFormModal
}
