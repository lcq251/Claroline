import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'

import {Button} from '#/main/app/action'
import {LINK_BUTTON} from '#/main/app/buttons'

const EditorMenuSection = (props) => {
  if (1 === props.links.length) {
    return (
      <nav className={classes('mb-2 ms-auto', props.className)}>
        {props.title &&
          <h2 className="app-editor-menu-header mb-2">{props.title}</h2>
        }

        <div className="app-menu-items mx-n4" role="presentation">
          <Button className="app-menu-item text-truncate focus-ring" {...props.links[0]} />
        </div>
      </nav>
    )
  }

  return (
    <nav className={classes('mb-2 ms-auto', props.className)}>
      {props.title &&
        <h2 className="app-editor-menu-header mb-2">{props.title}</h2>
      }

      <ul className="app-menu-items list-unstyled mb-0 mx-n4">
        {props.links.map(action =>
          <li key={action.name} className="">
            <Button className="app-menu-item text-truncate focus-ring" {...action} />
          </li>
        )}
      </ul>
    </nav>
  )
}

EditorMenuSection.propTypes = {
  className: T.string,
  title: T.string,
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

  return (
    <nav className="app-menu app-editor-menu" aria-label={props.title}>
      {props.thumbnail &&
        <div className="app-editor-menu-thumbnail mb-3 text-center" role="presentation">
          {props.thumbnail}
        </div>
      }

      {props.title &&
        <h1 className="app-editor-menu-header mb-2">{props.title}</h1>
      }

      {!isEmpty(commonPages) &&
        <EditorMenuSection
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