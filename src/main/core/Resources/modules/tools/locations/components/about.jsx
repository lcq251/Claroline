import React, {} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {PageSection} from '#/main/app/page'
import {DetailsData} from '#/main/app/content/details'

import {Location as LocationTypes} from '#/main/core/tools/locations/prop-types'

const LocationAbout = (props) =>
  <PageSection className="mb-5">
    <DetailsData
      data={props.location}
      definition={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'phone',
              type: 'string',
              label: trans('phone')
            }, {
              name: 'address',
              type: 'address',
              label: trans('address')
            }
          ]
        }
      ]}
    />
  </PageSection>

LocationAbout.propTypes = {
  location: T.shape(
    LocationTypes.propTypes
  )
}

export {
  LocationAbout
}
