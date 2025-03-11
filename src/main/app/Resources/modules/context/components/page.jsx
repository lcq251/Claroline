import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl'
import {Action, PromisedAction} from '#/main/app/action/prop-types'
import {PageBody, PageSimple} from '#/main/app/page'

import {selectors} from '#/main/app/context/store'
import {ContextMenu} from '#/main/app/context/components/menu'
import {PageMenu} from '#/main/app/page/components/menu'

const ContextPage = ({
  className,
  title,
  description,
  children,
  menu,
  styles = [],
  embedded = false,
  showHeader = true,
  breadcrumb = []
}) => {
  const contextType = useSelector(selectors.type)
  const contextData = useSelector(selectors.data)
  const contextPath = useSelector(selectors.path)

  return (
    <PageSimple
      className={className}
      title={title ?
        title + ' | ' + get(contextData, 'name', trans(contextType, {}, 'context')) :
        get(contextData, 'name', trans(contextType, {}, 'context'))
      }
      description={description || get(contextData, 'meta.description')}
      styles={styles}
      embedded={embedded}
    >
      {(!embedded || showHeader) &&
        <PageMenu
          embedded={embedded}
          {...menu}
          breadcrumb={[
            {
              label: get(contextData, 'name') || trans(contextType, {}, 'context'),
              target: contextPath
            }
          ].concat(breadcrumb || [])}
          affix={ContextMenu}
        />
      }

      <PageBody embedded={embedded}>
        {!embedded &&
          <h1 className="visually-hidden">{title ?
            title :
            get(contextData, 'name') || trans(contextType, {}, 'context')}
          </h1>
        }

        {children}
      </PageBody>
    </PageSimple>
  )
}

ContextPage.propTypes = merge({}, PageSimple.propTypes, {
  /**
   * The path of the page inside the context.
   */
  breadcrumb: T.arrayOf(T.shape({
    label: T.string.isRequired,
    target: T.string
  })),
  showHeader: T.bool,
  menu: T.shape({
    /**
     * The main navigation elements.
     */
    nav: T.arrayOf(T.shape(
      Action.propTypes
    )),
    toolbar: T.string,

    /**
     * A list of actions.
     */
    actions: T.oneOfType([
      // a regular array of actions
      T.arrayOf(T.shape(
        Action.propTypes
      )),
      // a promise that will resolve a list of actions
      T.shape(
        PromisedAction.propTypes
      )
    ]),
    children: T.node
  })
})

export {
  ContextPage
}
