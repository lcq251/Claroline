import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {ToolPage} from '#/main/core/tool'

import {Tab as TabTypes} from '#/plugin/home/prop-types'
import {PageContent} from '#/main/app/page'

const HomePageSkeleton = () =>
  <ToolPage>
    <PageContent className="placeholder-glow container-fluid mt-4 gap-4">
      <div className="row px-2 mb-4">
        <div className="col-12 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
      </div>
      <div className="row px-2 mb-4">
        <div className="col-6 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
        <div className="col-6 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
      </div>
      <div className="row px-2 mb-4">
        <div className="col-4 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
        <div className="col-8 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
      </div>
      <div className="row px-2 mb-4">
        <div className="col-8 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
        <div className="col-4 d-flex">
          <span className="placeholder rounded-3 flex-fill" style={{minHeight: '14rem'}} />
        </div>
      </div>
    </PageContent>
  </ToolPage>

const HomePage = props =>
  <ToolPage
    className="home-tool"
    title={props.title}
  >
    <PageContent poster={props.poster || get(props.currentTab, 'poster')}>
      {props.children}
    </PageContent>
  </ToolPage>

HomePage.propTypes = {
  title: T.string.isRequired,
  poster: T.string,
  currentTab: T.shape(
    TabTypes.propTypes
  ),
  children: T.any
}

export {
  HomePage,
  HomePageSkeleton
}
