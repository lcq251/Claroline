import {checkPropTypes} from 'prop-types'
import {getApp, getApps} from '#/main/app/plugins'

import {BadgeRuleType} from '#/plugin/open-badge/badge-rule/prop-types'

/**
 * Gets all the badge rules types registered in the application.
 *
 * @return {Promise.<Array>}
 */
function getRules() {
  // get all data types declared
  const ruleTypes = getApps('badge_rules')

  return Promise.all(
    // boot types applications
    Object.keys(ruleTypes).map(type => ruleTypes[type]())
  ).then((loadedTypes) => loadedTypes
      .map(loadedType => {
        // append some default values
        const defaultedType = Object.assign({}, BadgeRuleType.defaultProps, loadedType.default)

        // validate type def
        checkPropTypes(BadgeRuleType.propTypes, defaultedType, 'prop', `BadgeRuleType<${defaultedType.name}>`)

        return defaultedType
      }),
    (error) => {
      /* eslint-disable no-console */
      console.error(error)
      /* eslint-enable no-console */
    }
  )
}

async function getRule(typeName) {
  // retrieve the data type application
  const ruleType = getApp('badge_rules', typeName)

  return ruleType()
    .then((loadedType) => {
      // append some default values
      const defaultedType = Object.assign({}, BadgeRuleType.defaultProps, loadedType.default)

      // validate type def
      checkPropTypes(BadgeRuleType.propTypes, defaultedType, 'prop', `DataType<${defaultedType.name}>`)

      return defaultedType
    }, (error) => {
      /* eslint-disable no-console */
      console.error(error)
      /* eslint-enable no-console */
    })
}

export {
  getRules,
  getRule
}
