import React, {} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {PageSection} from '#/main/app/page'
import {Html} from '#/main/app/components/html'
import {DetailsData} from '#/main/app/content/details'

import {Location as LocationTypes} from '#/main/core/tools/locations/prop-types'

const LocationAbout = (props) =>
  <>
    {get(props.location, 'meta.description') &&
      <PageSection>
        <Html className="lead mb-5 mt-4">{get(props.location, 'meta.description')}</Html>
      </PageSection>
    }

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
  </>

LocationAbout.propTypes = {
  location: T.shape(
    LocationTypes.propTypes
  )
}

export {
  LocationAbout
}
