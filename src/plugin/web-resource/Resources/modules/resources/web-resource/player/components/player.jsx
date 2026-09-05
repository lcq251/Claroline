import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {asset} from '#/main/app/config/asset'

import {selectors} from '#/plugin/web-resource/resources/web-resource/store'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'
import {ResourceInputs} from '#/integration/mindme-aibase/resource/inputs'

class PlayerComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      height: 0
    }

    this.checkHeight = this.checkHeight.bind(this)
  }

  componentDidMount() {
    // poll iframe height after mount; cleared on unmount to prevent leaks
    this.heightInterval = window.setInterval(this.checkHeight, 3000)
  }

  componentWillUnmount() {
    if (this.heightInterval) {
      window.clearInterval(this.heightInterval)
      this.heightInterval = null
    }
    this.iframe = null
  }

  checkHeight() {
    // guard against unmounted component / cross-origin iframe / not-yet-attached ref
    if (!this.iframe) {
      return
    }

    let contentHeight = 0
    try {
      const win = this.iframe.contentWindow
      if (win && win.document && win.document.body) {
        contentHeight = win.document.body.scrollHeight
      }
    } catch (e) {
      // cross-origin iframe: SecurityError when reading document.body
      // fall back to host page content height
    }

    if (contentHeight === 0) {
      // dirty, but we need this element if everything is populated through javascript in the iframe...
      const pageContent = document.getElementsByClassName('page-content')[0]
      if (pageContent) {
        contentHeight = pageContent.clientHeight
      }
    }

    if (contentHeight !== this.state.height) {
      this.setState({height: contentHeight})
    }
  }

  render() {
    return (
      <ResourcePage>
        <iframe
          className="web-resource"
          ref={el => this.iframe = el}
          height={this.state.height}
          src={asset(this.props.resourcePath)}
          allowFullScreen={true}
        />

        {this.props.resourceId &&
          <ResourceInputs hostId={this.props.resourceId} />
        }
      </ResourcePage>
    )
  }
}

PlayerComponent.propTypes = {
  resourcePath: T.string.isRequired,
  resourceId: T.string
}

const Player = connect(
  state => ({
    resourcePath: selectors.path(state),
    resourceId: get(resourceSelectors.resourceNode(state), 'id')
  })
)(PlayerComponent)

export {
  Player
}
