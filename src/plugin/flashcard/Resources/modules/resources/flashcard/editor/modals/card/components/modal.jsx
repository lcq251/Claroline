import React, {useCallback, useState} from 'react'
import {PropTypes as T}  from 'prop-types'
import {useDispatch, useSelector} from 'react-redux'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {makeId} from '#/main/app/utils/id'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {FormModal} from '#/main/app/data/modals/form/components/modal'
import {actions as formActions, selectors as  formSelectors} from '#/main/app/content/form'

import {Card} from '#/plugin/flashcard/resources/flashcard/components/card'
import {Card as CardTypes} from '#/plugin/flashcard/resources/flashcard/prop-types'
import {generateInputFields} from '#/plugin/flashcard/resources/flashcard/editor/modals/card/utils'

const STORE_NAME = 'flashcardForm'

const CardModal = props => {
  const dispatch = useDispatch()
  const [isFlipped, setIsFlipped] = useState(false)

  const formData = useSelector((state) => formSelectors.data(formSelectors.form(state, STORE_NAME)))

  return (
    <FormModal
      {...omit(props, 'card', 'update')}
      name={STORE_NAME}
      title={trans(props.isNew ? 'new_card' : 'card', {}, 'flashcard')}
      data={props.isNew ?
        Object.assign({}, CardTypes.defaultProps, {id: makeId()}) :
        props.card
      }
      saveLabel={trans(props.isNew ? 'add_card' : 'save_card', {}, 'actions')}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'preview',
              label: trans('preview'),
              type: 'string',
              hideLabel: true,
              render: () => (
                <div className="content-sm mx-auto text-center" role="presentation">
                  <Card
                    card={formData}
                    flipped={isFlipped}
                  />
                  <Button
                    className="btn btn-body mt-3"
                    type={CALLBACK_BUTTON}
                    callback={() => setIsFlipped(!isFlipped)}
                    label={trans('flip_card', {}, 'flashcard')}
                  />
                </div>
              )
            }, {
              name: 'question',
              label: trans('question', {}, 'flashcard'),
              type: 'string'
            }
          ]
        }, {
          title: trans('visible_content', {}, 'flashcard'),
          description: trans('visible_content_desc', {}, 'flashcard'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: 'visibleContentType',
              label: trans('visible_content', {}, 'flashcard'),
              help: trans('visible_content_desc', {}, 'flashcard'),
              type: 'choice',
              required: true,
              onChange: useCallback(() => dispatch(formActions.updateProp(STORE_NAME, 'visibleContent', null)), [STORE_NAME]),
              options: {
                condensed: false,
                inline: true,
                choices: {
                  text: trans('text'),
                  image: trans('image'),
                  video: trans('video'),
                  audio: trans('audio')
                }
              }
            }
          ].concat(generateInputFields('visible'))
        }, {
          title: trans('hidden_content', {}, 'flashcard'),
          description: trans('hidden_content_desc', {}, 'flashcard'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: 'hiddenContentType',
              label: trans('hidden_content', {}, 'flashcard'),
              help: trans('hidden_content_desc', {}, 'flashcard'),
              type: 'choice',
              required: true,
              onChange: useCallback(() => dispatch(formActions.updateProp(STORE_NAME, 'hiddenContent', null)), [STORE_NAME]),
              options: {
                condensed: false,
                inline: true,
                choices: {
                  text: trans('text'),
                  image: trans('image'),
                  video: trans('video'),
                  audio: trans('audio')
                }
              }
            }
          ].concat(generateInputFields('hidden'))
        }
      ]}
    />
  )
}

CardModal.propTypes = {
  card: T.shape(
    CardTypes.propTypes
  ),
  isNew: T.bool,
  onSave: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export {
  CardModal
}
