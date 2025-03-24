import React from 'react'
import classes from 'classnames'
import omit from 'lodash/omit'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Button as ButtonTypes} from '#/main/app/buttons/prop-types'

import {Button} from '#/main/app/action/components/button'
import {URL_BUTTON} from '#/main/app/buttons'

const SsoButton = props =>
  <Button
    className={classes('btn', props.service, props.className, props.primary ? 'btn-primary' : 'btn-body')}
    type={URL_BUTTON}
    target={['hwi_oauth_service_redirect', {service: props.service}]}
    size={props.primary ? 'lg' : undefined}

    {...omit(props, 'service')}
  />

implementPropTypes(SsoButton, ButtonTypes, {
  service: T.string.isRequired,
  label: T.node, // lighten validation. We have a default if no label
  primary: T.bool
})

export {
  SsoButton
}
