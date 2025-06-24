import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ContentInfoBlocks} from '#/main/app/content/components/info-block'
import {PageContent, PageSection} from '#/main/app/page'
import {ToolDashboard} from '#/main/core/tool'

import {DashboardActivity} from '#/main/community/tools/community/dashboard/components/activity'

class CommunityDashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false
    }
  }

  componentDidMount() {
    this.props.fetch(this.props.contextId).then(() => this.setState({loaded: true}))
  }

  render() {
    return (
      <ToolDashboard
        pages={[
          {
            name: 'overview',
            icon: 'fa fa-temperature-half',
            title: trans('overview'),
            render: () => (
              <PageContent>
                <PageSection size="full" className="mt-4">
                  <ContentInfoBlocks
                    size="lg"
                    items={[
                      {
                        icon: 'fa fa-user',
                        label: trans('users', {}, 'community'),
                        value: !this.state.loaded ? '?' : this.props.count.users
                      }, {
                        icon: 'fa fa-users',
                        label: trans('groups', {}, 'community'),
                        value: !this.state.loaded ? '?' : this.props.count.groups
                      }
                    ]}
                  />
                </PageSection>
              </PageContent>
            )
          }, {
            name: 'stats',
            icon: 'fa fa-pie-chart',
            title: trans('statistics'),
            render: () => <></>
          }, {
            name: 'activity',
            icon: 'fa fa-line-chart',
            title: trans('activity'),
            component: DashboardActivity
          }
        ]}
      />
    )
  }
}

CommunityDashboard.propTypes = {
  contextId: T.string.isRequired,
  count: T.shape({
    users: T.number,
    groups: T.number
  }).isRequired,
  fetch: T.func.isRequired
}

export {
  CommunityDashboard
}
