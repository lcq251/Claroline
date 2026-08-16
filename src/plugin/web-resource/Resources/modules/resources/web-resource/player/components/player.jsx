import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {asset} from '#/main/app/config/asset'

import {selectors} from '#/plugin/web-resource/resources/web-resource/store'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'
import {ResourceInputs} from '#/integration/mindme-ai/resource/inputs'
import {AiLessonInfo} from '#/plugin/web-resource/resources/web-resource/player/components/ai-lesson-info'

class PlayerComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      height: 0
    }

    this.checkHeight = this.checkHeight.bind(this)
  }

  checkHeight() {
    let contentHeight = this.iframe.contentWindow.document.body.scrollHeight

    if (contentHeight === 0) {
      contentHeight = document.getElementsByClassName('page-content')[0].clientHeight
    }

    if (contentHeight !== this.state.height) {
      this.setState({height: contentHeight})
    }
  }

  handleResize() {
    window.setInterval(this.checkHeight, 3000)
  }

  render() {
    const ctx = this.props.aiLessonContext
    const iframeSrc = ctx && ctx.allowed && ctx.aiLesson
      ? asset(this.props.resourcePath) + '?aiLessonId=' + ctx.aiLesson.id
      : asset(this.props.resourcePath)

    return (
      <ResourcePage>
        <AiLessonInfo context={ctx} />

        {(!ctx || ctx.allowed) ? (
          <iframe
            className="web-resource"
            ref={el => this.iframe = el}
            onLoad={this.handleResize()}
            height={this.state.height}
            src={iframeSrc}
            allowFullScreen={true}
          />
        ) : (
          <div className="alert alert-warning m-3">
            <span className="fa fa-exclamation-triangle" />{' '}
            {ctx.reason}
          </div>
        )}

        {this.props.resourceId &&
          <ResourceInputs hostId={this.props.resourceId} />
        }
      </ResourcePage>
    )
  }
}

PlayerComponent.propTypes = {
  resourcePath: T.string.isRequired,
  resourceId: T.string,
  aiLessonContext: T.object
}

const Player = connect(
  state => ({
    resourcePath: selectors.path(state),
    resourceId: get(resourceSelectors.resourceNode(state), 'id'),
    aiLessonContext: selectors.aiLessonContext(state)
  })
)(PlayerComponent)

export {
  Player
}