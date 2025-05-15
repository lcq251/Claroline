import React, {Fragment, useEffect} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl'
import {Alert} from '#/main/app/components/alert'
import {FormStats} from '#/main/app/content/form/stats/components/main'

const CourseStats = (props) => {
  useEffect(() => {
    props.loadStats(props.course.id)
  }, [props.course.id])

  return (
    <>
      <Alert type="info" className="mt-4">
        {trans('course_stats_help', {}, 'cursus')}
      </Alert>

      <FormStats stats={props.stats} className="mb-3" />
    </>
  )
}

CourseStats.propTypes = {
  course: T.object.isRequired,
  stats: T.shape({
    total: T.number,
    fields: T.arrayOf(T.shape({
      field: T.object.isRequired,
      values: T.array
    }))
  }),
  loadStats: T.func.isRequired
}

export {
  CourseStats
}
