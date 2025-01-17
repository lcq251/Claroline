import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {displayDate, trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentLoader} from '#/main/app/content/components/loader'
import {UserMicro} from '#/main/core/user/components/micro'
import {ToolPage} from '#/main/core/tool'

import {transAction} from '#/main/transfer/utils'
import {PageHeading} from '#/main/app/page/components/heading'
import {Datetime} from '#/main/app/components/date'
import {ContentHtml} from '#/main/app/content/components/html'
import {PageContent, PageSection} from '#/main/app/page'
import {Badge} from '#/main/app/components/badge'

const TransferPage = props =>
  <ToolPage title={props.transferFile ? props.transferFile.name || transAction(props.transferFile.action) : null}>
    {isEmpty(props.transferFile) &&
      <ContentLoader
        size="lg"
        description={trans('loading', {}, 'transfer')}
      />
    }

    {!isEmpty(props.transferFile) &&
      <PageContent>
        <PageHeading
          size="md"
          title={props.transferFile.name || transAction(props.transferFile.action)}
          primaryAction="edit"
          actions={[
            {
              name: 'edit',
              type: LINK_BUTTON,
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit', {}, 'actions'),
              displayed: hasPermission('edit', props.transferFile),
              disabled: 'in_progress' === props.transferFile.status,
              target: props.path+'/edit',
              primary: true,
              group: trans('management')
            }
          ].concat(props.actions)}
        />

        <PageSection size="md">
          <div className="text-body-tertiary d-flex align-items-center gap-3 mb-4 text-wrap" role="presentation">
            <UserMicro
              {...get(props.transferFile, 'meta.creator', {})}
              noStatus={true}
              link={true}
            />

            <span>-</span>

            {get(props.transferFile, 'executionDate') ?
              <Datetime value={get(props.transferFile, 'executionDate')} long={true} time={true} /> :
              <span role="presentation">{trans('not_executed')}</span>
            }

            <div className="d-flex flex-row gap-1" role="presentation">
              <Badge variant={classes({
                'secondary': 'pending' === props.transferFile.status,
                'info': 'in_progress' === props.transferFile.status,
                'success': 'success' === props.transferFile.status,
                'danger': 'error' === props.transferFile.status
              })} subtle={true} className="fs-sm lh-base">{trans(props.transferFile.status)}</Badge>
              <Badge variant="secondary" subtle={true} className="fs-sm lh-base">
                {transAction(props.transferFile.action)}
              </Badge>
            </div>

            {false && get(props.transferFile, 'scheduler.scheduledDate') &&
              <li className="list-group-item">
                {trans('scheduled_date', {}, 'scheduler')}
                <span className="value">
                {displayDate(get(props.transferFile, 'scheduler.scheduledDate'), false, true)}
              </span>
              </li>
            }

          </div>

          {props.transferFile.description &&
            <ContentHtml className="lead mb-5">{props.transferFile.description}</ContentHtml>
          }
        </PageSection>

        {props.children}
      </PageContent>
    }
  </ToolPage>

TransferPage.propTypes = {
  path: T.string.isRequired,
  transferFile: T.shape({
    name: T.string,
    action: T.string,
    status: T.string.isRequired,
    scheduler: T.shape({
      scheduledDate: T.string.isRequired
    })
  }),
  actions: T.arrayOf(T.object),
  children: T.any
}

export {
  TransferPage
}
