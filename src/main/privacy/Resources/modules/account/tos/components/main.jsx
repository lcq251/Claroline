import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {User as UserTypes} from '#/main/community/prop-types'
import {Alert} from '#/main/app/components/alert'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {EditorPage} from '#/main/app/editor'
import {TermsOfService} from '#/main/privacy/components/terms-of-service'

const TosMain = (props) =>
  <EditorPage
    title={trans('terms_of_service', {}, 'privacy')}
    help={trans('Lorem ipsum dolor sit amet.')}
  >
    <Alert
      className="mb-4"
      type={get(props.currentUser, 'meta.acceptedTerms') ? 'success' : 'warning'}
    >
      {get(props.currentUser, 'meta.acceptedTerms') ?
        trans('terms_of_service_accepted', {}, 'privacy') :
        trans('terms_of_service_not_accepted', {}, 'privacy')
      }
    </Alert>

    <TermsOfService />

    {!get(props.currentUser, 'meta.acceptedTerms') &&
      <Button
        className="btn btn-primary mt-4 ms-auto"
        type={CALLBACK_BUTTON}
        label={trans('terms_of_service_accept', {}, 'privacy')}
        callback={() => props.acceptTerms()}
      />
    }
  </EditorPage>

TosMain.propTypes = {
  currentUser: T.shape(
    UserTypes.propTypes
  ).isRequired,
  privacy: T.shape({
    countryStorage: T.string,
    dpo: T.shape({
      name: T.string,
      email: T.string,
      address: T.shape({
        street1: T.string,
        street2: T.string,
        postalCode: T.string,
        city: T.string,
        state: T.string,
        country: T.string
      }),
      phone: T.string
    })
  }).isRequired,
  exportAccount: T.func.isRequired,
  acceptTerms: T.func.isRequired,
  messages: T.shape({
    pending: T.object,
    success: T.object,
    error: T.object
  })
}

export {
  TosMain
}
