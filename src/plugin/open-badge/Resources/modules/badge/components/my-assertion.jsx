import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {displayDate, trans} from '#/main/app/intl'
import {Toolbar} from '#/main/app/action'

import {Assertion as AssertionTypes} from '#/plugin/open-badge/prop-types'

import downloadAction from '#/plugin/open-badge/actions/badge_assertion/download'
import showEvidencesAction from '#/plugin/open-badge/actions/badge_assertion/show-evidences'

const BadgeMyAssertion = ({
  assertion
}) =>
  <div className={classes('d-flex align-items-center rounded-3 p-3 gap-3 fs-sm', {
    'bg-body-tertiary text-body-secondary': isEmpty(assertion),
    'bg-primary-subtle text-primary-emphasis border border-primary': !isEmpty(assertion)
  })}>
    <span className={classes('fa-stack fa-2x', {
      'text-body-tertiary': isEmpty(assertion),
      'text-primary': !isEmpty(assertion)
    })} aria-hidden={true}>
      <span className="fa fa-certificate fa-stack-2x" />
      <span className={classes('fa fa-stack-1x fa-inverse', {
        'fa-times': isEmpty(assertion),
        'fa-check': !isEmpty(assertion)
      })} />
    </span>

    {isEmpty(assertion) ?
      <p className="fs-5 mb-0">{trans('user_not_granted', {}, 'badge')}</p> :
      <div role="presentation">
        <p
          className="fs-5"
          dangerouslySetInnerHTML={{
            __html: trans('user_granted', {date: '<b>'+displayDate(get(assertion, 'issuedOn'), true, true)+'</b>'}, 'badge')
          }}
        />
        <Toolbar
          className="d-flex gap-1"
          buttonName="btn"
          primaryName="btn-primary"
          defaultName="btn-link"
          actions={[
            Object.assign(downloadAction([assertion]), {icon: undefined, primary: true}),
            Object.assign(showEvidencesAction([assertion]), {icon: undefined})
          ]}
        />
      </div>
    }
  </div>

BadgeMyAssertion.propTYpes = {
  assertion: T.shape(
    AssertionTypes.propTypes
  )
}

export {
  BadgeMyAssertion
}
