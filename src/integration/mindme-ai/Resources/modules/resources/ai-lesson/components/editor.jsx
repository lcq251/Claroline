import React, {useState, useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import get from 'lodash/get'

import {url} from '#/main/app/api'
import {trans} from '#/main/app/intl/translation'
import {actions, ResourceEditor, ResourceEditorOverview} from '#/main/core/resource/editor'
import {selectors as resourceSelectors} from '#/main/core/resource'

// ── 常量 ──────────────────────────────────────────
const SUBJECTS = [
  {value: 'english',  label: '英语 🇬🇧'}, {value: 'math',     label: '数学 📐'},
  {value: 'chinese',  label: '语文 📜'}, {value: 'physics',   label: '物理 ⚛️'},
  {value: 'chemistry',label: '化学 🧪'}, {value: 'biology',   label: '生物 🧬'},
  {value: 'history',  label: '历史 📜'}, {value: 'geography', label: '地理 🌍'},
  {value: 'politics', label: '政治 ⚖️'},
]

const GRADES = [
  {value: 'elementary', label: '小学'},
  {value: 'middle',     label: '初中'},
  {value: 'high',       label: '高中'},
]

const DIFFICULTIES = [
  {value: 'story',       label: '故事导入版（低基础）'},
  {value: 'standard',    label: '标准刷题版（中等生）'},
  {value: 'competition', label: '竞赛拔高版（优等生）'},
]

const MODULES = [
  {value: 'lesson_plan',  label: '📘 实操讲义教案',   desc: '结构化教案，可直接上课'},
  {value: 'quiz_homework',label: '📝 随堂测试与作业', desc: '基础巩固 + 拓展拔高'},
  {value: 'custom_exam',  label: '🏆 弹性定制试卷',   desc: '纯刷题模式，精准生成'},
]

// ── Editor Overview ──────────────────────────────
const AiLessonEditorOverview = () => {
  const dispatch = useDispatch()
  const resource = useSelector(resourceSelectors.resource)
  const [generating, setGenerating] = useState(false)
  const [params, setParams] = useState(get(resource, 'generationParams') || {
    subject: 'math',
    grade: 'middle',
    difficulty: 'standard',
    module: 'lesson_plan',
    topic: '',
  })
  const [generatedContent, setGeneratedContent] = useState(get(resource, 'content') || null)

  const updateParam = useCallback((key, value) => {
    setParams(prev => ({...prev, [key]: value}))
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!params.topic.trim()) return
    setGenerating(true)

    try {
      const resp = await fetch(url(['apiv2_mindme_ai_generate']), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          topic: params.topic,
          subject: params.subject,
          grade: params.grade,
          difficulty: params.difficulty,
          module: params.module,
        }),
      })

      if (!resp.ok) throw new Error('Generate failed')

      const content = await resp.json()
      setGeneratedContent(content)
      dispatch(actions.updateResource(content, 'content'))
      dispatch(actions.updateResource(params, 'generationParams'))
      dispatch(actions.updateResourceNode(params.topic, 'name'))
    } catch (e) {
      console.error('AI generate error:', e)
    } finally {
      setGenerating(false)
    }
  }, [params, dispatch])

  return (
    <ResourceEditorOverview
      definition={[
        {
          title: trans('generation_params', {}, 'resource'),
          primary: true,
          hideTitle: true,
          fields: [
            {
              name: 'module',
              label: trans('module', {}, 'resource'),
              type: 'choice',
              required: true,
              options: {
                choices: MODULES.reduce((acc, m) => {
                  acc[m.value] = m.label; return acc
                }, {}),
                multiple: false,
                condensed: false,
              },
              value: params.module,
              onChange: (v) => updateParam('module', v),
            },
            {
              name: 'subject',
              label: trans('subject', {}, 'resource'),
              type: 'choice',
              required: true,
              options: {
                choices: SUBJECTS.reduce((acc, s) => {
                  acc[s.value] = s.label; return acc
                }, {}),
                multiple: false,
              },
              value: params.subject,
              onChange: (v) => updateParam('subject', v),
            },
            {
              name: 'grade',
              label: trans('grade', {}, 'resource'),
              type: 'choice',
              required: true,
              options: {
                choices: GRADES.reduce((acc, g) => {
                  acc[g.value] = g.label; return acc
                }, {}),
                multiple: false,
              },
              value: params.grade,
              onChange: (v) => updateParam('grade', v),
            },
            {
              name: 'difficulty',
              label: trans('difficulty', {}, 'resource'),
              type: 'choice',
              required: true,
              options: {
                choices: DIFFICULTIES.reduce((acc, d) => {
                  acc[d.value] = d.label; return acc
                }, {}),
                multiple: false,
              },
              value: params.difficulty,
              onChange: (v) => updateParam('difficulty', v),
            },
            {
              name: 'topic',
              label: trans('topic', {}, 'resource'),
              type: 'string',
              required: true,
              options: {
                placeholder: trans('topic_placeholder', {}, 'resource'),
              },
              value: params.topic,
              onChange: (v) => updateParam('topic', v),
            },
          ],
        },
        generatedContent ? {
          title: trans('generated_content', {}, 'resource'),
          fields: [
            {
              name: 'preview',
              label: trans('preview', {}, 'resource'),
              type: 'html',
              options: {
                html: (() => {
                  if (!generatedContent) return '<p>未生成内容</p>'
                  const c = generatedContent
                  let html = `<h3>📘 ${c.title || params.topic}</h3>`
                  if (c.sections) {
                    c.sections.forEach(s => {
                      html += `<h4>${s.emoji} ${s.title}</h4><div>${s.body}</div>`
                    })
                  }
                  if (c.rawMarkdown) {
                    html += `<hr/><div style="white-space:pre-wrap">${c.rawMarkdown}</div>`
                  }
                  return html
                })(),
              },
            },
          ],
        } : null,
      ].filter(Boolean)}
    >
      <div style={{marginTop: 16, display: 'flex', gap: 12, alignItems: 'center'}}>
        <button
          className="btn btn-primary"
          disabled={generating || !params.topic.trim()}
          onClick={handleGenerate}
        >
          {generating ? '⏳ AI 生成中...' : '🤖 AI 生成教案'}
        </button>
        {generatedContent && (
          <span style={{color: '#16a34a', fontWeight: 600}}>✅ 已生成</span>
        )}
      </div>
    </ResourceEditorOverview>
  )
}

const AiLessonEditor = () =>
  <ResourceEditor
    overviewPage={AiLessonEditorOverview}
  />

export {
  AiLessonEditor
}
