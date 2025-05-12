import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {PageContent, PageSection, PageToolbar, PageToolbarSkeleton} from '#/main/app/page'

const PluginMeta = props =>
  <div className="card mb-3">
    <ul className="list-group list-group-flush list-group-values">
      <li className="list-group-item">
        {trans('version')}
        <span className="value">
          {props.plugin.meta.version}
        </span>
      </li>

      <li className="list-group-item">
        {trans('author')}
        <span className="value">
          {props.plugin.meta.vendor}
        </span>
      </li>
    </ul>
  </div>

PluginMeta.propTypes = {
  plugin: T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    meta: T.shape({
      version: T.string.isRequired,
      vendor: T.string.isRequired,
      bundle: T.string.isRequired
    }),
    ready: T.bool.isRequired,
    enabled: T.bool.isRequired,
    locked: T.bool.isRequired,
    requirements: T.object.isRequired
  })
}

const Plugin = (props) =>
  <ToolPage
    title={trans(get(props.plugin, 'name'), {}, 'plugin')}
  >
    {!props.plugin &&
      <PageContent className="placeholder-glow">
        <PageToolbarSkeleton toolbar="edit more" />
        <PageHeadingSkeleton
          description={true}
        />
      </PageContent>
    }

    {props.plugin &&
      <PageContent>
        <PageToolbar
          actions={[
            {
              name: 'toggle',
              type: CALLBACK_BUTTON,
              label: trans(props.plugin.enabled ? 'disable' : 'enable', {}, 'actions'),
              icon: props.plugin.enabled ? 'fa fa-fw fa-times' : 'fa fa-fw fa-check',
              disabled: true,
              primary: !props.plugin.enabled,
              callback: () => {
                if (props.plugin.enabled) {
                  props.enable(props.plugin)
                } else {
                  props.disable(props.plugin)
                }
              }
            }
          ]}
        />
        <PageHeading
          title={trans(props.plugin.name, {}, 'plugin')}
          description={trans(props.plugin.name+'_desc', {}, 'plugin')}
        />

        <PageSection>
          <PluginMeta plugin={props.plugin} />
        </PageSection>
      </PageContent>
    }
  </ToolPage>

Plugin.propTypes = {
  path: T.string.isRequired,
  plugin: T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    meta: T.shape({
      version: T.string.isRequired,
      vendor: T.string.isRequired,
      bundle: T.string.isRequired
    }),
    ready: T.bool.isRequired,
    enabled: T.bool.isRequired,
    locked: T.bool.isRequired,
    requirements: T.object.isRequired
  }),

  enable: T.func.isRequired,
  disable: T.func.isRequired
}

export {
  Plugin
}
