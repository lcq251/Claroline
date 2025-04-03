import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isNumber from 'lodash/isNumber'
import get from 'lodash/get'

import {DataDisplay} from '#/main/app/data/components/display'

const DescriptionList = ({
  className,
  fields,
  size,
  inline = true,
  loaded = true,
  data = null
}) => {
  const displayedFields = fields
    .filter(field => {
      if (undefined === field.displayed) {
        return true
      }

      return typeof field.displayed === 'function' ? field.displayed(data) : field.displayed
    })
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

  return (
    <dl className={classes('border-top', {
      'placeholder-glow': !loaded
    }, className)}>
      {displayedFields.map(field => {
        let value
        if (undefined !== field.calculated) {
          value = typeof field.calculated === 'function' ? field.calculated(data) : field.calculated
        } else {
          value = get(data, field.name)
        }

        let customInput
        if (field.component) {
          customInput = field.component
        } else if (field.render) {
          customInput = field.render(data)
        }

        return (
          <div key={field.name} className={classes('border-bottom py-3', {
            'd-flex flex-row align-items-start gap-3': inline
          })} role="presentation">
            <dt className={classes('form-label', {
              'w-25 mb-0': inline
            })}>
              <span className={classes({'placeholder rounded-1': !loaded})} role="presentation">
                {field.icon &&
                  <span className={classes('fa-fw me-3', field.icon)} aria-hidden={true} />
                }
                {field.label}
              </span>
            </dt>
            <dd className={classes('mb-0', {
              'w-75': inline,
              'placeholder rounded-1': !loaded
            })}>
                <DataDisplay
                  key={field.name}
                  type={field.type}
                  options={field.options}
                  placeholder={field.placeholder}
                  size={size}
                  value={value}
                >
                  {customInput}
                </DataDisplay>
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

DescriptionList.propTypes = {
  className: T.string,
  inline: T.bool,
  size: T.oneOf(['sm']),
  loaded: T.bool,
  data: T.object,
  fields: T.arrayOf(T.shape({
    order: T.number,
    displayed: T.oneOfType([T.bool, T.func]),
    help: T.oneOfType([
      T.string,
      T.arrayOf(T.string)
    ])
  })).isRequired
}

export {
  DescriptionList
}
