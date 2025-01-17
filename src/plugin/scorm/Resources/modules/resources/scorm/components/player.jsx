import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {asset} from '#/main/app/config/asset'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'
import {ContentIFrame} from '#/main/app/content/components/iframe'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

import {Scorm as ScormTypes, Sco as ScoTypes} from '#/plugin/scorm/resources/scorm/prop-types'
import {getFirstOpenableSco} from '#/plugin/scorm/resources/scorm/utils'
import {PageContent} from '#/main/app/page'

const Player = (props) => {
  if (isEmpty(props.scos)) {
    return (
      <ResourcePage>
        <ContentPlaceholder
          size="lg"
          icon="fa fa-face-frown"
          title={trans('no_section')}
        />
      </ResourcePage>
    )
  }

  const firstSco = getFirstOpenableSco(props.scos)
  const embedded = useSelector(resourceSelectors.embedded)
  const showHeader = useSelector(resourceSelectors.showHeader)

  if (1 === props.scos.length) {
    props.initializeScormAPI(firstSco, props.scorm, props.trackings, props.currentUser)

    return (
      <ResourcePage>
        <PageContent>
          <ContentIFrame
            className={classes({
              'mt-4': embedded && showHeader,
              'rounded-4': embedded
            })}
            ratio={embedded ? get(props.scorm, 'ratio') : undefined}
            url={`${asset('data/uploads/scorm/')}${props.workspaceUuid}/${props.scorm.hashName}/${firstSco.data.entryUrl}${firstSco.data.parameters ? firstSco.data.parameters : ''}`}
            sco={firstSco}
          />
        </PageContent>
      </ResourcePage>
    )
  }

  return (
    <ResourcePage>
      <PageContent>
        <Routes
          path={props.path}
          redirect={firstSco ? [
            {from: '/', to: `/${firstSco.id}`}
          ] : undefined}
          routes={[
            {
              path: '/:id',
              onEnter(params = {}) {
                const currentSco = props.scos.find(sco => sco.id === params.id)
                if (currentSco) {
                  props.initializeScormAPI(currentSco, props.scorm, props.trackings, props.currentUser)
                }
              },
              render(routeProps) {
                const currentSco = props.scos.find(sco => sco.id === routeProps.match.params.id)
                if (currentSco && !isEmpty(currentSco.data.entryUrl)) {
                  return (
                    <ContentIFrame
                      className={classes({
                        'mt-4': embedded && showHeader,
                        'rounded-4': embedded
                      })}
                      ratio={embedded ? get(props.scorm, 'ratio') : undefined}
                      url={`${asset('data/uploads/scorm/')}${props.workspaceUuid}/${props.scorm.hashName}/${currentSco.data.entryUrl}${currentSco.data.parameters ? currentSco.data.parameters : ''}`}
                      sco={currentSco}
                    />
                  )
                }

                routeProps.history.push(props.path)

                return null
              }
            }
          ]}
        />
      </PageContent>
    </ResourcePage>
  )
}

Player.propTypes = {
  path: T.string.isRequired,
  currentUser: T.object,
  scorm: T.shape(
    ScormTypes.propTypes
  ),
  trackings: T.object,
  scos: T.arrayOf(T.shape(
    ScoTypes.propTypes
  )).isRequired,
  workspaceUuid: T.string.isRequired,
  initializeScormAPI: T.func.isRequired
}

export {
  Player
}
