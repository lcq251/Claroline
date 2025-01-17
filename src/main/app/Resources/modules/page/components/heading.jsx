import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Await} from '#/main/app/components/await'
import {Action as ActionTypes, PromisedAction as PromisedActionTypes} from '#/main/app/action/prop-types'
import {PageActions} from '#/main/app/page/components/actions'
import {Poster} from '#/main/app/components/poster'

const PageHeading = props =>
  <>
    {props.poster &&
      <Poster url={props.poster} className="app-page-poster" />
    }

    <header className={classes('app-page-heading px-4 mb-5', props.className, props.size && `content-${props.size}`)}>
      {props.icon &&
        <div className="app-page-icon d-inline-block" role="presentation" aria-hidden={true}>
          {props.icon}
        </div>
      }

      <div className={classes('d-flex gap-3 align-items-end flex-wrap flex-md-nowrap', {
        'mt-5': !props.icon,
        'mt-2': !!props.icon
      })} role="presentation">
        <h1 className="app-page-title m-0">
          {props.subtitle &&
            <span className="text-primary d-block fs-base text-uppercase fw-semibold mb-2" role="presentation">{props.subtitle}</span>
          }

          {props.title}
        </h1>

        {props.actions instanceof Promise ?
          <Await for={props.actions} then={(resolvedActions) => (
            <PageActions
              actions={resolvedActions}
              toolbar={props.toolbar || 'more'}
              primaryAction={props.primaryAction}
              secondaryAction={props.secondaryAction}
              disabled={!!props.disabled}
            />
          )} /> :
          <PageActions
            actions={props.actions}
            toolbar={props.toolbar || 'more'}
            primaryAction={props.primaryAction}
            secondaryAction={props.secondaryAction}
            disabled={!!props.disabled}
          />
        }
      </div>

      {props.description &&
        <p className="lead text-body-secondary mt-3 mb-0">{props.description}</p>
      }
    </header>
  </>

PageHeading.propTypes = {
  className: T.string,
  size: T.oneOf(['sm', 'md', 'lg', 'full']),
  poster: T.string,
  /**
   * An optional icon for the page.
   * NB. we also use it to display a progression gauge.
   *
   * @type {string}
   */
  icon: T.element,
  title: T.oneOfType([T.string, T.element]).isRequired,
  subtitle: T.string,
  description: T.string,
  primaryAction: T.string,
  secondaryAction: T.string,
  toolbar: T.string,
  actions: T.oneOfType([
    // a regular array of actions
    T.arrayOf(T.shape(
      ActionTypes.propTypes
    )),
    // a promise that will resolve a list of actions
    T.shape(
      PromisedActionTypes.propTypes
    )
  ]),
  disabled: T.bool
}

export {
  PageHeading
}
