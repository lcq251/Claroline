import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ContentInfoBlocks} from '#/main/app/content/components/info-block'
import {PageSection} from '#/main/app/page'
import {ToolDashboard} from '#/main/core/tool'

import {Activity} from '#/main/log/activity/components/main'

import {selectors} from '#/main/community/tools/community/dashboard/store'

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
      <ToolDashboard>
        <PageSection size="md">
          <ContentInfoBlocks
            className="my-4"
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

        <PageSection size="md">
          <Activity
            name={selectors.STORE_NAME + '.logs'}
            url={['apiv2_community_functional_logs', {contextId: this.props.contextId}]}
          />
        </PageSection>
      </ToolDashboard>
    )
  }
}

CommunityDashboard.propTypes = {
  path: T.string.isRequired,
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
