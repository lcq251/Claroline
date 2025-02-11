import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

const PageSimple = {
  propTypes: {
    id: T.string,
    className: T.string,

    /**
     * Is the current page embedded into another one ?
     *
     * @type {bool}
     */
    embedded: T.bool,

    children: T.node,

    /**
     * A list of additional styles to add to the page.
     */
    styles: T.arrayOf(T.string)
  },
  defaultProps: {
    embedded: false,
    styles: []
  }
}

/**
 * The definition of an application page.
 *
 * @type {object}
 */
const PageFull = {
  propTypes: merge({}, PageSimple.propTypes, {
    /**
     * The path of the page inside the application (used to build the breadcrumb).
     */
    breadcrumb: T.arrayOf(T.shape({
      label: T.string.isRequired,
      target: T.string
    })),

    /**
     * The title of the page.
     *
     * @type {string}
     */
    title: T.string,

    /**
     * The description of the page.
     *
     * @type {string}
     */
    description: T.string,
    showHeader: T.bool
  }),
  defaultProps: merge({}, PageSimple.defaultProps, {
    showHeader: true,
    breadcrumb: []
  })
}

export {
  PageFull,
  PageSimple
}
