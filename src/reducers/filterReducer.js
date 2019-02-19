const initFilterState = {
  selectedOption: null,
  currentFilter: null,
  filters: []
}

const filterReducer = (filterState = initFilterState,action) => {

  // Add a new filter
  if (action.type === "ADD_TO_ACTIVE_FILTERS") {

    if ((initFilterState.filters.find(obj => obj.filter === action.selectedOption.value)) === undefined)
    {

      var joined = filterState.filters.concat({ filter: action.selectedOption.value, filterVal: ""});

      return {
       ...filterState,
       filters: joined
      }

    }
    else {
      // TODO :: Remove the barbaric alert and replace with something nice
      alert("You've already added this filter")
    }
  }

  // Sets current filter being used
  if (action.type === "SET_ACTIVE_FILTER") {

    return {
     ...filterState,
     currentFilter: action.name
    }

  }


  // Sets current filter being used
  if (action.type === "SET_ACTIVE_FILTER") {

    return {
     ...filterState,
     currentFilter: action.name
    }

  }


  // Sets current filter being used
  if (action.type === "SEND_TO_FILTER") {

    // Index to update
    // map(e => e.filter)
    var index = (filterState.filters).indexOf(action.data.filter);
    var filter_text= action.data.e.target.value;
    let fs = filterState.filters;
    fs[index].filterVal = filter_text;

    return {
     ...filterState,
     filters: fs
    }

  }

  return filterState;

}

export default filterReducer;
