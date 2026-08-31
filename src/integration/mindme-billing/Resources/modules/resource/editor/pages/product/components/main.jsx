/* eslint-disable react/prop-types */
/*
 * 资源配置弹窗「关联产品」编辑页（作为资源的一个维度）。
 *
 * 由核心 ResourceEditor 通过全局 `editorPages` 注册注入，在右侧
 * `app-editor-body` 容器内渲染（与 overview / permissions 等其它菜单页
 * 同级），不触碰右上角关闭按钮（关闭走 Editor.onHide=close）。
 *
 * 组件自持状态（受控 input + fetch），不依赖 Editor 外层 Form：
 *   - 列出当前资源（targetType=resource & targetId=resourceNode.autoId）的产品
 *   - 新建产品（POST   /apiv2/product           code/price/description）
 *   - 编辑产品（PUT    /apiv2/product/{id}      price/description）
 *   - 删除产品（DELETE /apiv2/product/{id}）
 */

import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {EditorPage} from '#/main/app/editor/components/page'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

// 当前资源的数值 DB id（Product.targetId 用整数 find()，非 uuid）
const useResourceTarget = () => {
  const resourceNode = useSelector(resourceSelectors.resourceNode)

  return get(resourceNode, 'autoId')
}

// fetch 工具
const api = async (url, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {'Accept': 'application/json'}
  }

  if (body) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const res = await fetch(url, options)

  if (200 !== res.status && 201 !== res.status && 204 !== res.status) {
    const err = await res.json().catch(() => ({}))
    throw new Error(get(err, 'message', `HTTP ${res.status}`))
  }

  return res.status === 204 ? null : res.json()
}

const ProductInput = ({label, value, onChange, type = 'text'}) =>
  <div className="mb-2">
    <label className="form-label small mb-1">{label}</label>
    <input
      className="form-control form-control-sm"
      type={type}
      value={value}
      step={type === 'number' ? '0.01' : undefined}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>

const ProductEditorPage = () => {
  const targetId = useResourceTarget()

  const [products, setProducts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({code: '', price: '', description: ''})

  const loadProducts = async () => {
    if (!targetId) return

    setLoaded(false)
    try {
      const data = await api(`/apiv2/product?filters[targetType]=resource&filters[targetId]=${targetId}`)
      setProducts(get(data, 'data', []))
    } catch (e) {
      setProducts([])
    }
    setLoaded(true)
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId])

  const updateForm = (name) => (value) => {
    setForm((prev) => ({...prev, [name]: value}))
  }

  const createProduct = async () => {
    if (!targetId || !form.code) return

    await api('/apiv2/product', 'POST', {
      targetType: 'resource',
      targetId: targetId,
      code: form.code,
      price: form.price !== '' ? Number(form.price) : null,
      description: form.description || null
    })
    setForm({code: '', price: '', description: ''})
    setCreating(false)
    loadProducts()
  }

  const saveProduct = async (product) => {
    await api(`/apiv2/product/${product.id}`, 'PUT', {
      price: form.price !== '' ? Number(form.price) : null,
      description: form.description || null
    })
    setEditingId(null)
    setForm({code: '', price: '', description: ''})
    loadProducts()
  }

  const deleteProduct = async (product) => {
    await api(`/apiv2/product/${product.id}`, 'DELETE')
    loadProducts()
  }

  return (
    <EditorPage title={trans('publish_products', {}, 'resource')}>
      {!loaded &&
        <div className="text-center p-4"><span className="fa fa-spinner fa-spin" /></div>
      }

      {loaded && 0 === products.length &&
        <div className="alert alert-info">
          {trans('publish_products_empty', {}, 'resource')}
        </div>
      }

      {loaded && products.map((product) =>
        <div key={product.id} className="card mb-2">
          <div className="card-body d-flex flex-row align-items-start gap-3">
            {editingId === product.id ?
              <div className="flex-grow-1">
                <ProductInput
                  label={trans('product_price', {}, 'resource')}
                  type="number"
                  value={form.price}
                  onChange={updateForm('price')}
                />
                <ProductInput
                  label={trans('product_description', {}, 'resource')}
                  value={form.description}
                  onChange={updateForm('description')}
                />
              </div>
            :
              <div className="flex-grow-1">
                <div className="fw-bold">{product.code}</div>
                <div className="text-muted small">
                  {null !== product.price && '' !== product.price
                    ? `${trans('price', {}, 'resource')}: ${product.price}`
                    : trans('free', {}, 'resource')}
                </div>
                {product.description && <div className="text-muted small">{product.description}</div>}
              </div>
            }

            <div className="d-flex flex-row gap-1">
              {editingId === product.id ?
                <>
                  <button className="btn btn-primary btn-sm" type="button" onClick={() => saveProduct(product)}>
                    {trans('save', {}, 'resource')}
                  </button>
                  <button className="btn btn-secondary btn-sm" type="button" onClick={() => {
                    setEditingId(null)
                    setForm({code: '', price: '', description: ''})
                  }}>
                    {trans('cancel', {}, 'resource')}
                  </button>
                </>
              :
                <>
                  <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => {
                    setEditingId(product.id)
                    setForm({code: product.code, price: product.price, description: product.description})
                  }}>
                    {trans('edit', {}, 'resource')}
                  </button>
                  <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => deleteProduct(product)}>
                    {trans('delete', {}, 'resource')}
                  </button>
                </>
              }
            </div>
          </div>
        </div>
      )}

      {!creating &&
        <button className="btn btn-primary" type="button" onClick={() => setCreating(true)}>
          {trans('publish_product_new', {}, 'resource')}
        </button>
      }

      {creating &&
        <div className="mt-3">
          <ProductInput
            label={trans('product_code', {}, 'resource')}
            value={form.code}
            onChange={updateForm('code')}
          />
          <ProductInput
            label={trans('product_price', {}, 'resource')}
            type="number"
            value={form.price}
            onChange={updateForm('price')}
          />
          <ProductInput
            label={trans('product_description', {}, 'resource')}
            value={form.description}
            onChange={updateForm('description')}
          />

          <div className="d-flex flex-row gap-1">
            <button className="btn btn-primary btn-sm" type="button" onClick={createProduct}>
              {trans('save', {}, 'resource')}
            </button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => setCreating(false)}>
              {trans('cancel', {}, 'resource')}
            </button>
          </div>
        </div>
      }
    </EditorPage>
  )
}

export {
  ProductEditorPage
}