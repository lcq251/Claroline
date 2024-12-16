import React, {Component, forwardRef} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import omit from 'lodash/omit'

import {implementPropTypes} from '#/main/app/prop-types'
import {trans, transChoice} from '#/main/app/intl/translation'
import {makeCancelable, url} from '#/main/app/api'
import {param} from '#/main/app/config'
import {toKey} from '#/main/app/utils/text'
import {Button} from '#/main/app/action/components/button'
import {CallbackButton, CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ContentLoader} from '#/main/app/content/components/loader'
import {DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'

import {MODAL_TAGS} from '#/plugin/tag/modals/tags'
import {Tag as TagTypes} from '#/plugin/tag/data/types/tag/prop-types'
import {Menu, MenuOverlay} from '#/main/app/overlays/menu'

import {Badge} from '#/main/app/components/badge'

const TagPreview = props =>
  <CallbackButton
    className="tag-preview w-100"
    callback={props.select}
  >
    <Badge className="me-2 lh-base fs-sm" variant="primary" subtle={true}>{props.name}</Badge>

    {transChoice('count_elements', props.elements, {count: props.elements})}

    {props.meta.description &&
      <p className="text-body-secondary fs-sm mt-1 mb-0">
        {props.meta.description}
      </p>
    }
  </CallbackButton>

implementPropTypes(TagPreview, TagTypes, {
  select: T.func.isRequired
})

const TagsList = forwardRef((props, ref) =>
  <div
    {...omit(props, 'isFetching', 'currentTag', 'tags', 'select', 'canCreate', 'create')}
    className={classes('dropdown-menu-full', props.className)}
    ref={ref}
  >
    {props.isFetching &&
      <ContentLoader />
    }

    {(!props.isFetching && 0 !== props.tags.length) &&
      <ul className="list-unstyled mb-0 d-flex flex-row flex-wrap align-items-start gap-2">
        {props.tags.map((tag) =>
          <li key={tag.id}>
            <TagPreview
              {...tag}
              select={() => props.select([tag])}
            />
          </li>
        )}
      </ul>
    }

    {props.canCreate &&
      <Button
        className="w-100"
        variant="btn"
        type={CALLBACK_BUTTON}
        label={trans('create-named-tag', {tagName: props.currentTag}, 'actions')}
        callback={props.create}
        primary={true}
        disabled={props.isFetching}
      />
    }
  </div>
)

TagsList.propTypes = {
  className: T.string,
  currentTag: T.string,
  isFetching: T.bool,
  tags: T.arrayOf(T.shape(
    TagTypes.propTypes
  )),
  select: T.func.isRequired,
  create: T.func.isRequired,
  canCreate: T.bool.isRequired
}

TagsList.defaultProps = {
  tags: []
}

class TagInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      listOpened: false,
      currentTag: '',
      isFetching: false,
      results: []
    }

    this.close = this.close.bind(this)
    this.create = this.create.bind(this)
    this.select = this.select.bind(this)
    this.remove = this.remove.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  close() {
    this.setState({listOpened: false})
  }

  create() {
    fetch(url(['apiv2_tag_create']), {
      method: 'POST' ,
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        // next header is required for symfony to recognize our requests as XMLHttpRequest
        // there is no spec about possible values, but this is the one expected by symfony
        // @see Symfony\Component\HttpFoundation\Request::isXmlHttpRequest
        'X-Requested-With': 'XMLHttpRequest'
      }),
      credentials: 'include',
      body: JSON.stringify({
        name: this.state.currentTag
      })
    })
      .then(response => response.json())
      .then(tag => {
        this.props.onChange([].concat(this.props.value || [], [tag.name]))

        this.setState({
          listOpened: false,
          currentTag: ''
        })
      })
  }

  select(tags = []) {
    const newValue = this.props.value ? this.props.value.slice() : []

    tags.map(tag => {
      if (-1 === newValue.indexOf(tag.name)) {
        newValue.push(tag.name)
      }
    })

    this.props.onChange(newValue)

    this.setState({
      listOpened: false,
      currentTag: ''
    })
  }

  remove(tagName) {
    const tagPos = this.props.value.indexOf(tagName)
    if (-1 !== tagPos) {
      const newValue = this.props.value.slice()
      newValue.splice(tagPos, 1)

      this.props.onChange(newValue)
    }
  }

  onChange(e) {
    const value = e.target.value

    this.setState({currentTag: value})

    // cancel previous search if any
    if (this.pending) {
      this.pending.cancel()
    }

    if (value && 3 <= value.length) {
      this.setState({
        listOpened: true,
        isFetching: true
      })

      this.pending = makeCancelable(
        fetch(
          url(['apiv2_tag_list'], {filters: {name: value}}), {
            method: 'GET' ,
            credentials: 'include'
          })
          .then(response => response.json())
          .then(results => this.setState({results: results.data, isFetching: false}))
      )

      this.pending.promise.then(
        () => this.pending = null,
        () => this.pending = null
      )
    } else {
      this.setState({
        isFetching: false,
        results: []
      })
    }
  }

  componentWillUnmount() {
    if (this.pending) {
      this.pending.cancel()
    }
  }

  render() {
    return (
      <>
        <div
          ref={element => this.input = element}
          className={classes('tags-control dropdown', this.props.className, {
            open: this.state.listOpened
          })}
          role="presentation"
        >
          <div className={classes('input-group', {
            [`input-group-${this.props.size}`]: !!this.props.size
          })} role="presentation">
            <Button
              className="btn btn-body"
              type={MODAL_BUTTON}
              icon="fa fa-fw fa-magnifying-glass"
              label={trans('browse_tags', {}, 'actions')}
              tooltip="right"
              disabled={this.props.disabled}
              modal={[MODAL_TAGS, {
                selectAction: (selectedTags) => ({
                  type: CALLBACK_BUTTON,
                  label: trans('add', {}, 'actions'),
                  callback: () => this.select(selectedTags)
                })
              }]}
            />

            <input
              id={this.props.id}
              className="form-control"
              type="text"
              disabled={this.props.disabled}
              value={this.state.currentTag}
              onChange={this.onChange}
              placeholder="Recherchez un tag pour l'ajouter ou le créer s'il n'existe pas."
            />
          </div>

          <MenuOverlay
            id={`${this.props.id}-search-menu`}
            show={this.state.listOpened}
            onToggle={this.close}
          >
            <Menu
              className="p-2"
              align="end"
              as={TagsList}

              currentTag={this.state.currentTag}
              isFetching={this.state.isFetching}
              tags={this.state.results}
              select={this.select}
              create={this.create}
              canCreate={param('canCreateTags')}
            />
          </MenuOverlay>
        </div>

        {isEmpty(this.props.value) &&
          <em className="text-body-tertiary mt-3 d-block">{trans('no_tag', {}, 'tag')}</em>
        }

        {!isEmpty(this.props.value) &&
          <div className="d-flex flex-row mt-3 gap-1" role="presentation">
            {this.props.value.map(tag =>
              <Badge key={toKey(tag)} variant="secondary" subtle={true} className="lh-base fs-sm d-flex align-items-center gap-2">
                {tag}

                <Button
                  className="btn btn-link text-reset p-0"
                  type={CALLBACK_BUTTON}
                  icon="fa fa-fw fa-times"
                  label={trans('remove', {}, 'actions')}
                  tooltip="bottom"
                  disabled={this.props.disabled}
                  callback={() => this.remove(tag)}
                  size="sm"
                />
              </Badge>
            )}
          </div>
        }
      </>
    )
  }
}

implementPropTypes(TagInput, DataInputTypes, {
  value: T.arrayOf(T.string)
}, {
  value: []
})

export {
  TagInput
}
