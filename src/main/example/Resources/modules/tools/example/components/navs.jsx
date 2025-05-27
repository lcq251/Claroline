import React from 'react'

import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {ContentTitle} from '#/main/app/content/components/title'
import {ContentMenu} from '#/main/app/content/components/menu'
import {PageSection} from '#/main/app/page'

const ExampleNavs = () =>
  <PageSection size="xl">
    <ContentTitle title="Menu" />
    <ContentMenu
      autoFocus={false}
      items={[
        {
          id: 'item-1',
          icon: 'rocket',
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          description: 'Sed dignissim vulputate ante, quis ultrices tellus euismod vel.',
          action: { type: CALLBACK_BUTTON, callback: () => true }
        }, {
          id: 'item-2',
          icon: 'rocket',
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          description: 'Sed dignissim vulputate ante, quis ultrices tellus euismod vel.',
          action: { type: CALLBACK_BUTTON, callback: () => true },
          group: 'Group 1'
        }, {
          id: 'item-3',
          icon: 'rocket',
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          description: 'Sed dignissim vulputate ante, quis ultrices tellus euismod vel.',
          action: { type: CALLBACK_BUTTON, callback: () => true },
          group: 'Group 1'
        }, {
          id: 'item-4',
          icon: 'rocket',
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          description: 'Sed dignissim vulputate ante, quis ultrices tellus euismod vel.',
          action: { type: CALLBACK_BUTTON, callback: () => true },
          group: 'Group 2'
        }, {
          id: 'item-5',
          icon: 'rocket',
          label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          description: 'Sed dignissim vulputate ante, quis ultrices tellus euismod vel.',
          action: { type: CALLBACK_BUTTON, callback: () => true },
          group: 'Group 2'
        }
      ]}
    />
  </PageSection>

export {
  ExampleNavs
}
