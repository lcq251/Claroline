import React from 'react'
import {PropTypes as T}  from 'prop-types'
import classes from 'classnames'

import {asset} from '#/main/app/config/asset'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {Video} from '#/main/app/components/video'

import {Card as CardTypes} from '#/plugin/flashcard/resources/flashcard/prop-types'
import {Html} from '#/main/app/components/html'

const Card = props => {
  const contentKey = props.flipped ? 'hiddenContent' : 'visibleContent'

  return (
    <div className={classes('flashcard ratio border rounded-3 shadow-sm bg-body', props.flipped && 'flashcard-flip')} style={{'--bs-aspect-ratio': 'calc(3/5 * 100%)'}}>
      <div className={classes('flashcard-card p-3', props.className)}>
        {props.card.question && (
          <h5 className="flashcard-question text-center">
            {props.card.question}
          </h5>
        )}

        <div className="flashcard-content">
          {props.card[contentKey+'Type'] === 'text' &&
            <Html className="content-text m-auto">{props.card[contentKey] || ''}</Html>
          }

          {props.card[contentKey] !== null && props.card[contentKey+'Type'] === 'image' &&
            <img src={asset(props.card[contentKey].url)} alt={props.card.question} className="flashcard-media m-auto" />
          }

          {props.card[contentKey] !== null && props.card[contentKey+'Type'] === 'video' && (
            <Video
              className="flashcard-video m-auto"
              options={{
                controls: true,
                fluid: true
              }}
              sources={[{
                src: asset(props.card[contentKey].url)
              }]}
            />
          )}
          { props.card[contentKey] !== null && props.card[contentKey+'Type'] === 'audio' && (
            <audio controls={true}>
              <source src={asset(props.card[contentKey].url)} type={props.card.type}/>
            </audio>
          )}
        </div>

        {props.actions &&
          <Toolbar
            id={`${props.card.id}-btn`}
            buttonName="btn btn-text-body action-button p-2"
            tooltip="bottom"
            className="flashcard-actions"
            actions={props.actions(props.card)}
          />
        }
      </div>
    </div>
  )
}

Card.propTypes = {
  className: T.string,
  flipped: T.bool,
  actions: T.func,
  card: T.shape(
    CardTypes.propTypes
  )
}

export {
  Card
}
