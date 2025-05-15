import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {DataDisplay} from '#/main/app/data/components/display'
import isEmpty from 'lodash/isEmpty'
import {toKey} from '#/main/app/utils/text'
import {Html} from '#/main/app/components/html'
import {Alert} from '#/main/app/components/alert'

/**
 * ATTENTION : as it's only be used in the DetailsData component, the `fields` are not defaulted by the component.
 * You should consider apply `createFieldsetDefinition` on your fields list before using it.
 */
const DetailsFieldset = (props) => {
  const fields = []

  props.fields.map(field => {
    let value
    if (undefined !== field.calculated) {
      value = typeof field.calculated === 'function' ? field.calculated(props.data) : field.calculated
    } else {
      value = get(props.data, field.name)
    }

    let customInput
    if (field.component) {
      customInput = field.component
    } else if (field.render) {
      customInput = field.render(props.data, props.errors)
    }

    fields.push(
      <DataDisplay
        key={field.name}
        name={field.name}
        type={field.type}
        label={field.label}
        hideLabel={field.hideLabel}
        options={field.options}
        help={field.help}
        placeholder={field.placeholder}
        size={props.size}
        required={field.required}

        value={value}
        error={get(props.errors, field.name)}
      >
        {customInput}
      </DataDisplay>
    )

    if (field.linked && 0 !== field.linked.length) {
      fields.push(
        <div className="sub-fields mb-3" key={`${field.name}-subset`} role="presentation">
          {this.renderFields(field.linked)}
        </div>
      )
    }
  })

  return (
    <>
      {!isEmpty(props.help) && (Array.isArray(props.help) ? props.help : [props.help]).map(help =>
        <Alert key={toKey(help)} type="info">
          <Html>{help}</Html>
        </Alert>
      )}

      {fields}

      {props.children}
    </>
  )
}

DetailsFieldset.propTypes = {
  size: T.oneOf(['sm', 'lg']),
  errors: T.object,
  data: T.object,
  help: T.oneOfType([T.string, T.arrayOf(T.string)]),
  fields: T.arrayOf(T.shape({
    // fields propTypes
  })).isRequired,
  children: T.node
}

DetailsFieldset.defaultProps = {
  data: {}
}

export {
  DetailsFieldset
}
