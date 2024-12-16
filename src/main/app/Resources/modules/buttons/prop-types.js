import {PropTypes as T} from 'prop-types'

const Button = {
  propTypes: {
    id: T.string,
    className: T.string,
    size: T.oneOf(['sm', 'lg']),
    variant: T.string,
    children: T.node.isRequired,
    disabled: T.bool,
    active: T.bool,
    tabIndex: T.number,

    /**
     * If provided, the button will request a user confirmation before executing the action.
     *
     * @type {object}
     */
    confirm: T.shape({
      icon: T.string,
      title: T.string,
      message: T.string,
      button: T.string
    })
  },
  defaultProps: {
    disabled: false
  }
}

export {
  Button
}
