import React from 'react'

const DashboardPage = (props) =>
  <div className="app-dashboard-page flex-fill mt-4 d-flex flex-column align-items-stretch">
    {props.children}
  </div>

export {
  DashboardPage
}
