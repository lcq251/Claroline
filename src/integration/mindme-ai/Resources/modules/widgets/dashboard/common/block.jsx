/*
 * Shared block head of the 5 dashboard widgets (C-22).
 *
 * Same shape for every block: title (h2) + optional en small label +
 * optional "more" link. Styled by dashboard.scss (`.block-head`).
 */

import React from 'react'
import {PropTypes as T} from 'prop-types'

const BlockHead = props => (
  <div className="block-head">
    <h2>{props.title}</h2>
    {props.en &&
      <span className="en">{props.en}</span>
    }
    {props.more &&
      <a className="more" href={props.more.url}>{props.more.label}</a>
    }
  </div>
)

BlockHead.propTypes = {
  title: T.string.isRequired,
  en: T.string,
  more: T.shape({
    label: T.string.isRequired,
    url: T.string.isRequired
  })
}

export {
  BlockHead
}
