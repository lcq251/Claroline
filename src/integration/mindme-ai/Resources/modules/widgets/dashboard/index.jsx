import React from 'react'
import {useSelector} from 'react-redux'
import {selectors as securitySelectors} from '#/main/app/security'
import {trans} from '#/main/app/intl'
import {declareWidget} from '#/main/core/widget'

const DashboardWidget = () => {
  const currentUser = useSelector(securitySelectors.currentUser)

  const ctaHref = currentUser ? '#/desktop/workspaces' : '/login'
  const ctaLabel = currentUser ? trans('cta_start', {}, 'dashboard') : trans('login_platform', {}, 'dashboard')

  return (
    <div className="mindme-ai-assistant">
      <style dangerouslySetInnerHTML={{__html: `
        .assistant-hero{background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 55%,#3b82f6 100%);color:#fff;padding:30px 28px 38px;text-align:center;border-radius:12px;position:relative;overflow:hidden}
        .assistant-hero:before{content:'';position:absolute;top:-60px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,.08)}
        .assistant-hero:after{content:'';position:absolute;bottom:-70px;left:-30px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.06)}
        .assistant-icon{font-size:42px;margin-bottom:6px;position:relative;z-index:1}
        .assistant-sub{font-size:14px;opacity:.92;margin-bottom:24px;position:relative;z-index:1}
        .assistant-cta{display:inline-block;padding:10px 34px;border-radius:999px;font-size:15px;font-weight:700;text-decoration:none;background:#fff;color:#1e3a8a;box-shadow:0 4px 14px rgba(0,0,0,.18);transition:transform .15s ease,box-shadow .15s ease;position:relative;z-index:1}
        .assistant-cta:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.26);color:#1e3a8a;text-decoration:none}
        .seal-stamp{position:absolute;top:10px;right:14px;width:78px;height:78px;z-index:2;transform:rotate(-8deg);opacity:.95;pointer-events:none;filter:drop-shadow(0 2px 6px rgba(0,0,0,.22))}
        .seal-stamp svg{width:100%;height:100%;display:block}
      `}} />
      <div className="assistant-hero">
        <div className="seal-stamp">
          <svg viewBox="0 0 1140 1140" xmlns="http://www.w3.org/2000/svg" aria-label="谰之轩工作室">
            <circle cx="570" cy="570" r="540" fill="#fdf6ec" stroke="#c0392b" strokeWidth="46"/>
            <circle cx="570" cy="570" r="478" fill="none" stroke="#c0392b" strokeWidth="10"/>
            <text x="785" y="330" fontFamily="'AR PL UKai CN','KaiTi','STKaiti','Noto Serif CJK SC','SimSun',serif" fontSize="252" fontWeight="700" fill="#c0392b" textAnchor="middle">谰</text>
            <text x="785" y="600" fontFamily="'AR PL UKai CN','KaiTi','STKaiti','Noto Serif CJK SC','SimSun',serif" fontSize="252" fontWeight="700" fill="#c0392b" textAnchor="middle">之</text>
            <text x="785" y="870" fontFamily="'AR PL UKai CN','KaiTi','STKaiti','Noto Serif CJK SC','SimSun',serif" fontSize="252" fontWeight="700" fill="#c0392b" textAnchor="middle">轩</text>
            <text x="355" y="330" fontFamily="'AR PL UKai CN','KaiTi','STKaiti','Noto Serif CJK SC','SimSun',serif" fontSize="252" fontWeight="700" fill="#c0392b" textAnchor="middle">工</text>
            <text x="355" y="600" fontFamily="'AR PL UKai CN','KaiTi','STKaiti','Noto Serif CJK SC','SimSun',serif" fontSize="252" fontWeight="700" fill="#c0392b" textAnchor="middle">作</text>
            <text x="355" y="870" fontFamily="'AR PL UKai CN','KaiTi','STKaiti','Noto Serif CJK SC','SimSun',serif" fontSize="252" fontWeight="700" fill="#c0392b" textAnchor="middle">室</text>
          </svg>
        </div>
        <div className="assistant-icon">🤖</div>
        <div className="assistant-sub">{trans('assistant_sub', {}, 'dashboard')}</div>
        <a href={ctaHref} className="assistant-cta">{ctaLabel} →</a>
      </div>
    </div>
  )
}

export const App = () => ({
  component: DashboardWidget
})

export {
  DashboardWidget
}

export default declareWidget(DashboardWidget)
