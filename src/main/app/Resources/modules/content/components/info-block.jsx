import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

const ContentInfoBlock = (props) =>
  <span className={classes('content-info-block', props.variant && `text-${props.variant}`)}>
    {props.icon &&
      <span className={classes('content-info-block-icon me-3', props.icon)} aria-hidden={true} />
    }

    <h3 className={classes('content-info-block-content', props.variant && `text-${props.variant}-emphasis`)}>
      <small className={classes('content-info-block-label mb-2', props.variant && `text-${props.variant}`)}>{props.label}</small>
      {props.value || 0 === props.value ? props.value : '-'}
    </h3>
  </span>

ContentInfoBlock.propTypes = {
  icon: T.string,
  label: T.string.isRequired,
  value: T.any,
  variant: T.oneOf(['primary', 'secondary', 'success', 'warning', 'danger'])
}

const ContentInfoBlocks = (props) =>
  <div className={classes('content-info-blocks d-flex gap-4 flex-wrap', props.className)} role="presentation">
    {props.items
      .filter(item => undefined === item.displayed || item.displayed)
      .map((item, index) => (
        <Fragment key={item.label}>
          {0 !== index &&
            <span className="vr" aria-hidden={true} />
          }
          <ContentInfoBlock
            {...item}
            variant={props.variant || item.variant}
            size={props.size}
          />
        </Fragment>
      ))
    }
  </div>

ContentInfoBlocks.propTypes = {
  className: T.string,
  variant: T.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
  items: T.arrayOf(T.shape({
    icon: T.string,
    label: T.string.isRequired,
    value: T.any,
    displayed: T.bool,
    variant: T.string
  }))
}

export {
  ContentInfoBlocks
}
