import React from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl'
import {PageContent, PageSection, PageSimple} from '#/main/app/page'
import {ResourcePage, selectors as resourceSelectors} from '#/main/core/resource'

const SUBJECT_LABELS = {english:'英语',math:'数学',chinese:'语文',physics:'物理',chemistry:'化学',biology:'生物',history:'历史',geography:'地理',politics:'政治'}
const GRADE_LABELS = {elementary:'小学',middle:'初中',high:'高中'}
const DIFFICULTY_LABELS = {story:'故事导入版',standard:'标准版',competition:'竞赛拔高版'}

const AiLessonPlayer = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)
  const resource = useSelector(resourceSelectors.resource)
  const content = get(resource, 'content')
  const params = get(resource, 'generationParams')

  if (!content) {
    return (
      <ResourcePage>
        <PageSimple>
          <PageContent>
            <PageSection>
              <div className="text-center py-5 text-muted">
                <span className="fa fa-robot" style={{fontSize: 48}} />
                <h3 className="mt-3">教案尚未生成</h3>
                <p>请编辑此资源，设置参数后点击"AI 生成教案"</p>
              </div>
            </PageSection>
          </PageContent>
        </PageSimple>
      </ResourcePage>
    )
  }

  return (
    <ResourcePage>
      <PageSimple>
        <PageContent>
          {/* 参数标签 */}
          {params && (
            <PageSection size="sm">
              <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16}}>
                <span className="badge bg-info">{SUBJECT_LABELS[params.subject] || params.subject}</span>
                <span className="badge bg-secondary">{GRADE_LABELS[params.grade] || params.grade}</span>
                <span className="badge bg-warning text-dark">{DIFFICULTY_LABELS[params.difficulty] || params.difficulty}</span>
              </div>
            </PageSection>
          )}

          {/* 标题 */}
          <PageSection size="sm">
            <h2>{content.title || resourceNode.name}</h2>
          </PageSection>

          {/* 教学目标 */}
          {content.coreObjectives && (
            <PageSection size="sm" title={trans('core_objectives', {}, 'resource')}>
              {content.coreObjectives.keyPoints && (
                <div className="mb-3">
                  <strong>重点：</strong>{content.coreObjectives.keyPoints}
                </div>
              )}
              {content.coreObjectives.difficultPoints && (
                <div className="mb-3">
                  <strong>难点：</strong>{content.coreObjectives.difficultPoints}
                </div>
              )}
              {content.coreObjectives.vocabulary && content.coreObjectives.vocabulary.length > 0 && (
                <div>
                  <strong>词汇：</strong>
                  <ul>
                    {content.coreObjectives.vocabulary.map((v,i) => (
                      <li key={i}>{v.word} — {v.meaning}</li>
                    ))}
                  </ul>
                </div>
              )}
              {content.coreObjectives.keyStructures && content.coreObjectives.keyStructures.length > 0 && (
                <div>
                  <strong>句型：</strong>
                  <ul>
                    {content.coreObjectives.keyStructures.map((s,i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </PageSection>
          )}

          {/* 讲义章节 */}
          {content.sections && content.sections.length > 0 && content.sections.map((section, i) => (
            <PageSection key={i} size="sm" title={`${section.emoji || ''} ${section.title}`}>
              <div dangerouslySetInnerHTML={{__html: section.body}} />
            </PageSection>
          ))}

          {/* 练习题 */}
          {content.exercises && (
            <PageSection size="sm" title={trans('exercises', {}, 'resource')}>
              <div dangerouslySetInnerHTML={{__html: content.exercises}} />
            </PageSection>
          )}

          {/* 答案 */}
          {content.answerKey && content.answerKey.content && (
            <PageSection size="sm" title={trans('answer_key', {}, 'resource')}>
              <div dangerouslySetInnerHTML={{__html: content.answerKey.content}} />
            </PageSection>
          )}

          {/* 分层作业 */}
          {content.layeredHomework && (
            <PageSection size="sm" title={trans('layered_homework', {}, 'resource')}>
              {content.layeredHomework.basic && (
                <div className="mb-3">
                  <h5>🟢 基础巩固</h5>
                  <div dangerouslySetInnerHTML={{__html: content.layeredHomework.basic}} />
                </div>
              )}
              {content.layeredHomework.advanced && (
                <div>
                  <h5>🔴 拓展拔高</h5>
                  <div dangerouslySetInnerHTML={{__html: content.layeredHomework.advanced}} />
                </div>
              )}
            </PageSection>
          )}
        </PageContent>
      </PageSimple>
    </ResourcePage>
  )
}

export {
  AiLessonPlayer
}
