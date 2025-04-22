import {PropTypes as T} from 'prop-types'

import {User} from '#/main/community/prop-types'

const Badge = {
  propTypes: {
    id: T.string,
    name: T.string,
    image: T.string,
    color: T.string,
    issuingPeer: T.bool,
    notifyGrant: T.bool,
    duration: T.number,
    meta: T.shape({
      description: T.string,
      descriptionHtml: T.string,
      createdAt: T.string,
      updatedAt: T.string,
      archived: T.bool
    }),
    restrictions: T.shape({
      hideRecipients: T.bool
    })
  },
  defaultProps: {
    issuingPeer: false,
    meta: {
      archived: false
    },
    restrictions: {
      hideRecipients: false
    }
  }
}

const Assertion = {
  propTypes: {
    id: T.string,
    issuedOn: T.string.isRequired,
    badge: T.shape(
      Badge.propTypes
    ).isRequired,
    user: T.shape(
      User.propTypes
    ).isRequired
  }
}

const Evidence = {
  propTypes: {
    id: T.string,
    name: T.string,
    description: T.string,
    rule: T.shape({
      type: T.string.isRequired
    })
  }
}

export {
  Badge,
  Assertion,
  Evidence
}
