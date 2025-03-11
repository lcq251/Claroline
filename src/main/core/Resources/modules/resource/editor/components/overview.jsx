import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {EditorPage} from '#/main/app/editor'

import {ResourceIcon} from '#/main/core/resource/components/icon'

const ResourceEditorOverview = (props) =>
  <EditorPage
    title={trans('overview')}
    definition={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'resourceNode.poster',
            label: trans('poster'),
            type: 'poster',
            hideLabel: true
          }, {
            name: 'resourceNode.meta.type',
            label: trans('type'),
            type: 'type',
            hideLabel: true,
            calculated: (data) => !isEmpty(get(data, 'resourceNode.meta.mimeType')) ? ({
              icon: <ResourceIcon mimeType={data.resourceNode.meta.mimeType} />,
              name: trans(data.resourceNode.meta.type, {}, 'resource'),
              description: trans(`${data.resourceNode.meta.type}_desc`, {}, 'resource')
            }) : null
          }, {
            name: 'resourceNode.name',
            label: trans('name'),
            type: 'string',
            required: true
          }, {
            name: 'resourceNode.code',
            label: trans('code'),
            type: 'string',
            required: true
          }, {
            name: 'resourceNode.meta.published',
            label: trans('publish_resource', {}, 'resource'),
            type: 'boolean',
            help: trans('publish_resource_help', {}, 'resource')
          }
        ]
      }, {
        title: trans('further_information'),
        description: trans('further_information_help'),
        primary: true,
        fields: [
          {
            name: 'resourceNode.meta.description',
            label: trans('description_short'),
            help: trans('description_short_help', {}, 'resource'),
            type: 'string',
            recommended: true,
            options: {
              long: true,
              minRows: 2
            }
          }, {
            name: 'resourceNode.meta.descriptionHtml',
            label: trans('description_long'),
            type: 'html',
            help: trans('description_long_help', {}, 'resource'),
          }, {
            name: 'resourceNode.tags',
            label: trans('tags'),
            type: 'tag'
          }
        ]
      }
    ].concat(props.definition || [])}
    locked={props.locked}
  >
    {props.children}
  </EditorPage>

ResourceEditorOverview.propTypes = {
  definition: T.arrayOf(T.shape({

  })),
  locked: T.arrayOf(T.string),
  children: T.any
}

export {
  ResourceEditorOverview
}
