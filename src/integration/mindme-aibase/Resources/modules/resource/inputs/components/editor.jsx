import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {apiFetch, makeCancelable} from '#/main/app/api/fetch'
import {MODAL_RESOURCES} from '#/main/core/modals/resources'
import {ResourceIcon} from '#/main/core/resource/components/icon'

import {API, MY_API} from '#/integration/mindme-aibase/resource/inputs/constants'

/**
 * Configures the list of resources used as inputs of a host resource.
 * The order of the list is the order stored in the backend (order field).
 *
 * When `mine` is true, the editor operates on the CURRENT user's personal
 * "my links" list (GET/PUT /inputs/mine) instead of the shared list.
 *
 * @param {string} hostId       - the uuid of the host ResourceNode
 * @param {boolean} [mine=false] - edit the current user's personal list
 */
const ResourceInputsEditor = ({hostId, mine = false}) => {
  const dispatch = useDispatch()
  const [inputs, setInputs] = useState([])

  const endpoint = mine ? MY_API(hostId) : API(hostId)

  // loads the current input references
  useEffect(() => {
    if (!hostId) {
      return
    }

    let isCancelled = false
    const cancelable = makeCancelable(apiFetch({url: endpoint}, dispatch))

    cancelable.promise
      .then((data) => {
        if (!isCancelled) {
          setInputs(data || [])
        }
      })
      .catch((err) => {
        if (!isCancelled && !err?.isCanceled) {
          setInputs([])
        }
      })

    return () => {
      isCancelled = true
      cancelable.cancel()
    }
  }, [hostId])

  // appends the resources picked in the multi-select modal (deduplicated)
  const addInputs = (selected) => setInputs(prev => {
    const existingIds = new Set(prev.map(input => get(input, 'target.id')))

    const added = selected
      .filter(node => !existingIds.has(node.id))
      .map((target, index) => ({
        id: target.id,
        order: prev.length + index,
        target
      }))

    return [...prev, ...added]
  })

  // moves the input at `index` by `delta` (-1 = up, 1 = down)
  const move = (index, delta) => {
    const next = [...inputs]
    const targetIndex = index + delta

    if (targetIndex < 0 || targetIndex >= next.length) {
      return
    }

    ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
    setInputs(next.map((input, order) => ({...input, order})))
  }

  // removes the input at `index`
  const remove = (index) => setInputs(inputs
    .filter((input, i) => i !== index)
    .map((input, order) => ({...input, order}))
  )

  // persists the whole list (the backend replaces everything, order is kept)
  const save = () => {
    if (!hostId) {
      return
    }

    apiFetch({
      url: endpoint,
      request: {
        method: 'PUT',
        body: JSON.stringify(inputs.map(input => get(input, 'target.id')))
      }
    }, dispatch)
      .then((data) => setInputs(data || []))
      .catch(() => {})
  }

  return (
    <div className="resource-inputs-editor">
      <p className="text-muted">{trans('inputs_help', {}, 'resource')}</p>

      {0 === inputs.length &&
        <div className="text-muted mb-3">
          {trans('no_inputs', {}, 'resource')}
        </div>
      }

      {0 < inputs.length &&
        <ul className="list-group mb-3">
          {inputs.map((input, index) => {
            const target = input.target

            return (
              <li key={input.id} className="list-group-item d-flex align-items-center gap-2">
                <ResourceIcon
                  mimeType={get(target, 'meta.mimeType')}
                />

                <span className="flex-grow-1 text-truncate">
                  {target ? target.name : trans('resource_deleted', {}, 'resource')}
                </span>

                <Button
                  type={CALLBACK_BUTTON}
                  icon="fa fa-fw fa-chevron-up"
                  label={trans('move_up', {}, 'resource')}
                  onClick={() => move(index, -1)}
                />
                <Button
                  type={CALLBACK_BUTTON}
                  icon="fa fa-fw fa-chevron-down"
                  label={trans('move_down', {}, 'resource')}
                  onClick={() => move(index, 1)}
                />
                <Button
                  type={CALLBACK_BUTTON}
                  icon="fa fa-fw fa-trash"
                  label={trans('delete', {}, 'actions')}
                  onClick={() => remove(index)}
                />
              </li>
            )
          })}
        </ul>
      }

      <div className="d-flex gap-2">
        <Button
          type={MODAL_BUTTON}
          className="btn btn-outline-primary"
          icon="fa fa-fw fa-plus"
          label={trans('add_inputs', {}, 'resource')}
          modal={[MODAL_RESOURCES, {
            multiple: true,
            selectAction: (selected) => ({
              type: CALLBACK_BUTTON,
              callback: () => addInputs(selected)
            })
          }]}
        />

        <Button
          type={CALLBACK_BUTTON}
          className="btn btn-primary"
          icon="fa fa-fw fa-save"
          label={trans('save', {}, 'actions')}
          disabled={0 === inputs.length}
          onClick={save}
        />
      </div>
    </div>
  )
}

export {
  ResourceInputsEditor
}