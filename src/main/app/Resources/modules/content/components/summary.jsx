import React from 'react'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {toKey} from '#/main/app/utils/text'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Button} from '#/main/app/action/components/button'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

const SummaryLink = (props) =>
  <li className="summary-link-container">
    <div className={classes('summary-link', {
      active: props.active
    })} role="presentation">
      <Button
        className="btn btn-text-body btn-summary-primary align-items-baseline focus-ring"
        {...omit(props, 'children', 'actions', 'toolbar')}
        label={props.numbering ?
          <>
            {props.numbering &&
              <span className="text-body-tertiary fw-bold me-2" role="presentation">{props.numbering}</span>
            }
            {props.label}
          </> :
          props.label
        }
      />

      {!isEmpty(props.actions) &&
        <Toolbar
          name="summary-link-actions"
          buttonName="btn btn-text-secondary btn-summary focus-ring"
          tooltip="bottom"
          toolbar={props.toolbar || 'more'}
          actions={props.actions}
        />
      }
    </div>

    {!isEmpty(props.children) &&
      <ul className="step-children">
        {props.children
          .filter(child => undefined === child.displayed || child.displayed)
          .map((child, index) =>
            <SummaryLink
              {...child}
              key={toKey(child.id || child.label) + index}
              toolbar={props.toolbar}
            />
          )
        }
      </ul>
    }
  </li>

implementPropTypes(SummaryLink, ActionTypes, {
  numbering: T.string,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  children: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  toolbar: T.string,
})

const ContentSummary = props => {
  if (0 !== props.links.length ) {
    return (
      <ul className={classes('content-summary', props.className)}>
        {props.links
          .filter(link => undefined === link.displayed || link.displayed)
          .map((link, index) =>
            <SummaryLink
              {...link}
              toolbar={props.toolbar}
              key={toKey(link.id || link.label) + index}
            />
          )
        }
      </ul>
    )
  }

  return null
}

ContentSummary.propTypes = {
  className: T.string,
  links: T.arrayOf(T.shape(merge({}, ActionTypes.propTypes, {
    numbering: T.string,
    actions: T.arrayOf(T.shape(
      ActionTypes.propTypes
    )),
    children: T.arrayOf(T.shape(
      ActionTypes.propTypes
    ))
  }))),
  toolbar: T.string
}

export {
  ContentSummary
}
