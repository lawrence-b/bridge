import React, { Component } from 'react';
import './EventsPane.css';

import EventTile from './EventTile.js';
import Button from './Button.js';

class EventsPane extends Component {

  constructor(props) {
    super(props);
    this.state = {events: this.props.host.events_hosting_in_future};
  }

  componentWillMount() {
    this.getEvents(true);
  }

  renderTiles() {
    return this.state.events.map(event =>
      <EventTile event={event}
        key={event.id}
        onEdit={(e) => this.props.onEdit(e)}
        onDelete={(e) => this.props.onDelete(e)} />);
  }

  render() {
    this.getEvents(false);

    return (
      <div className="EventsPane">
        <div className="EventsPane-top-bar">
          <div>
            <label className="EventsPane-header">Events</label>
            <label className="EventsPane-events-number">{this.state.events.length} events</label>
          </div>

          <Button positive={true} text="Create" style={{
            marginTop: 0,
            marginBottom: 0,
            marginRight: 115,
            width: 56
          }} onClick={() => this.props.onCreate()}/>
        </div>

        <div className="EventsPane-events-list">
          {this.renderTiles()}
        </div>

      </div>
    );
  }

  getEvents(shouldRefresh) {
    /*
    if (this.props.host.id === 2) {
      this.state = {events: [
        {
          id: 1,
          name: "Annual AGM",
          location: "Old Court",
          time: "12pm, 19th June",
          description: "Come along to our annual AGM! We'll be selecting captains for the teams next year."
        },
        {
          id: 2,
          name: "Emma IIIs vs Clare IIs",
          location: "Clare pitches",
          time: "2pm, 16th Oct",
          description: "Match against Clare IIs"
        },
        {
          id: 3,
          name: "Emma IIIs vs Queens IIIs",
          location: "Wilberforce road",
          time: "2:30pm, 21st Oct",
          description: "Match against Queens IIIs"
        },
        {
          id: 4,
          name: "Emma Is vs Clare Is",
          location: "Clare pitches",
          time: "1:30pm, 16th Oct",
          description: "Match against Clare Is"
        },
        {
          id: 5,
          name: "Annual AGM",
          location: "Old Court",
          time: "12pm, 19th June",
          description: "Come along to our annual AGM! We'll be selecting captains for the teams next year."
        },
        {
          id: 6,
          name: "Emma IIIs vs Clare IIs",
          location: "Clare pitches",
          time: "2pm, 16th Oct",
          description: "Match against Clare IIs"
        },
        {
          id: 7,
          name: "Emma IIIs vs Queens IIIs",
          location: "Wilberforce road",
          time: "2:30pm, 21st Oct",
          description: "Match against Queens IIIs"
        },
        {
          id: 8,
          name: "Emma Is vs Clare Is",
          location: "Clare pitches",
          time: "1:30pm, 16th Oct",
          description: "Match against Clare Is"
        }
      ]};
    }
    else {
      this.state = {events: [
        {
          id: 1,
          name: "Event 1",
          location: "Old Court",
          time: "12pm, 19th June",
          description: "Come along to our annual AGM! We'll be selecting captains for the teams next year."
        },
        {
          id: 2,
          name: "Event 2",
          location: "Clare pitches",
          time: "2pm, 16th Oct",
          description: "Match against Clare IIs"
        }
      ]};
    }*/

    this.state = {events: this.props.host.events_hosting_in_future};

    if (shouldRefresh) {
      this.setState(this.state);
    }
  }
}

export default EventsPane;
