import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

const STATUS_LABELS = {
  expired: 'ai_lesson_expired',
  no_permission: 'ai_lesson_no_permission',
  quota_exceeded: 'ai_lesson_quota_exceeded',
  no_linked_lesson: 'ai_lesson_no_linked_lesson'
}

const STATUS_VARIANTS = {
  expired: 'danger',
  no_permission: 'warning',
  quota_exceeded: 'warning',
  no_linked_lesson: 'info'
}

const AiLessonInfo = ({context}) => {
  if (!context) return null

  const aiLesson = context.aiLesson

  return (
    <div className="ai-lesson-info card mb-3">
      <div className="card-body d-flex align-items-center gap-3">
        {context.allowed ? (
          <>
            <span className="fa fa-robot fa-2x text-primary" />
            <div className="flex-grow-1">
              <strong>{aiLesson?.name || trans('ai_lesson', {}, 'resource')}</strong>
              <div className="text-muted small">
                {trans('ai_lesson_status_active', {}, 'resource')}
                {aiLesson?.usageLimit && ` - ${trans('remaining_quota', {count: aiLesson.usageLimit - aiLesson.usageCount}, 'resource')}`}
              </div>
            </div>
          </>
        ) : (
          <>
            <span className={`fa fa-exclamation-triangle fa-2x text-${STATUS_VARIANTS[context.reason] || 'muted'}`} />
            <div className="flex-grow-1">
              <strong>{trans(STATUS_LABELS[context.reason] || 'ai_lesson_unavailable', {}, 'resource')}</strong>
              {aiLesson?.name && (
                <div className="text-muted small">{aiLesson.name}</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

AiLessonInfo.propTypes = {
  context: T.shape({
    allowed: T.bool.isRequired,
    reason: T.string,
    aiLesson: T.shape({
      id: T.number,
      name: T.string,
      expiresAt: T.string,
      usageLimit: T.number,
      usageCount: T.number
    })
  })
}

export {AiLessonInfo}