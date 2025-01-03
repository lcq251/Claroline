import React from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import {Fade} from 'react-bootstrap'
import classes from 'classnames'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl'
import {hasPermission} from '#/main/app/security'
import {getPlainText} from '#/main/app/data/types/html/utils'
import {Datetime} from '#/main/app/components/date'
import {LINK_BUTTON, LinkButton} from '#/main/app/buttons'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {PageSection} from '#/main/app/page'
import {UserMicro} from '#/main/core/user/components/micro'
import {Badge} from '#/main/app/components/badge'
import {ToolPage} from '#/main/core/tool'
import {Html} from '#/main/app/components/html'
import {Text} from '#/main/app/components/text'
import {PlaceholderParagraph} from '#/main/app/components/placeholder'
import {DataMicro} from '#/main/app/data/components/micro'
import {selectors as contextSelectors} from '#/main/app/context'
import {selectors as toolSelectors} from '#/main/core/tool'

import {Announcement as AnnouncementTypes} from '#/plugin/announcement/prop-types'
import {selectors} from '#/plugin/announcement/tools/announcement/store'
import {ButtonSticky} from '#/main/app/button'
import {EmptyState} from '#/main/app/components/empty-state'

const Announce = (props) =>
  <Fade key={props.key} in={true} appear={true}>
    <li className="announce-post">
      {(!props.loaded || props.announcement.poster) &&
        <Thumbnail
          className={classes('rounded-4', {
            'placeholder': !props.loaded
          })}
          size="xl"
          thumbnail={props.loaded && get(props.announcement, 'poster')}
          name={props.loaded && get(props.announcement, 'title')}
          square={true}
        />
      }

      <div className="flex-fill" role="presentation">
        <div className="text-body-tertiary d-flex align-items-center gap-3" role="presentation">
          {(!props.loaded || get(props.announcement, 'meta.publishedAt')) &&
            <Datetime
              className={classes('fs-sm', {
                'placeholder rounded-1 w-25': !props.loaded
              })}
              value={get(props.announcement, 'meta.publishedAt')}
              long={true}
            />
          }

          {props.loaded && !isEmpty(props.announcement.tags) &&
            <div role="presentation">
              {props.announcement.tags.map(tag =>
                <Badge key={tag} variant="secondary" subtle={true} className="fs-sm lh-base">{tag}</Badge>
              )}
            </div>
          }
        </div>

        <LinkButton target={`${props.path}/${get(props.announcement, 'id')}`} className="text-reset text-decoration-none d-block">
          <h1 className={classes('h5 mt-3 mb-0', {
            'placeholder rounded-1 w-100': !props.loaded
          })}>{get(props.announcement, 'title')}</h1>

          {props.loaded && get(props.announcement, 'content') ?
            <>
              {props.preview ?
                <Text className="text-body-secondary mb-0 mt-4 announce-content announce-content-preview">{getPlainText(props.announcement.content)}</Text> :
                <Html className="text-body-secondary mb-0 mt-4 announce-content">{props.announcement.content}</Html>
              }
            </> :
            <PlaceholderParagraph className="text-body-secondary mb-0 mt-4 announce-content" rows={3} />
          }
        </LinkButton>

        <div className="mt-4 d-flex flex-row gap-3" role="presentation">
          {!props.loaded ?
            <DataMicro object={{}} loaded={false} className="fs-sm fw-bolder flex-fill" /> :
            <UserMicro
              className="fs-sm fw-bolder"
              {...get(props.announcement, 'meta.creator', {})}
              // noStatus={true}
              link={true}
            />
          }

          {props.preview &&
            <LinkButton target={`${props.path}/${get(props.announcement, 'id')}`} className={classes('btn btn-link ms-auto', !props.loaded && 'placeholder')}>
              {trans('read_more', {}, 'actions')}
              <span className="ms-2 fa fa-arrow-right" aria-hidden={true} />
            </LinkButton>
          }
        </div>
      </div>
    </li>
  </Fade>

Announce.propTypes = {
  className: T.string,
  path: T.string.isRequired,
  announcement: T.shape(
    AnnouncementTypes.propTypes
  ).isRequired,
  preview: T.bool
}

const AnnouncementList = () => {
  const contextPath = useSelector(contextSelectors.path)
  const toolPath = useSelector(toolSelectors.path)
  const posts = useSelector(selectors.sortedPosts)
  const listFullContent = useSelector(selectors.listFullContent)
  const loaded = useSelector(toolSelectors.loaded)
  const tool = useSelector(toolSelectors.toolData)

  return (
    <ToolPage>
      {(loaded && 0 === posts.length) &&
        <EmptyState
          icon="fa fa-bullhorn"
          title={trans('Aucune annonce', {}, 'announcement')}
          description={trans('Vous pourrez retrouver ici les dernières nouvelles de votre espace plus tard.', {}, 'announcement')}
          primaryAction={{
            type: LINK_BUTTON,
            label: trans('add_announcement', {}, 'actions'),
            target: `${toolPath}/add`,
            displayed: hasPermission('edit', tool)
          }}
          secondaryAction={{
            type: LINK_BUTTON,
            icon: 'fa fa-arrow-left',
            label: trans('back_home', {}, 'actions'),
            target: contextPath
          }}
        />
      }

      <PageSection
        size="lg"
      >
        {!loaded &&
          <ul className="announcements-list list-unstyled my-5 placeholder-glow">
            <Announce key={1} path={toolPath} announcement={{}} preview={!listFullContent} />
            <Announce key={2} path={toolPath} announcement={{}} preview={!listFullContent} />
            <Announce key={3} path={toolPath} announcement={{}} preview={!listFullContent} />
            <Announce key={4} path={toolPath} announcement={{}} preview={!listFullContent} />
            <Announce key={5} path={toolPath} announcement={{}} preview={!listFullContent} />
          </ul>
        }

        {(loaded && 0 !== posts.length) &&
          <ul className="announcements-list list-unstyled my-5">
            {posts.map((post, index) =>
              <Announce
                key={index}
                path={toolPath}
                announcement={post}
                loaded={loaded}
                preview={!listFullContent}
              />
            )}
          </ul>
        }

        {0 !== posts.length && hasPermission('edit', tool) &&
          <ButtonSticky
            {...{
              type: LINK_BUTTON,
              icon: 'fa fa-plus',
              label: trans('add_announcement', {}, 'actions'),
              target: `${toolPath}/add`
            }}
          />
        }
      </PageSection>
    </ToolPage>
  )
}

export {
  AnnouncementList
}
