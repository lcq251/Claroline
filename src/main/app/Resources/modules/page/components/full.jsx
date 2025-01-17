import React from 'react'
import omit from 'lodash/omit'

import {PageFull as PageFullTypes} from '#/main/app/page/prop-types'
import {PageSimple} from '#/main/app/page/components/simple'
import {PageMenu} from '#/main/app/page/components/menu'
import {Poster} from '#/main/app/components/poster'
import {PageBody} from '#/main/app/page/components/body'

const PageFull = (props) =>
  <PageSimple
    {...omit(props, 'showHeader', 'toolbar', 'menu')}
  >
    {props.showHeader &&
      <PageMenu
        name={props.name}
        embedded={props.embedded}
        {...props.menu}
        breadcrumb={props.breadcrumb}
        affix={props.affix}
      />
    }

    <PageBody>
      {props.showHeader && props.poster &&
        <Poster url={props.poster} className="app-page-poster" />
      }

      {props.children}
    </PageBody>
  </PageSimple>

PageFull.propTypes = PageFullTypes.propTypes
PageFull.defaultProps = PageFullTypes.defaultProps

export {
  PageFull
}
