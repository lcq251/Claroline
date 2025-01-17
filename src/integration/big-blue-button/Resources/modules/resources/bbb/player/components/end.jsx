import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {selectors} from '#/integration/big-blue-button/resources/bbb/store'
import {BBB as BBBType} from '#/integration/big-blue-button/resources/bbb/prop-types'
import {ResourcePage} from '#/main/core/resource'
import {Html} from '#/main/app/components/html'
import {PageContent} from '#/main/app/page'

const EndComponent = (props) =>
  <ResourcePage>
    <PageContent>
      <Html className="content-text">
        {props.bbb.endMessage}
      </Html>
    </PageContent>
  </ResourcePage>

EndComponent.propTypes = {
  bbb: T.shape(BBBType.propTypes).isRequired
}

const End = connect(
  (state) => ({
    bbb: selectors.bbb(state)
  })
)(EndComponent)

export {
  End
}
