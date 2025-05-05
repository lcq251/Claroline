import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import {Toolbar} from '#/main/app/action'
import isNumber from 'lodash/isNumber'
import {toKey} from '#/main/app/utils/text'
import isEmpty from 'lodash/isEmpty'

const PageAffixCard = (props) =>
  <div className={classes('card shadow m-4 content-xs', props.className)}>
    <div className="p-4" role="presentation">
      {props.children}

      <Toolbar
        className="d-grid gap-1"
        buttonName="btn"
        primaryName="btn-primary"
        defaultName="btn-link"
        actions={props.actions}
      />

      {!isEmpty(props.info) &&
        <ul className="list-unstyled mb-0">
          {props.info
            .filter(info => undefined === info.displayed || info.displayed)
            .sort((a, b) => {
              if (isNumber(a.order) && !isNumber(b.order)) {
                return -1
              } else if (!isNumber(a.order) && isNumber(b.order)) {
                return 1
              } else if (isNumber(a.order) && isNumber(b.order)) {
                return a.order - b.order
              }

              return 0
            })
            .map(info =>
              <li key={toKey(info.label)} className="list-group-item d-flex align-items-baseline text-body-secondary fs-sm mt-4">
                {info.icon &&
                  <span className={classes('fa-fw me-3', info.icon)} aria-hidden={true} />
                }

                <div className="" role="presentation">
                  <b className="text-uppercase d-block fs-sm mb-1 text-nowrap">{info.label}</b>
                  {info.value}
                </div>
              </li>
            )
          }
        </ul>
      }
    </div>
  </div>

PageAffixCard.propTypes = {
  className: T.string,
  actions: T.arrayOf(T.shape({
    // Action types
  })),
  children: T.node,
  info: T.arrayOf(T.shape({
    icon: T.string,
    label: T.string.isRequired,
    value: T.any,
    displayed: T.bool,
    order: T.number
  }))
}

const PageAffix = props =>
  <div
    className={classes('mx-auto d-flex flex-row align-items-start justify-content-center', props.className)}
    role="presentation"
  >
    <div role="presentation">
      {props.children}
    </div>

    <div className="sticky-top" role="presentation">
      {props.affix}
    </div>
  </div>

PageAffix.propTypes = {
  className: T.string,
  affix: T.node,
  children: T.node
}

export {
  PageAffix,
  PageAffixCard
}
