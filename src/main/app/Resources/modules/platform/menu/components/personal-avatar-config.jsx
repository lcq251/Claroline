import React, {useEffect, useState} from 'react'

import {url} from '#/main/app/api/router'

/**
 * Personal digital-teacher configuration panel.
 *
 * Lets the signed-in user personalise their Live2D model / voice / mode and
 * edit their personal knowledge base (the {q, a, kw} entries injected into the
 * brain prompt). Persisted via /apiv2/mindme_aibase/me/avatar and
 * /apiv2/mindme_aibase/me/knowledge (session-authenticated).
 */

const VOICES = [
  ['zh-CN-XiaoxiaoNeural', '晓晓（女声，默认）'],
  ['zh-CN-YunxiNeural', '云希（男声）'],
  ['zh-CN-XiaoyiNeural', '晓伊（女声）'],
  ['zh-CN-YunjianNeural', '云健（男声）'],
]

const MODELS = [
  ['', '默认（Haru）'],
  ['/models/haru/haru_greeter_t03.model3.json', 'Haru'],
]

const MODES = [
  ['assistant', '助手'],
  ['companion', '陪伴'],
]

const PersonalAvatarConfig = () => {
  const [avatar, setAvatar] = useState(null)
  const [knowledge, setKnowledge] = useState([])
  const [saving, setSaving] = useState(false)
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [newSuggestion, setNewSuggestion] = useState('')

  useEffect(() => {
    fetch(url('/apiv2/mindme_aibase/me/avatar'), {credentials: 'include'})
      .then(r => r.json())
      .then(d => setAvatar(d))
      .catch(() => {})

    fetch(url('/apiv2/mindme_aibase/me/knowledge'), {credentials: 'include'})
      .then(r => r.json())
      .then(d => setKnowledge(d.entries || []))
      .catch(() => {})
  }, [])

  const saveAvatar = (patch) => {
    setSaving(true)
    fetch(url('/apiv2/mindme_aibase/me/avatar'), {
      method: 'PUT',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(patch)
    })
      .then(r => r.json())
      .then(d => {
        setAvatar(d)
        setSaving(false)
      })
      .catch(() => setSaving(false))
  }

  const saveKnowledge = (entries) => {
    setSaving(true)
    fetch(url('/apiv2/mindme_aibase/me/knowledge'), {
      method: 'PUT',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({entries})
    })
      .then(r => r.json())
      .then(d => {
        setKnowledge(d.entries || [])
        setSaving(false)
      })
      .catch(() => setSaving(false))
  }

  const addEntry = () => {
    const q = newQ.trim()
    const a = newA.trim()
    if (!q || !a) {
      return
    }
    saveKnowledge([...knowledge, {q, a, kw: ''}])
    setNewQ('')
    setNewA('')
  }

  const removeEntry = (index) => {
    saveKnowledge(knowledge.filter((_, i) => i !== index))
  }

  const addSuggestion = () => {
    const s = newSuggestion.trim()
    if (!s) {
      return
    }
    saveAvatar({suggestions: [...(avatar?.suggestions || []), s]})
    setNewSuggestion('')
  }

  const removeSuggestion = (index) => {
    saveAvatar({suggestions: (avatar?.suggestions || []).filter((_, i) => i !== index)})
  }

  return (
    <div className="personal-avatar-config">
      <h4 className="fs-base mb-2">数字人形象</h4>

      <div className="form-group">
        <label className="form-label fs-sm">模型</label>
        <select
          className="form-select"
          value={avatar?.modelUrl || ''}
          disabled={saving || !avatar}
          onChange={e => saveAvatar({modelUrl: e.target.value})}
        >
          {MODELS.map(([value, label]) => (
            <option key={value || 'default'} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">语音</label>
        <select
          className="form-select"
          value={avatar?.voice || 'zh-CN-XiaoxiaoNeural'}
          disabled={saving || !avatar}
          onChange={e => saveAvatar({voice: e.target.value})}
        >
          {VOICES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">模式</label>
        <select
          className="form-select"
          value={avatar?.mode || 'assistant'}
          disabled={saving || !avatar}
          onChange={e => saveAvatar({mode: e.target.value})}
        >
          {MODES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">取景</label>
        <select
          className="form-select"
          value={avatar?.fit || 'half'}
          disabled={saving || !avatar}
          onChange={e => saveAvatar({fit: e.target.value})}
        >
          <option value="half">半身</option>
          <option value="full">全身</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">缩放</label>
        <select
          className="form-select"
          value={avatar?.zoom || 1}
          disabled={saving || !avatar}
          onChange={e => saveAvatar({zoom: parseInt(e.target.value, 10)})}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">名字</label>
        <input
          type="text"
          className="form-control"
          value={avatar?.name || ''}
          disabled={saving || !avatar}
          onChange={e => setAvatar({...avatar, name: e.target.value})}
          onBlur={e => saveAvatar({name: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">开场白</label>
        <textarea
          className="form-control"
          rows={2}
          value={avatar?.welcome || ''}
          disabled={saving || !avatar}
          onChange={e => setAvatar({...avatar, welcome: e.target.value})}
          onBlur={e => saveAvatar({welcome: e.target.value})}
        />
      </div>

      <div className="form-group">
        <label className="form-label fs-sm">兜底话</label>
        <textarea
          className="form-control"
          rows={2}
          value={avatar?.fallback || ''}
          disabled={saving || !avatar}
          onChange={e => setAvatar({...avatar, fallback: e.target.value})}
          onBlur={e => saveAvatar({fallback: e.target.value})}
        />
      </div>

      <h4 className="fs-base mb-2 mt-3">预设问题</h4>
      {(avatar?.suggestions || []).map((s, index) => (
        <div key={index} className="d-flex justify-content-between align-items-center border rounded p-2 mb-1">
          <span className="fs-sm">{s}</span>
          <button
            type="button"
            className="btn btn-sm btn-link text-danger"
            disabled={saving}
            onClick={() => removeSuggestion(index)}
          >
            ✕
          </button>
        </div>
      ))}
      <div className="d-flex gap-1 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="新问题"
          value={newSuggestion}
          onChange={e => setNewSuggestion(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-sm btn-primary"
          disabled={saving || !newSuggestion.trim()}
          onClick={addSuggestion}
        >
          添加
        </button>
      </div>

      <h4 className="fs-base mb-2 mt-3">个人知识库</h4>
      <p className="fs-sm text-muted mb-2">数字人回答时会优先参考你的知识库内容。</p>

      {knowledge.map((entry, index) => (
        <div key={index} className="border rounded p-2 mb-2">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-fill">
              <div className="fw-bold fs-sm">问：{entry.q}</div>
              <div className="fs-sm text-muted">答：{entry.a}</div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link text-danger"
              disabled={saving}
              onClick={() => removeEntry(index)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="border-top pt-2">
        <input
          type="text"
          className="form-control mb-1"
          placeholder="问题（如：这个平台怎么用？）"
          value={newQ}
          onChange={e => setNewQ(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-1"
          placeholder="答案"
          value={newA}
          onChange={e => setNewA(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-sm btn-primary"
          disabled={saving || !newQ.trim() || !newA.trim()}
          onClick={addEntry}
        >
          添加知识
        </button>
      </div>
    </div>
  )
}

export {
  PersonalAvatarConfig
}
