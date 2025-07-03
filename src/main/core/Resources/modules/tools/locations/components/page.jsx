import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool'

import {Location as LocationTypes} from '#/main/core/tools/locations/prop-types'
import {PageHeading, PageHeadingSkeleton} from '#/main/app/page/components/heading'
import {PageContent, PageSection, PageToolbar, PageToolbarSkeleton} from '#/main/app/page'
import {TextSkeleton} from '#/main/app/components/placeholder'

const LocationPage = (props) =>
  <ToolPage
    title={trans('location_name', {name: get(props.location, 'name', trans('loading'))}, 'location')}
    description={get(props.location, 'meta.description')}
  >
    {isEmpty(props.location) &&
      <PageContent className="placeholder-glow">
        <PageToolbarSkeleton toolbar="edit more" />
        <PageHeadingSkeleton />
        <PageSection className="mb-5">
          <TextSkeleton />
        </PageSection>
      </PageContent>
    }

    {!isEmpty(props.location) &&
      <PageContent poster={get(props.location, 'poster')}>
        <PageToolbar
          toolbar="edit more"
          actions={[
            {
              name: 'edit',
              type: LINK_BUTTON,
              icon: 'fa fa-fw fa-pencil',
              label: trans('edit', {}, 'actions'),
              target: `${props.path}/${props.location.id}/edit`,
              primary: true
            }
          ]}
        />

        <PageHeading
          title={get(props.location, 'name')}
        />

        {props.children}
      </PageContent>
    }
  </ToolPage>

LocationPage.propTypes = {
  path: T.string.isRequired,
  location: T.shape(
    LocationTypes.propTypes
  ),
  children: T.node
}

export {
  LocationPage
}
