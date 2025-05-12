import React from 'react'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {useFetch} from '#/main/app/api/fetch'
import {ToolPage} from '#/main/core/tool'
import {Thumbnail} from '#/main/app/components/thumbnail'
import {ListData} from '#/main/app/content/list'
import {PageContent, PageHeading, PageHeadingSkeleton, PageSection, PageToolbarSkeleton} from '#/main/app/page'

import {selectors} from '#/plugin/tag/tools/tags/store'
import {TaggedObjectCard} from '#/plugin/tag/card/components/tagged-object'

const TagShow = (props) => {
  const [tag] = useFetch('tag', ['apiv2_tag_get', {id: props.id}])

  return (
    <ToolPage
      title={trans('tag_name', {name: get(tag, 'name', trans('loading'))}, 'tag')}
      description={get(tag, 'meta.description')}
    >
      {!tag &&
        <PageContent className="placeholder-glow">
          <PageToolbarSkeleton toolbar="edit more" />
          <PageHeadingSkeleton
            icon={true}
            description={true}
          />
        </PageContent>
      }

      {tag &&
        <PageContent>
          <PageHeading
            icon={
              <Thumbnail
                color={tag.color}
                name={tag.name}
                square={true}
                border={true}
              />
            }
            title={tag.name}
            description={get(tag, 'meta.description')}
          />

          <PageSection>
            <ListData
              className="mb-5"
              name={selectors.STORE_NAME + '.tag.objects'}
              fetch={{
                url: ['apiv2_tag_list_objects', {id: props.id}],
                autoload: true
              }}
              delete={{
                url: ['apiv2_tag_remove_objects', {id: props.id}]
              }}
              definition={[
                {
                  name: 'name',
                  label: trans('name'),
                  type: 'string',
                  displayed: true
                }
              ]}
              card={TaggedObjectCard}
            />
          </PageSection>
        </PageContent>
      }
    </ToolPage>
  )
}

export {
  TagShow
}
