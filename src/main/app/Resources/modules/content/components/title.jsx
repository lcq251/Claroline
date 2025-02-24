import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {toKey} from '#/main/app/utils/text'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {Heading} from '#/main/app/components/heading'

const ContentTitle = (props) =>
  <Heading
    {...omit(props, 'numbering', 'title', 'subtitle', 'backAction', 'actions')}
    className={classes('h-title', props.className)}
  >
    {props.numbering &&
      <span className="h-numbering">{props.numbering}</span>
    }

    {props.children}

    <span role="presentation" className={classes(
      props.align && `text-${props.align}`
    )}>
      {props.title}

      {props.subtitle &&
        <small className="text-body-secondary">{props.subtitle}</small>
      }
    </span>

    {!isEmpty(props.actions) &&
      <Toolbar
        id={props.id || toKey(props.title)}
        className="btn-toolbar ms-auto align-self-start"
        buttonName="btn btn-body"
        tooltip="bottom"
        toolbar="more"
        actions={props.actions}
      />
    }
  </Heading>

ContentTitle.propTypes = {
  id: T.string,
  className: T.string,
  level: T.number.isRequired,
  displayLevel: T.number,
  numbering: T.node,
  title: T.node.isRequired,
  subtitle: T.string,
  displayed: T.bool,
  align: T.oneOf(['start', 'center', 'end']),
  actions: T.arrayOf(T.shape({
    // action types
  })),
  children: T.node
}

ContentTitle.defaultProps = {
  level: 2,
  align: 'start',
  displayed: true
}

export {
  ContentTitle
}
