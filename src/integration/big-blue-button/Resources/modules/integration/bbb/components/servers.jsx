import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Table, TableHeader, TableRow, TableHeaderCell, TableCell} from '#/main/app/content/components/table'

const BBBServers = (props) =>
  <Table className="table-hover">
    <TableHeader>
      <TableHeaderCell>{trans('status')}</TableHeaderCell>
      <TableHeaderCell>{trans('name')}</TableHeaderCell>
      <TableHeaderCell>{trans('participants')}</TableHeaderCell>
    </TableHeader>

    <tbody>
      {props.servers.map((server, i) =>
        <TableRow key={i}>
          <TableCell>
            {server.disabled &&
              <span className="badge text-bg-danger">{trans('disabled')}</span>
            }

            {!server.disabled && server.limit && server.participants >= server.limit &&
              <span className="badge text-bg-warning">{trans('full')}</span>
            }

            {!server.disabled && (!server.limit || server.participants < server.limit) &&
              <span className="badge text-bg-success">{trans('available')}</span>
            }
          </TableCell>
          <TableCell>{server.url}</TableCell>
          <TableCell align="right">{server.participants + (server.limit ? ' / ' + server.limit : '')}</TableCell>
        </TableRow>
      )}
    </tbody>
  </Table>

BBBServers.propTypes = {
  servers: T.arrayOf(T.shape({
    url: T.string.isRequired,
    participants: T.number,
    limit: T.number,
    disabled: T.bool
  }))
}

export {
  BBBServers
}
