import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'

import {FormSave} from '#/main/app/content/form/components/save'

const FormWrapper = props => props.embedded ?
  <fieldset
    {...omit(props, 'embedded', 'flush', 'children')}
    className={classes('form data-form d-flex flex-column gap-5', props.className, props.flush && 'data-form-flush')}
  >
    {props.children}
  </fieldset>
  :
  <form
    {...omit(props, 'embedded', 'flush', 'children')}
    className={classes('form data-form d-flex flex-column gap-5', props.className, props.flush && 'data-form-flush', !props.flush && 'content-lg')}
    onSubmit={(e) => e.preventDefault()}
  >
    {props.children}
  </form>

FormWrapper.propTypes = {
  id: T.string,
  className: T.string,
  embedded: T.bool,
  flush: T.bool,
  children: T.node.isRequired
}

FormWrapper.defaultProps = {
  embedded: false,
  flush: false
}

class Form extends Component {
  constructor(props) {
    super(props)

    this.warnPendingChanges = this.warnPendingChanges.bind(this)
  }

  warnPendingChanges(e) {
    if (this.props.alertExit && this.props.pendingChanges) {
      // note: this is supposed to be the text displayed in the browser built-in
      // popup (see https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload#Example)
      // but it doesn't seem to be actually used in modern browsers. We use it
      // here because a string is needed anyway.
      e.returnValue = trans('unsaved_changes_warning')

      return e.returnValue
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.warnPendingChanges)
  }

  componentWillUnmount() {
    // if client route has changed, it will not trigger before unload
    window.removeEventListener('beforeunload', this.warnPendingChanges)
  }

  render() {
    return (
      <FormWrapper
        {...omit(this.props, 'new', 'name', 'dataPart', 'buttons', 'data', 'level', 'displayLevel', 'title', 'errors', 'pendingChanges', 'alertExit', 'children', 'save', 'cancel', 'onSave', 'target', 'saveForm', 'cancelForm')}
      >
        {this.props.children}

        {(this.props.save || this.props.cancel) &&
          <FormSave
            pendingChanges={this.props.pendingChanges}
            errors={this.props.errors}
            save={this.props.save}
            cancel={this.props.cancel}
          />
        }
      </FormWrapper>
    )
  }
}

Form.propTypes = {
  id: T.string,
  className: T.string,
  /**
   * Is the form embed into another ?
   *
   * Permits to know if we use a <form> or a <fieldset> tag.
   */
  embedded: T.bool,
  flush: T.bool,
  disabled: T.bool,
  level: T.number,
  displayLevel: T.number,
  errors: T.bool,
  pendingChanges: T.bool,
  /**
   * Alerts the user when leaving the form with unsaved changes
   */
  alertExit: T.bool,
  children: T.node.isRequired,

  /**
   * The save action of the form (if provided, form toolbar will be displayed).
   */
  save: T.shape({
    type: T.string.isRequired,
    disabled: T.bool
  }),

  /**
   * The cancel action of the form (if provided, form toolbar will be displayed).
   */
  cancel: T.shape({
    type: T.string.isRequired,
    disabled: T.bool
  })
}

Form.defaultProps = {
  disabled: false,
  level: 2,
  errors: false,
  pendingChanges: false,
  alertExit: true
}

export {
  Form
}
