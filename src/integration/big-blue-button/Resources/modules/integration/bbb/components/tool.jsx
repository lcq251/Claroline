import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {ContentLoader} from '#/main/app/content/components/loader'
import {PageContent, PageSection} from '#/main/app/page'
import {ToolPage} from '#/main/core/tool'

import {BBBMetrics} from '#/integration/big-blue-button/integration/bbb/components/metrics'
import {BBBResources} from '#/integration/big-blue-button/integration/bbb/components/resources'
import {BBBRooms} from '#/integration/big-blue-button/integration/bbb/components/rooms'
import {BBBRecordings} from '#/integration/big-blue-button/integration/bbb/components/recordings'
import {BBBServers} from '#/integration/big-blue-button/integration/bbb/components/servers'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Nav} from '#/main/app/components/nav'

class BBBTool extends Component {
  componentDidMount() {
    if (!this.props.loaded) {
      this.props.loadInfo()
    }
  }

  render() {
    if (!this.props.loaded) {
      return (
        <ToolPage
          title={trans('bbb', {}, 'integration')}
        >
          <ContentLoader
            size="lg"
            description="Nous chargeons votre outil..."
          />
        </ToolPage>
      )
    }

    return (
      <ToolPage
        title={trans('bbb', {}, 'integration')}
      >
        <PageContent>
          <PageSection size="xl" className="my-4">
            <BBBMetrics
              meetings={this.props.activeMeetingsCount}
              maxMeetings={this.props.maxMeetings}
              meetingParticipants={this.props.maxMeetingParticipants}
              participants={this.props.participantsCount}
              maxParticipants={this.props.maxParticipants}
              servers={this.props.servers.length}
              availableServers={this.props.servers.filter(server => !server.disabled && (!server.limit || server.limit > server.participants)).length}
            />
          </PageSection>

          <PageSection size="xl" className="mb-4">
            <Nav
              orientation="horizontal"
              variant="pills"
              items={[
                {
                  name: 'resources',
                  type: LINK_BUTTON,
                  label: trans('resources'),
                  target: this.props.path+'/bbb/',
                  exact: true
                }, {
                  name: 'rooms',
                  type: LINK_BUTTON,
                  label: trans('meetings', {}, 'bbb'),
                  target: this.props.path+'/bbb/rooms'
                }, {
                  name: 'recordings',
                  type: LINK_BUTTON,
                  label: trans('recordings', {}, 'bbb'),
                  target: this.props.path+'/bbb/recordings'
                }, {
                  name: 'servers',
                  type: LINK_BUTTON,
                  label: trans('servers', {}, 'bbb'),
                  target: this.props.path+'/bbb/servers'
                }
              ]}
            />
          </PageSection>
          
          <PageSection size="xl">
            <Routes
              path={this.props.path+'/bbb'}
              routes={[
                {
                  path: '/',
                  exact: true,
                  render: () => (
                    <BBBResources
                      servers={this.props.servers}
                      endMeetings={this.props.endMeetings}
                    />
                  )
                }, {
                  path: '/rooms',
                  render: () => (
                    <BBBRooms
                      meetings={this.props.activeMeetings}
                    />
                  )
                }, {
                  path: '/recordings',
                  render: () => (
                    <BBBRecordings syncRecordings={this.props.syncRecordings} />
                  )
                }, {
                  path: '/servers',
                  render: () => (
                    <BBBServers
                      servers={this.props.servers}
                    />
                  )
                }
              ]}
            />
          </PageSection>
        </PageContent>
      </ToolPage>
    )
  }
}

BBBTool.propTypes = {
  path: T.string.isRequired,
  loaded: T.bool,
  maxMeetings: T.number,
  maxMeetingParticipants: T.number,
  maxParticipants: T.number,
  activeMeetings: T.array,
  activeMeetingsCount: T.number,
  participantsCount: T.number,
  servers: T.arrayOf(T.shape({
    url: T.string.isRequired,
    participants: T.number,
    limit: T.number,
    disabled: T.bool
  })),
  allowRecords: T.bool.isRequired,
  loadInfo: T.func.isRequired,
  endMeetings: T.func.isRequired,
  syncRecordings: T.func.isRequired
}

export {
  BBBTool
}