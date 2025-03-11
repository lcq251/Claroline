import React, {Fragment, useId} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'

import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl'

const EditorMenuSection = ({
  className,
  title,
  showTitle = true,
  links = []
}) => {
  const titleId = useId()

  if (1 === links.length) {
    return (
      <div className={classes('app-editor-menu-section mb-2 ms-auto', className)}>
        <h3 id={titleId} className={classes('app-editor-menu-header mb-2', !showTitle && 'visually-hidden')}>{title}</h3>

        <div className="app-menu-items mx-n4" role="presentation">
          <Button
            {...links[0]}
            className="app-menu-item text-truncate focus-ring"
            onClick={() => document.querySelector('.app-editor-body').focus()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={classes('app-editor-menu-section mb-2 ms-auto', className)}>
      <h3 id={titleId} className={classes('app-editor-menu-header mb-2', !showTitle && 'visually-hidden')}>{title}</h3>

      <ul className="app-menu-items list-unstyled mb-0 mx-n4" aria-labelledby={titleId}>
        {links.map(action =>
          <li key={action.name}>
            <Button
              {...action}
              className="app-menu-item text-truncate focus-ring"
              onClick={() => document.querySelector('.app-editor-body').focus()}
            />
          </li>
        )}
      </ul>
    </div>
  )
}

EditorMenuSection.propTypes = {
  className: T.string,
  title: T.string.isRequired,
  showTitle: T.bool,
  links: T.arrayOf(T.shape({
    name: T.string.isRequired
  })).isRequired
}

const EditorMenu = (props) => {
  // filter hidden pages
  const pages = props.pages.filter(page => undefined === page.displayed || page.displayed)

  const commonPages = pages.filter(page => page.standard)
  const advancedPages = pages.filter(page => page.advanced)
  const otherPages = pages.filter(page => !page.standard && !page.advanced)

  const unclassified = otherPages.filter(page => undefined === page.group)
  const groups = groupBy(otherPages, (page) => page.group)
  delete groups['undefined']

  const menuTitleId = useId()

  return (
    <div className="app-menu app-editor-menu" role="presentation">
      {props.thumbnail &&
        <div className="app-editor-menu-thumbnail mb-3 text-center" role="presentation">
          {props.thumbnail}
        </div>
      }

      <h1 className="app-editor-menu-header mb-2">
        {props.title}
        <span className="visually-hidden" role="presentation"> - {trans('edition')}</span>
      </h1>

      <h2 id={menuTitleId} className="visually-hidden">{trans('editor_menu')}</h2>
      <nav aria-labelledby={menuTitleId}>
        {!isEmpty(commonPages) &&
          <EditorMenuSection
            title={trans('general_parameters')}
            showTitle={false}
            links={commonPages.concat(unclassified).map(page => ({
              name: page.name,
              label: page.title,
              type: LINK_BUTTON,
              target: props.path + '/' + page.name
            }))}
          />
        }

        {Object.keys(groups).map(groupName =>
          <Fragment key={groupName}>
            <hr className="app-editor-menu-separator my-2" aria-hidden={true} />
            <EditorMenuSection
              className="mt-3"
              title={groupName}
              links={groups[groupName].map(page => ({
                name: page.name,
                label: page.title,
                type: LINK_BUTTON,
                target: props.path + '/' + page.name
              }))}
            />
          </Fragment>
        )}

        {!isEmpty(advancedPages) &&
          <>
            <hr className="app-editor-menu-separator my-2" aria-hidden={true} />
            <EditorMenuSection
              title={trans('advanced')}
              showTitle={false}
              links={advancedPages.map(page => ({
                name: page.name,
                label: page.title,
                type: LINK_BUTTON,
                target: props.path + '/' + page.name
              }))}
            />
          </>
        }
      </nav>
    </div>
  )
}

EditorMenu.propTypes = {
  path: T.string.isRequired,
  title: T.string.isRequired,
  pages: T.arrayOf(T.shape({
    name: T.string.isRequired,
    title: T.string.isRequired,
    managerOnly: T.bool,
    standard: T.bool,
    advanced: T.bool
  })),
  actions: T.bool
}

export {
  EditorMenu
}