import React, { Component } from 'react';
import '../css/App.css';

// Renders statistics on right-hand-side of display
// TODO :: This should really be a UI component only
class Statistics extends Component {

  render() {
    if (!this.props.isText)
    {
      return (
        <div className="data-box">
          <div className="stats-title">
            Basic Statistics
          </div>
          <hr/>
          <div className="stats-row">
            <span className="row-item-label">Current Row Number: </span>
            <span className="row-item-value">{this.props.rowId}</span>
          </div>
          <div className="stats-row">
            <span className="row-item-label"># Rows: </span>
            <span className="row-item-value">{this.props.rowCount}</span>
          </div>
          <hr/>
          <div className="stats-row">
            <span className="row-item-label">Statistics For Column: </span>
            <span className="row-item-value">{this.props.colId}</span>
          </div>
          <div className="stats-row">
            <span className="row-item-label">Column Mean Value:</span>
            <span className="row-item-value">{this.props.colMean}</span>
          </div>
          <div className="stats-row">
            <span className="row-item-label">Column Standard Deviation :</span>
            <span className="row-item-value">{this.props.colSd}</span>
          </div>
          <div className="stats-row">
            <span className="row-item-label">Column Sum :</span>
            <span className="row-item-value">{this.props.colSum}</span>
          </div>
        </div>
      )
      }
      else
      {
        return(
            <div className="data-box">
              <div className="stats-title">
                Basic Statistics
              </div>
              <hr/>
              <div className="stats-row">
                <span className="row-item-label">Current Row Number: </span>
                <span className="row-item-value">{this.props.rowId}</span>
              </div>
              <div className="stats-row">
                <span className="row-item-label"># Rows: </span>
                <span className="row-item-value">{this.props.rowCount}</span>
              </div>
            </div>
        )
      }
  }
}

export default Statistics;
