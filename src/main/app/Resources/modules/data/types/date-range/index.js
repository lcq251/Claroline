import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {chain, date, string} from '#/main/app/data/types/validators'

import {DateRangeInput} from '#/main/app/data/types/date-range/components/input'
import {DateRangeGroup} from '#/main/app/data/types/date-range/components/group'
import {declareDataType} from '#/main/app/data/types'
import {displayDateRange} from '#/main/app/intl'
import {parse as parseDate} from '#/main/app/data/types/date/utils'

export default declareDataType({
  name: 'date-range',
  meta: {
    icon: 'fa fa-fw fa-calendar-week',
    label: trans('date_range', {}, 'actions'),
    description: trans('date_range_desc', {}, 'actions')
  },

  parse: (display, options = {}) => {
    let parsed = [null, null]
    if (display) {
      if (display[0]) {
        parsed[0] = parseDate(display[0], options)
      }

      if (display[1]) {
        parsed[1] = parseDate(display[1], options)
      }
    }

    return parsed
  },

  render: (raw, options = {}) => displayDateRange(get(raw, '[0]'), get(raw, '[1]'), options.time),

  /**
   * Validates input value for a date range.
   *
   * @param {string} value
   * @param {object} options
   *
   * @return {boolean}
   */
  validate: (value, options = {}) => {
    // it's an array of strings
    // it contains two valid dates or null
    // start < end

    return Promise.all([
      value[0] ? chain(value[0], options, [string, date]) : Promise.resolve(undefined),
      value[1] ? chain(value[1], options, [string, date]) : Promise.resolve(undefined)
    ]).then(errors => {
      if (isEmpty(errors) || (isEmpty(errors[0]) && isEmpty(errors[1]))) {
        if (value[0] && value[0] > value[1]) {
          return [null, trans('invalid_date_range', {}, 'validators')]
        }
      } else {
        return errors
      }
    })
  },

  components: {
    input: DateRangeInput,
    group: DateRangeGroup
  }
})
