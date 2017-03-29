/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import React from 'react';

import _ from '../../locale.js';
import {shorten} from '../../utils.js';

import Layout from '../layout.js';
import LegacyLink from '../legacylink.js';
import PropTypes from '../proptypes.js';
import {render_component} from '../render.js';

import {withEntityActions} from '../entities/actions.js';
import {withEntityRow} from '../entities/row.js';

import CloneIcon from '../entities/icons/entitycloneicon.js';
import EditIcon from '../entities/icons/entityediticon.js';
import TrashIcon from '../entities/icons/entitytrashicon.js';

import ExportIcon from '../icons/exporticon.js';

import TableRow from '../table/row.js';
import TableData from '../table/data.js';


const Actions = ({
    entity,
    onEntityDelete,
    onEntityDownload,
    onEntityClone,
    onEditNoteClick,
  }) => {
  return (
    <Layout flex align={['center', 'center']}>
      <TrashIcon
        entity={entity}
        name="note"
        onClick={onEntityDelete}/>
      <EditIcon
        entity={entity}
        name="note"
        onClick={onEditNoteClick}/>
      <CloneIcon
        entity={entity}
        name="note"
        onClick={onEntityClone}/>
      <ExportIcon
        value={entity}
        title={_('Export Note')}
        onClick={onEntityDownload}
      />
    </Layout>
  );
};

Actions.propTypes = {
  entity: React.PropTypes.object,
  onEditNoteClick: React.PropTypes.func,
  onEntityClone: React.PropTypes.func,
  onEntityDelete: React.PropTypes.func,
  onEntityDownload: React.PropTypes.func,
};

const Row = ({entity, links = true, actions, ...props}) => {
  let text = (
    <div>
      {entity.isOrphan() &&
        <div><b>{_('Orphan')}</b></div>
      }
      {shorten(entity.text)}
    </div>
  );
  return (
    <TableRow>
      <TableData>
        {links ?
          <LegacyLink cmd="get_note" note_id={entity.id}>
            {text}
          </LegacyLink> :
          text
        }
      </TableData>
      <TableData>
        {entity.nvt ? entity.nvt.name : ""}
      </TableData>
      <TableData title={entity.hosts}>
        {shorten(entity.hosts)}
      </TableData>
      <TableData title={entity.port}>
        {shorten(entity.port)}
      </TableData>
      <TableData>
        {entity.isActive() ? _('yes') : _('no')}
      </TableData>
      {render_component(actions, {...props, entity})}
    </TableRow>
  );
};

Row.propTypes = {
  actions: PropTypes.componentOrFalse,
  entity: React.PropTypes.object,
  links: React.PropTypes.bool,
};

export default withEntityRow(Row, withEntityActions(Actions));

// vim: set ts=2 sw=2 tw=80: