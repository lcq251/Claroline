import React, {useId} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'

import {Heading} from '#/main/app/components/heading'
import {Toolbar} from '#/main/app/action'
import {Alert} from '#/main/app/components/alert'
import {toKey} from '#/main/app/utils/text'
import {Html} from '#/main/app/components/html'

const DetailsSection = (props) => {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <section
      className={classes('details-section', props.className)}
      aria-labelledby={titleId}
      aria-describedby={props.description ? descriptionId : undefined}
    >
      <header className={classes({
        'mb-3': !props.hideTitle,
        'visually-hidden': props.hideTitle
      })}>
        <Heading
          id={titleId}
          className="mb-0"
          level={props.level}
          displayLevel={props.displayLevel}
        >
          {props.title}
        </Heading>

        {props.description &&
          <p id={descriptionId} className="text-body-secondary mt-2 mb-0">{props.description}</p>
        }
      </header>

      {!isEmpty(props.actions) &&
        <Toolbar
          buttonName="btn"
          className="text-right form-group"
          size="sm"
          actions={props.actions}
        />
      }

      {!isEmpty(props.help) && (Array.isArray(props.help) ? props.help : [props.help]).map(help =>
        <Alert key={toKey(help)} type="info">
          <Html>{help}</Html>
        </Alert>
      )}

      {props.children}
    </section>
  )
}

DetailsSection.propTypes = {
  className: T.string,
  level: T.number, // level for section heading
  displayLevel: T.number, // modifier for headings level (used when some headings levels are hidden in the page)
  title: T.string,
  hideTitle: T.bool,
  description: T.string,
  help: T.oneOfType([T.string, T.arrayOf(T.string)]),
  actions: T.array,
  children: T.node.isRequired
}

export {
  DetailsSection
}
