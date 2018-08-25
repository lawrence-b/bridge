import React, { Component } from 'react';
import Ionicon from 'react-ionicons';
import './MainScreen.css';

import EventsPane from './EventsPane.js';
import EditEventScreen from './EditEventScreen.js';
import AccountPane from './AccountPane.js';
import ManageHostPane from './ManageHostPane.js';
import HomePane from './HomePane.js';
import sendRequest from './sendRequest.js';

class MainScreen extends Component {

  constructor(props) {
    super(props);

    this.user = this.props.userData;

    this.hostIndex = 0;
    this.hosts = [];

    //this.state = {currentScreen: <EventsPane host={this.currentHost()} onEdit={(event) => this.editEvent(event)} onCreate={() => this.createEvent()} onDelete={(event) => this.deleteEvent(event)} />};

    this.state = {currentScreen: <HomePane user={this.user} hosts={this.hosts} refreshHosts={() => this.getHosts()} />};

    this.getHosts();
  }

  getHosts() {
    sendRequest({
      address: "users/me/",
      method: "GET",
      authorizationToken: this.user.token,
      successHandler: (result) => {this.hosts = []; result.admin_of.map(soc => this.getHostWithId(soc.id));},
    });
  }

  getHostWithId(id) {
    sendRequest({
      address: "hosts/" + id + "/",
      method: "GET",
      authorizationToken: this.user.token,
      successHandler: (result) => {this.hosts.push(result); this.displayHomePage();},
    });
  }

  currentHost() {
    return this.hosts[this.hostIndex];
  }

  render() {
    return (
      <div className="MainScreen">
        <div className="MainScreen-menu-bar">
          <label className="MainScreen-menu-header">MENU</label>
          <label className="MainScreen-menu-item" onClick={() => this.displayHomePage()}>Home</label>
          {this.hosts.length <= 0
            ? null
            : <label className="MainScreen-menu-item" onClick={() => this.displayEvents()}>Events</label>}
          {this.hosts.length <= 0
            ? null
            : <label className="MainScreen-menu-item" onClick={() => this.displayHostManagementPage()}>Manage</label>}
        </div>

        <div style={{display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
          <div className="MainScreen-top-bar">
            <h1 className="MainScreen-host-title">{this.state.currentScreen.type === HomePane ? "Bridge" : this.currentHost().name}</h1>

            <div className="MainScreen-top-bar-buttons">
              {this.hosts.length <= 0
                ? null
                : <div className="MainScreen-select-div">
                <select className="MainScreen-select-host" onChange={(e) => this.hostChanged(e)}>
                  {this.hosts.map((host, index) => (<option key={index} value={index}>{host.name}</option>))}
                </select>
                <Ionicon icon="md-arrow-dropdown" fontSize="22px" color="#aaa" style={{marginRight: 5}} />
              </div>}

              <button className="MainScreen-account-button" onClick={() => this.displayAccountInfo()}>
                <span className="MainScreen-account-button-span">Account</span>
              </button>
            </div>
          </div>

          <div className="MainScreen-rest">
            {this.state.currentScreen}
          </div>
        </div>
      </div>
    );
  }

  createEvent() {
    this.setState({currentScreen: <EditEventScreen creating={true} user={this.user} host={this.currentHost()} onExit={() => this.refreshEvents()}/>});
  }

  editEvent(event) {
    this.setState({currentScreen: <EditEventScreen creating={false} user={this.user} host={this.currentHost()} event={event} onExit={() => this.refreshEvents()}/>});
  }

  deleteEvent(event) {
    sendRequest({
      address: "events/" + event.id + "/",
      method: "DELETE",
      authorizationToken: this.user.token,
      responseHandlerNoJson: (result) => {this.refreshEvents();},
    });
  }

  displayHomePage() {
    this.setState({currentScreen: <HomePane user={this.user} hosts={this.hosts} refreshHosts={() => this.getHosts()} />});
  }

  displayAccountInfo() {
    this.setState({currentScreen: <AccountPane user={this.user} logOut={() => this.logOut()}/>});
  }

  displayEvents() {
    this.setState({currentScreen: <EventsPane host={this.currentHost()} onEdit={(event) => this.editEvent(event)} onCreate={() => this.createEvent()} onDelete={(event) => this.deleteEvent(event)} />});
  }

  displayHostManagementPage() {
    this.setState({currentScreen: <ManageHostPane host={this.currentHost()} user={this.user} onHostUpdated={() => this.refreshCurrentHost()} onLeftHost={() => this.getHosts()}/>});
  }

  hostChanged(e) {
    this.hostIndex = e.target.value;
    this.displayEvents();
  }

  refreshCurrentHost() {
    sendRequest({
      address: "hosts/" + this.currentHost().id + "/",
      method: "GET",
      authorizationToken: this.user.token,
      successHandler: (result) => {this.hosts[this.hostIndex] = result; this.setState(this.state);},
    });
  }

  refreshEvents() {
    sendRequest({
      address: "hosts/" + this.currentHost().id + "/",
      method: "GET",
      authorizationToken: this.user.token,
      successHandler: (result) => {this.hosts[this.hostIndex] = result; this.displayEvents();},
    });
  }

  logOut() {
    this.props.logOut();
  }
}

export default MainScreen;
