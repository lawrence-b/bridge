import React, { Component } from 'react';
import './Button.css';

class Button extends Component {

  render() {
    var spanClassName = this.props.positive ? "Button-positive-span" : "Button-negative-span";

    return (
      <button className="Button" onClick={this.props.onClick}>
        <span className={spanClassName} style={this.props.style}>{this.props.text}</span>
      </button>
    );
  }

}

export default Button;
