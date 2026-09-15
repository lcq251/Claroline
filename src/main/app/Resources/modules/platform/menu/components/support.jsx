import React, {useId, useState} from 'react'
import {PropTypes as T} from 'prop-types'
import {useSelector} from 'react-redux'
import CloseButton from 'react-bootstrap/CloseButton'

import {trans} from '#/main/app/intl'
import {Button} from '#/main/app/action'
import {MENU_BUTTON} from '#/main/app/buttons'
import {Menu} from '#/main/app/overlays/menu'

import {selectors} from '#/main/app/platform/store'
import {AvatarWidgetFrame} from '#/integration/mindme-aibase/resources/aiteacher/components/avatar-widget-frame'
import {PersonalAvatarConfig} from '#/main/app/platform/menu/components/personal-avatar-config'

/**
 * Left app menu "human support" entry — embeds the global support avatar
 * (an Aiteacher resource configured via platform parameter
 * `mindme_aibase.support_teacher_uuid`), gated by `mindme_aibase.support_enabled`.
 */
const SupportMenu = (props) => {
  const teacherUuid = useSelector(selectors.supportTeacherUuid)
  const [tab, setTab] = useState('avatar')

  return (
    <Menu id={props.id} className="app-user-menu app-support-menu flyout-menu p-0 position-fixed">
      <div className="flyout-menu-content d-flex flex-column flex-fill p-3" role="presentation">
        <div className="flyout-menu-close fs-sm rounded-pill bg-body position-absolute end-0 top-0" role="presentation">
          <CloseButton onClick={props.closeMenu} className="rounded-pill" aria-label={trans('close', {}, 'actions')} />
        </div>

        <h2 className="h5 mb-2">{trans('support_title', {}, 'platform')}</h2>

        <div className="btn-group btn-group-sm mb-2" role="tablist">
          <button
            type="button"
            className={`btn btn-outline-primary ${tab === 'avatar' ? 'active' : ''}`}
            onClick={() => setTab('avatar')}
          >
            数字人
          </button>
          <button
            type="button"
            className={`btn btn-outline-primary ${tab === 'config' ? 'active' : ''}`}
            onClick={() => setTab('config')}
          >
            我的配置
          </button>
        </div>

        <div className="flex-fill">
          {tab === 'avatar'
            ? <AvatarWidgetFrame uuid={teacherUuid} height={420} />
            : <PersonalAvatarConfig />}
        </div>
      </div>
    </Menu>
  )
}

SupportMenu.propTypes = {
  id: T.string.isRequired,
  closeMenu: T.func.isRequired
}

const PlatformMenuSupport = (props) => {
  const menuId = useId()
  const [menuOpened, setMenuOpened] = useState(false)

  const enabled = useSelector(selectors.supportEnabled)
  const teacherUuid = useSelector(selectors.supportTeacherUuid)

  if (!enabled || !teacherUuid) {
    return null
  }

  return (
    <div role="contentinfo">
      <Button
        type={MENU_BUTTON}
        icon="fa fa-headset"
        label={trans('support', {}, 'platform')}
        tooltip={props.vertical ? 'right' : 'top'}
        className="app-context-btn focus-ring rounded-circle"
        opened={menuOpened}
        onToggle={setMenuOpened}
        menu={{
          drop: 'up',
          align: 'end',
          render: () => (
            <SupportMenu
              id={menuId}
              closeMenu={() => setMenuOpened(false)}
            />
          )
        }}
        aria-controls={menuId}
      />
    </div>
  )
}

PlatformMenuSupport.propTypes = {
  vertical: T.bool
}

export {
  PlatformMenuSupport
}
