import React, { Component } from 'react';
import './HomePane.css';

import EditSocietyPanel from './EditSocietyPanel.js';

class HomePane extends Component {

  constructor(props) {
    super(props);

    this.state = {infoBox: null};
  }

  componentWillMount(){
    this.setState({...this.state, infoBox: null});
  }

  render() {
    return (
      <div className="HomePane">
        <div className="HomePane-top-bar">
          <div>
            <label className="HomePane-header">Home</label>
          </div>
        </div>


        <div className="HomePane-welcome-panel">
          <div className="HomePane-sub-panel">
            <label className="HomePane-welcome-text">Welcome to Bridge!</label>
            <div style={{display: 'flex', flexDirection: 'column', marginBottom: 30}}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <label className="HomePane-body-text">You are logged in as: </label>
                <label className="HomePane-body-text" style={{marginLeft: 5, fontWeight: 'bold'}}>{this.props.user.email}</label>
              </div>
              <label className="HomePane-body-text">
                {this.props.hosts.length <= 0
                  ? "You are not the admin of any host."
                  : "You can manage the following hosts:"}
              </label>

              {this.props.hosts.length <= 0 ? <label className="HomePane-body-text">Why not create your own?</label> : null}
            </div>

            {this.props.hosts.map((host) =>
              <div className="HomePane-host-row" key={host.id}>
                <label>{host.name}</label>
              </div>
            )}

            {this.state.infoBox}
          </div>

          <EditSocietyPanel creating={true} onClickName={() => this.showInfoBox()} onCreate={() => this.createdSociety()} user={this.props.user} />
        </div>
      </div>
    );
  }

  showInfoBox() {
    this.setState({...this.state, infoBox:
      <div style={{display: 'flex', flexDirection: 'column', marginTop: 46}}>
        <label style={{fontWeight: 'bold', paddingBottom: 3, borderBottom: '1px solid orange'}}>
          Making a College Society?
        </label>

        <label style={{whiteSpace: 'pre-wrap', marginTop: 20}}>
          Select 'College' as the category, and then choose your college under 'Visible To'.
        </label>

        <label style={{whiteSpace: 'pre-wrap', marginTop: 20}}>
          If you need to make some events open to all members of the university,
          you can do this later when you create those events.
        </label>
      </div>
    });
  }

  createdSociety() {
    console.log("Society created.");
    this.props.refreshHosts();
  }
}

export default HomePane;
