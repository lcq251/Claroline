import React, {useState} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {makeId} from '#/main/app/utils/id'
import {FormContent} from '#/main/app/content/form/containers/content'
import {FormGroup} from '#/main/app/content/form/components/group'
import {StringInput} from '#/main/app/data/types/string/components/input'
import {ChoiceInput} from '#/main/app/data/types/choice/components/input'

/**
 * Editor for a single platform entry {icon, name, desc}.
 * Rendered inside a `collection` field: receives the item value and an
 * onChange callback that replaces the edited item in the collection.
 */
const PlatformItemInput = (props) => {
  const [uid] = useState(() => makeId())

  const update = (propName, propValue) => props.onChange(Object.assign({}, props.value || {}, {
    [propName]: propValue
  }))

  return (
    <div className="landing-packaging-platform">
      <div className="row">
        <div className="col-md-4">
          <FormGroup
            id={`${uid}-icon`}
            label={trans('landing-packaging_platform_icon_label', {}, 'widget')}
          >
            <ChoiceInput
              id={`${uid}-icon`}
              condensed={true}
              choices={{
                mini: trans('landing-packaging_icon_mini', {}, 'widget'),
                desktop: trans('landing-packaging_icon_desktop', {}, 'widget'),
                app: trans('landing-packaging_icon_app', {}, 'widget')
              }}
              value={props.value ? props.value.icon : 'mini'}
              onChange={(value) => update('icon', value)}
            />
          </FormGroup>
        </div>

        <div className="col-md-4">
          <FormGroup
            id={`${uid}-name`}
            label={trans('landing-packaging_platform_name_label', {}, 'widget')}
            required={true}
          >
            <StringInput
              id={`${uid}-name`}
              value={props.value ? props.value.name : ''}
              onChange={(value) => update('name', value)}
            />
          </FormGroup>
        </div>

        <div className="col-md-4">
          <FormGroup
            id={`${uid}-desc`}
            label={trans('landing-packaging_platform_desc_label', {}, 'widget')}
          >
            <StringInput
              id={`${uid}-desc`}
              value={props.value ? props.value.desc : ''}
              onChange={(value) => update('desc', value)}
            />
          </FormGroup>
        </div>
      </div>
    </div>
  )
}

PlatformItemInput.propTypes = {
  value: T.shape({
    icon: T.string,
    name: T.string,
    desc: T.string
  }),
  onChange: T.func.isRequired,
  disabled: T.bool
}

/**
 * Configuration form of the landing packaging widget:
 * section title + subtitle + editable platform list (add / delete / edit).
 */
const LandingPackagingParameters = (props) =>
  <FormContent
    level={5}
    flush={true}
    name={props.name}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.title',
            label: trans('landing-packaging_title_label', {}, 'widget'),
            type: 'string',
            required: true
          }, {
            name: 'parameters.subtitle',
            label: trans('landing-packaging_subtitle_label', {}, 'widget'),
            type: 'string'
          }, {
            name: 'parameters.platforms',
            label: trans('landing-packaging_platforms_label', {}, 'widget'),
            help: trans('landing-packaging_platforms_help', {}, 'widget'),
            type: 'collection',
            options: {
              placeholder: trans('landing-packaging_no_platform', {}, 'widget'),
              button: trans('landing-packaging_add_platform', {}, 'widget'),
              defaultItem: {icon: 'mini', name: '', desc: ''},
              component: PlatformItemInput
            }
          }
        ]
      }
    ]}
  />

LandingPackagingParameters.propTypes = {
  name: T.string.isRequired,
  instance: T.shape({
    parameters: T.object
  }),
  currentContext: T.shape({
    type: T.string,
    data: T.object
  }).isRequired
}

export {
  LandingPackagingParameters
}
