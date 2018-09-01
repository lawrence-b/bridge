import React, { Component } from 'react';
import './EventTile.css';

import Button from './Button.js';

class EventTile extends Component {

  render() {
    console.log(this.props.event);
    return (
      <div className="EventTile">
        <span className="EventTile-span">
          <img src={this.props.event.image} width={50} height={50} style={{marginRight: 24}} />

          <label className="EventTile-title">{this.props.event.title}</label>

          <div className="EventTile-rhs">
            <div className="EventTile-info-div">
              <label className="EventTile-label-text">Location</label>
              <label className="EventTile-info-text">{this.props.event.location === "" ? "[None]" : this.props.event.location}</label>
            </div>

            <div className="EventTile-info-div">
              <label className="EventTile-label-text">Time</label>
              <label className="EventTile-info-text">{this.getFormattedTime(this.props.event.start_time)}</label>
            </div>

            <Button positive={true} text="Edit" onClick={() => this.props.onEdit(this.props.event)} style={{width: 56}} />
            <Button positive={true} text="Delete" onClick={() => this.props.onDelete(this.props.event)}
              style={{width: 56, marginRight: 0, backgroundColor: '#d44', borderColor: '#b22'}} />
          </div>
        </span>
      </div>
    );
  }

  getFormattedTime(timeString) {
    var time = new Date(timeString);

    var paddingZero1 = time.getHours()   < 10 ? "0" : "";
    var paddingZero2 = time.getMinutes() < 10 ? "0" : "";
    var paddingZero3 = time.getDate() < 10 ? "0" : "";
    var paddingZero4 = (time.getMonth()+1) < 10 ? "0" : "";

    return paddingZero1 + time.getHours() + ":" + paddingZero2 + time.getMinutes()
      + " " + paddingZero3 + time.getDate() + "/" + paddingZero4 + (time.getMonth()+1) + "/" + time.getFullYear();
  }
}

export default EventTile;
