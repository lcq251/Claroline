import React, {useContext} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Await} from '#/main/app/components/await'
import {Action as ActionTypes, PromisedAction as PromisedActionTypes} from '#/main/app/action/prop-types'
import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {TextSkeleton} from '#/main/app/components/placeholder'
import {ThumbnailSkeleton} from '#/main/app/components/thumbnail'

import {PageActions} from '#/main/app/page/components/actions'
import {PagePoster} from '#/main/app/page/components/poster'
import {Heading} from '#/main/app/components/heading'
import {PageContext} from '#/main/app/page/context'

const PageHeadingSkeleton = ({
  className,
  size = 'lg',
  level = 1,
  icon = false,
  eyebrow = false,
  backAction = false,
  description = false
}) => {
  const pageDef = useContext(PageContext)

  return (
    <header className={classes('app-page-heading px-4 mb-5', !pageDef.embedded && 'mt-5', className, size && `content-${size}`)}>
      {icon &&
        <div className="app-page-icon d-inline-block mb-2" role="presentation" aria-hidden={true}>
          <ThumbnailSkeleton size="lg" square={true} />
        </div>
      }

      {backAction &&
        <div className="mb-2" role="presentation">
          <span
            className="placeholder bg-primary rounded-1 my-2"
            role="presentation"
          >
            <span className="fa fa-arrow-left icon-with-text-right" />
            {backAction}
          </span>
        </div>
      }

      <Heading
        className="app-page-title m-0"
        level={level}
      >
        {eyebrow &&
          <span className="text-primary d-block fs-base text-uppercase fw-semibold mb-2 w-25 placeholder rounded-1" role="presentation">&nbsp;</span>
        }

        <span className="placeholder rounded-1 w-75" role="presentation">&nbsp;</span>
      </Heading>

      {description &&
        <TextSkeleton className="lead text-body-secondary mt-3 mb-0" rows={3} />
      }
    </header>
  )
}

PageHeadingSkeleton.propTypes = {
  className: T.string,
  level: T.number,
  size: T.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  icon: T.bool,
  eyebrow: T.bool,
  description: T.bool,
  backAction: T.string
}

const PageHeading = props => {
  const pageDef = useContext(PageContext)

  let level = props.level || 1
  if (pageDef.embedded) {
    level = level + 1
  }

  return (
    <header id={props.id} className={classes('app-page-heading px-4 mb-5', !pageDef.embedded && 'pt-5', props.className, `content-${props.size || 'lg'}`)}>
      {props.poster &&
        <PagePoster poster={props.poster} className="rounded-4 mb-4" />
      }

      {props.icon &&
        <div className="app-page-icon d-inline-block mb-2" role="presentation" aria-hidden={true}>
          {props.icon}
        </div>
      }

      {props.backAction &&
        <Button
          className="btn btn-link ms-n3 mt-n2 mb-2 focus-ring"
          icon="fa fa-arrow-left"
          label={trans('back')}
          {...props.backAction}
        />
      }

      <div className="d-flex gap-3 align-items-end flex-wrap flex-md-nowrap" role="presentation">
        <Heading
          className="app-page-title m-0"
          level={level}
        >
          {(props.subtitle || props.eyebrow) &&
            <span className="text-primary d-block fs-base text-uppercase fw-semibold mb-2" role="presentation">{props.subtitle || props.eyebrow}</span>
          }

          {props.title}
        </Heading>

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
  )
}

PageHeading.propTypes = {
  id: T.string,
  className: T.string,
  size: T.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  poster: T.string,
  level: T.number,
  /**
   * An optional icon for the page.
   * NB. we also use it to display a progression gauge.
   *
   * @type {string}
   */
  icon: T.element,
  title: T.oneOfType([T.string, T.element]).isRequired,
  /**
   * @deprecated use eyebrow.
   */
  subtitle: T.string,
  eyebrow: T.string,
  description: T.string,
  primaryAction: T.string,
  secondaryAction: T.string,
  toolbar: T.string,
  backAction: T.object,
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
  PageHeading,
  PageHeadingSkeleton
}
