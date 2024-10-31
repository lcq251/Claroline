import React, {Fragment} from 'react'

import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'
import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

import {OrganizationCard} from '#/main/community/organization/components/card'
import {Organization as OrganizationTypes} from '#/main/community/prop-types'
import {MODAL_ORGANIZATIONS} from '#/main/community/modals/organizations'

const OrganizationButton = props =>
  <Button
    className="btn btn-outline-primary w-100 mt-2"
    type={MODAL_BUTTON}
    icon="fa fa-fw fa-plus"
    label={trans('add_organization', {}, 'actions')}
    disabled={props.disabled}
    modal={[MODAL_ORGANIZATIONS, {
      url: ['apiv2_organization_list'],
      title: props.title,
      selectAction: (selected) => ({
        type: CALLBACK_BUTTON,
        callback: () => props.onChange(selected[0])
      })
    }]}
    size={props.size}
  />

OrganizationButton.propTypes = {
  title: T.string,
  onChange: T.func.isRequired,
  size: T.string,
  disabled: T.bool
}

const OrganizationInput = props => {
  if (props.value) {
    return (
      <Fragment>
        <OrganizationCard
          data={props.value}
          size="xs"
          actions={[
            {
              name: 'delete',
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-trash',
              label: trans('delete', {}, 'actions'),
              dangerous: true,
              disabled: props.disabled,
              callback: () => props.onChange(null)
            }
          ]}
        />

        <OrganizationButton
          {...props.picker}
          disabled={props.disabled}
          size={props.size}
          onChange={props.onChange}
        />
      </Fragment>
    )
  }

  return (
    <ContentPlaceholder
      icon="fa fa-building"
      title={trans('no_organization')}
      size={props.size}
    >
      <OrganizationButton
        {...props.picker}
        disabled={props.disabled}
        size={props.size}
        onChange={props.onChange}
      />
    </ContentPlaceholder>
  )
}

implementPropTypes(OrganizationInput, DataInputTypes, {
  value: T.shape(OrganizationTypes.propTypes),
  picker: T.shape({
    title: T.string
  })
}, {
  value: null
})

export {
  OrganizationInput
}
