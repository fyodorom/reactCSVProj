export const doSomething = (data) => {
  return {
    type: 'DO_SOMETHING',
    data: data
  }
}

export const addToActiveFilters = (selectedOption) => {
  return {
    type: 'ADD_TO_ACTIVE_FILTERS',
    selectedOption: selectedOption
  }
}

export const setActiveFilter = (name) => {
  return {
    type: 'SET_ACTIVE_FILTER',
    name: name
  }
}

export const sendToFilter = (data) => {
  return {
    type: 'SEND_TO_FILTER',
    data: data
  }
}
