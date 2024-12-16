import React from 'react'
import omit from 'lodash/omit'

import {PageFull as PageFullTypes} from '#/main/app/page/prop-types'
import {PageSimple} from '#/main/app/page/components/simple'
import {PageMenu} from '#/main/app/page/components/menu'
import {Poster} from '#/main/app/components/poster'

const PageFull = (props) =>
  <PageSimple
    {...omit(props, 'showHeader', 'title', 'description', 'poster', 'toolbar', 'menu')}
    title={props.title}
    description={props.description}
    poster={props.poster}
  >
    {props.showHeader &&
      <PageMenu
        embedded={props.embedded}
        {...props.menu}
        breadcrumb={props.breadcrumb}
        affix={props.affix}
      />
    }

    {props.showHeader && props.poster &&
      <Poster url={props.poster} className="app-page-poster" />
    }

    {props.children}
  </PageSimple>

PageFull.propTypes = PageFullTypes.propTypes
PageFull.defaultProps = PageFullTypes.defaultProps

export {
  PageFull
}
