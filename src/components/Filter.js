import React, { Component } from 'react';
import '../css/App.css';
import Select from 'react-select';
import { DebounceInput } from 'react-debounce-input';
import { connect } from 'react-redux';
import { addToActiveFilters,setActiveFilter,sendToFilter } from '../actions/filterActions';

// Filter class sends filter data to App.js, which transforms the csv Object
// and sends it back to components/components/CSV.js
class Filter extends Component {

  /*

    Filter Handlers

  */

  handleSendToFilter = this.props.debounce((filter,e) =>
  {
    e.persist();
    const data = {
      filter:filter,
      e:e
    }
    this.props.sendToFilter(data);
    let filter_text = e.target.value;

    // Invokes App.js filter method
    this.props.performFilter(filter_text,filter.filter);

  }, 500)

  handleAddToActiveFilter = (selectedOption) => {
    this.props.addToActiveFilters(selectedOption);
  }

  handleSetActiveFilter = (name) => {
    this.props.setActiveFilter(name);
  }

  render() {
    const activeFilterList = Object.entries(this.props.filterState.filters).map((item,index) => {
        return (
          <div className="active-filter">
            <div>{item[1].filter}</div>
            <DebounceInput className="form-control" onChange={(e) => this.handleSendToFilter(item[1],e)}
            value={item[1].filterVal} type="text"   />
          </div>
        )
    })

    // Populates list of columns from which filters can be selected
    let col_list = Object.keys(this.props.csvData[0]).filter(item => item !== "").filter(
      item => item !== this.props.invisibleProp
    )

    // Adds filter objects to list
    const filterList = col_list.map((filter,index) => {
        return { value: filter, label: filter.toUpperCase() }
    })

    // Reset text to add another filter
    return (
      <div className="filter-cont">
        <div className="filter-search">
          <div className="filter-title">Filter CSV Results</div>
          <Select className="filter-select-box"
            placeholder="Search For CSV Filters"
            value={this.props.filterState.selectedOption}
            onChange={this.handleAddToActiveFilter}
            options={filterList}
          />
        </div>
        <div className="active-filters-cont">{activeFilterList}</div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    filterState: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToActiveFilters: (selectedOption) => {
      dispatch(addToActiveFilters(selectedOption));
    },
    setActiveFilter: (name) => {
      dispatch(setActiveFilter(name));
    },
    sendToFilter: (data) => {
      dispatch(sendToFilter(data))
    }
  }

}

// Attaches generated props from redux store to CSV props
export default connect(mapStateToProps,mapDispatchToProps)(Filter);
