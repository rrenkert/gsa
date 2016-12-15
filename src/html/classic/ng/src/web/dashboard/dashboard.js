/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 Greenbone Networks GmbH
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

import {is_defined} from '../../utils.js';

import './css/dashboard.css';

export class Dashboard extends React.Component {

  constructor(props) {
    super(props);

    let {id} = this.props;

    if (!is_defined(id)) {
      id = "dashboard";
    }

    let dashboard = new window.gsa.charts.Dashboard(id, undefined, {
      config_pref_id: this.props['config-pref-id'],
      default_heights_string: '280',
      default_controllers_string: this.props['default-controllers-string'],
      default_controller_string: this.props['default-controller-string'],
      hide_filter_select: this.props['hide-filter-select'],
      dashboard_controls: '#dashboard-controls',
    });

    this.state = {
      dashboard,
      initialized: false,
      id,
    };
  }

  getChildContext() {
    return {
      dashboard: this.state.dashboard,
    };
  }

  componentDidMount() {
    let {gmp} = this.context;
    let {dashboard} = this.state;
    let pref_id = this.props['config-pref-id'];

    gmp.user.currentChartPreferences().then(prefs => {
      dashboard.setConfig(prefs.get(pref_id));

      dashboard.init();
      dashboard.initDisplays();

      this.setState({initialized: true});
    });
  }

  render() {
    let {id} = this.state;
    return (
      <div className="dashboard">
        <div id={id}></div>
        {this.props.children}
      </div>
    );
  }
}

Dashboard.childContextTypes = {
  dashboard: React.PropTypes.object,
};

Dashboard.propTypes = {
  id: React.PropTypes.string,
  filter: React.PropTypes.object,
  'config-pref-id': React.PropTypes.string,
  'hide-filter-select': React.PropTypes.bool,
  'default-controller-string': React.PropTypes.string,
  'default-controllers-string': React.PropTypes.string,
};

Dashboard.defaultProps = {
  id: 'dashboard',
};

Dashboard.contextTypes = {
  gmp: React.PropTypes.object.isRequired,
};

export const DashboardControls = props => {
  return <div id="dashboard-controls" className="dashboard-controls"></div>;
};

export default Dashboard;

// vim: set ts=2 sw=2 tw=80: