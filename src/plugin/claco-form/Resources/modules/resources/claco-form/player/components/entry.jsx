import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {url} from '#/main/app/api'
import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {DetailsData} from '#/main/app/content/details'
import {formatField} from '#/main/app/content/form/parameters/utils'

import {MODAL_USERS} from '#/main/community/modals/users'

import {
  Field as FieldType,
  Entry as EntryType
} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {generateFromTemplate} from '#/plugin/claco-form/resources/claco-form/template'
import {selectors} from '#/plugin/claco-form/resources/claco-form/store'

import {ResourcePage} from '#/main/core/resource'
import {PageContent, PageHeading, PageSection} from '#/main/app/page'
import {Html} from '#/main/app/components/html'
import {ContentPublication} from '#/main/app/content/components/publication'
import {Tags} from '#/main/app/components/tags'

class Entry extends Component {
  canViewMetadata() {
    return this.props.canEdit ||
      this.props.displayMetadata === 'all' ||
      (this.props.displayMetadata === 'manager' && this.props.canAdministrate)
  }

  isFieldDisplayable(field) {
    return isEmpty(field.restrictions.confidentiality)
      || 'none' === field.restrictions.confidentiality
      || this.props.canAdministrate
      || ('owner' === field.restrictions.confidentiality && this.props.isOwner)
  }

  getSections(fields) {
    return [
      {
        id: 'general',
        title: trans('general'),
        primary: true,
        fields: fields
          .filter(f => this.isFieldDisplayable(f))
          .map(f => {
            const params = formatField(f, fields, 'values', true)

            switch (f.type) {
              case 'file':
                if (this.props.entry && this.props.entry.values && this.props.entry.values[f.id]) {
                  params['calculated'] = (data) => Object.assign(
                    {},
                    data.values[f.id],
                    {url: url(['claro_claco_form_field_value_file_download', {entry: data.id, field: f.id}])}
                  )
                }
                break
            }

            return params
          })
      }
    ]
  }

  render() {
    if (!this.props.canViewEntry && !this.props.canEdit) {
      return (
        <div className="alert alert-danger">
          {trans('unauthorized')}
        </div>
      )
    }

    return (
      <ResourcePage>
        <PageContent>
          <PageHeading
            title={this.props.entry.title}
            primaryAction="edit"
            actions={[
              {
                name: 'edit',
                type: LINK_BUTTON,
                icon: 'fa fa-fw fa-pencil',
                label: trans('edit', {}, 'actions'),
                target: `${this.props.path}/entry/form/${this.props.entry.id}`,
                displayed: !this.props.entry.locked && this.props.canEdit,
                group: trans('management'),
                primary: true
              }, {
                name: 'export-pdf',
                type: CALLBACK_BUTTON,
                icon: 'fa fa-fw fa-file-pdf',
                label: trans('export-pdf', {}, 'actions'),
                callback: () => this.props.downloadEntryPdf(this.props.entry.id),
                displayed: this.props.canGeneratePdf,
                group: trans('transfer')
              }, {
                name: 'publish',
                type: CALLBACK_BUTTON,
                icon: classes('fa fa-fw', {
                  'fa-eye-slash': 1 === this.props.entry.status,
                  'fa-eye': 1 !== this.props.entry.status
                }),
                label: trans(this.props.entry.status === 1 ? 'unpublish':'publish', {}, 'actions'),
                callback: () => this.props.switchEntryStatus(this.props.entry.id),
                displayed: !this.props.entry.locked && this.props.canAdministrate,
                group: trans('management')
              }, {
                name: 'change-owner',
                type: MODAL_BUTTON,
                icon: 'fa fa-fw fa-user-edit',
                label: trans('change_owner', {}, 'actions'),
                modal: [MODAL_USERS, {
                  selectAction: (users) => ({
                    type: CALLBACK_BUTTON,
                    label: trans('change_owner', {}, 'actions'),
                    callback: () => this.props.changeEntryOwner(users[0])
                  })
                }],
                displayed: this.props.canAdministrate,
                group: trans('management')
              }, {
                name: 'lock',
                type: CALLBACK_BUTTON,
                icon: classes('fa fa-fw', {
                  'fa-lock': !this.props.entry.locked,
                  'fa-unlock': this.props.entry.locked
                }),
                label: trans(this.props.entry.locked ? 'unlock':'lock', {}, 'actions'),
                callback: () => this.props.switchEntryLock(this.props.entry.id),
                displayed: this.props.canAdministrate,
                group: trans('management')
              }, {
                name: 'delete',
                type: CALLBACK_BUTTON,
                icon: 'fa fa-fw fa-trash',
                label: trans('delete', {}, 'actions'),
                callback: () => this.props.deleteEntry(this.props.entry).then(() => this.props.history.push(`${this.props.path}/entries`)),
                confirm: {
                  title: trans('delete_entry', {}, 'clacoform'),
                  message: trans('delete_entry_confirm_message', {title: this.props.entry.title}, 'clacoform')
                },
                dangerous: true,
                displayed: !this.props.entry.locked && this.props.canAdministrate,
                group: trans('management')
              }
            ]}
          />

          <PageSection className="mb-5">
            {this.canViewMetadata() &&
              <ContentPublication
                className="mb-4"
                user={this.props.entry.user}
                publishedAt={get(this.props.entry, 'publicationDate')}
              />
            }

            {this.props.helpMessage &&
              <Html className="bg-body-tertiary p-4 rounded-3 mb-4">
                {this.props.helpMessage}
              </Html>
            }

            {this.props.template && this.props.useTemplate ?
              <Html className="mb-4">
                {generateFromTemplate(this.props.template, this.props.fields, this.props.entry, this.props.isOwner, this.props.canAdministrate)}
              </Html> :
              <DetailsData
                className="mb-4"
                name={selectors.STORE_NAME+'.entries.current'}
                data={this.props.entry}
                definition={this.getSections(this.props.fields)}
              />
            }

            {((this.props.displayCategories || this.props.canAdministrate) && !isEmpty(this.props.entry.categories)) &&
              <Tags tags={this.props.entry.categories.map(category => category.name)} />
            }
          </PageSection>
        </PageContent>
      </ResourcePage>
    )
  }
}

Entry.propTypes = {
  path: T.string.isRequired,
  clacoFormId: T.string.isRequired,
  entryId: T.string,
  canEdit: T.bool.isRequired,
  canAdministrate: T.bool.isRequired,
  canGeneratePdf: T.bool.isRequired,
  canViewEntry: T.bool,

  isOwner: T.bool,

  helpMessage: T.string,
  displayMetadata: T.string.isRequired,
  displayCategories: T.bool.isRequired,

  template: T.string,
  useTemplate: T.bool.isRequired,
  titleLabel: T.string,

  entry: T.shape(EntryType.propTypes),
  fields: T.arrayOf(T.shape(FieldType.propTypes)),
  deleteEntry: T.func.isRequired,
  switchEntryStatus: T.func.isRequired,
  switchEntryLock: T.func.isRequired,
  downloadEntryPdf: T.func.isRequired,
  changeEntryOwner: T.func.isRequired,
  history: T.object.isRequired
}

export {
  Entry
}
