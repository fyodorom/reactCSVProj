import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
import Uploader from './components/Uploader';
import Loader from './components/Loader';
import CSV from './components/CSV';
import Filter from './components/Filter';
import levenshtein from 'js-levenshtein';
import Statistics from './components/Statistics';
import cloneDeep from 'lodash/cloneDeep';
// eslint-disable-next-line import/no-webpack-loader-syntax
import worker from './workers/worker.js';
import WebWorker from './workers/workerSetup';

/*
*  Populates root node and passes data down to Filter,Statistics, and CSV
*/
class App extends Component {

  constructor() {
    super()

    // Initialize state and load a maximum of 100 elements before scroll for speedy rendering
    this.state = {
	  valuz: 0,
	  statsWorker: null,
      fileName: "",
      csvData: null,
      inProgress: 0,
      tableIsLoading: 0,
      lastIndexLoaded: 500,
      recordsToLoad: 500,
      scrollContName: "csv-frame",
      activeFilters: [],
      keysSortedDown: {},
      invisibleProp: "d_fs23dR_Rt791",
      fuzzyMatchingOn: false,
      colId: null,
      rowId: null,
      rowCount: null,
      colSum: null,
      colMean: null,
      colSd: null,
      isText: true
    }
  }

  fetchStatsWorker = () => {
	  	let w = new WebWorker(worker);

		// Modify State Based on Worker Output
		w.addEventListener('message', event => {

			this.processStatsWorkerData(event.data);

		});

		// Set statsWorker property if not already set
		if (!this.state.statsWorker)
		{
			this.setState({
				statsWorker: w
			})
		}
  	}

  	componentDidMount = () => {

		this.fetchStatsWorker()

  	}

  // Add column key to array of filters for a given row
  addToFilter = (item,key) =>
  {
    item[this.state.invisibleProp].push(key);
  }

  // Remove column key from array of filters for a given row
  removeFromFilter = (item,key) =>
  {
    item[this.state.invisibleProp] = item[this.state.invisibleProp].filter(elem => elem !== key);
  }

  // Finds exact text and removes property from filter list for a given row
  // or adds row to list of items being filtered out
  exactMatch = (item,filter_text,key) =>
  {
    if (filter_text === "")
    {
      this.removeFromFilter(item,key);
    }
    else if (item[key] && (!item[key].toLowerCase().includes(filter_text.toLowerCase())))
    {
        this.addToFilter(item,key);
    }
    else
    {
        this.removeFromFilter(item,key);
    }
  }

  // Finds all values greater than or equal to a given value
  numericMatch = (item,filter_text,key) =>
  {
    if (filter_text === "")
    {
      this.removeFromFilter(item,key);
    }
    else if (Number(item[key]) < Number(filter_text))
    {
        this.addToFilter(item,key);
    }
    else
    {
        this.removeFromFilter(item,key);
    }
  }

  // String similarity measure for fuzzy matching
  isLevenshteinMatch = (item,filter_text,key) =>
  {
      const dist = levenshtein(item[key].toLowerCase(),filter_text.toLowerCase())
      return !((dist/(item[key].toLowerCase()).length) <= 0.6)
  }

  // Invokes string similarity measure
  fuzzyMatch = (item,filter_text,key) =>
  {
    if (filter_text === "")
    {
      this.removeFromFilter(item,key);
    }
    else if (this.isLevenshteinMatch(item,filter_text,key) && !(/^ *$/.test(filter_text)))
    {
        this.addToFilter(item,key);
    }
    else
    {
        this.removeFromFilter(item,key);
    }
  }

  filterMethod = (filter_text,key) => {
      // Filter out the bad stuff
      let filtered_data = this.state.csvData;
      filtered_data.forEach((item) => {
        // Ignore first row
        if (item[""] !== 0)
        {
          if (!isNaN(item[key]))
          {
            this.numericMatch(item,filter_text,key)
          }
          else if (!this.state.fuzzyMatchingOn)
          {
            this.exactMatch(item,filter_text,key)
          }
          else
          {
            this.fuzzyMatch(item,filter_text,key)
          }
        }
      })
	  return filtered_data;
  }

  // Main filter method
  performFilter = (filter_text,key) => {

    this.showLoader();

    this.setState({
      csvData: this.filterMethod(filter_text,key)
    });

    this.hideLoader();
  }

  // Shows loader while waiting for re-render
  showLoader = () =>
  {
      this.setState({
        tableIsLoading: 1
      });
  }

  // Hides loader once render has completed
  hideLoader = () =>
  {
    setTimeout(() => {
      this.setState({
        tableIsLoading: 0
      });
    }, 10);
  }

  // Sorts both text and numerical columns
  alphanumericSort = (column_key,a,b) =>
  {

    // Ignore comparisons with header row
    if (a[""] === 0 || b[""] === 0)
    {
      return 0;
    }

    // Extract value being compared
    var val_a = a[column_key];
    var val_b = b[column_key];

    // Give lower sort priority to empty values
    if (val_a === "" || val_b === "")
    {
      if (val_a === "" && val_b !== "")
      {
        return -1;
      }
      else if (val_b === "" && val_a !== "")
      {
        return 1;
      }
      else
      {
        return 0;
      }
    }

    // If both of extracted values are numbers, convert string to number
    if (!(isNaN(val_b) || isNaN(val_a)))
    {
      val_a = Number(val_a);
      val_b = Number(val_b)
    }

    // Do nothing if equal
    if (val_b === val_a)
    {
      return 0;
    }

    // Determine order
    const res = val_b < val_a;

    // standard comparison
    if (res)
    {
      return 1;
    }
    else
    {
      return -1;
    }
  }

  // Invokes alphanumeric sort
  multiSort = (column_key) =>
  {

    var sorted_data = cloneDeep(this.state.csvData)

    // Determines which direction to sort in
    if (this.state.keysSortedDown[column_key])
    {
      return (sorted_data.sort(
        function(a, b) {
          return this.alphanumericSort(column_key,a,b);
        }.bind(this)
      ))
    }
    else
    {
        return (sorted_data.sort(
        (a, b) => {
            return this.alphanumericSort(column_key,b,a);
          }
        ))
    }
  }

  // Sort up or down by key
  sortByColumn = (column_key) => {

      this.showLoader();
      // TODO Figure out how to prioritize which UI components update first
      // Timeout forces the issue
      setTimeout(() => {
      var sortState = cloneDeep(this.state.keysSortedDown);
      // Add object to sortState to indicate current multi-column sort
      sortState[column_key] = !sortState[column_key];

      this.setState({
          keysSortedDown: sortState
      });

      var sorted = this.multiSort(column_key)

      this.setState({
          csvData: sorted
      });

      this.hideLoader();

    }, 50);

  }

  // Convert stringified csv into JSON Object
  csvToJSON = (data) => {
    const titles = data.slice(0, data.indexOf('\n')).split(',');

    // Build new object array from string data
    return data
      .slice(data.indexOf('\n'))
      .split('\n')
      .map((v,idx) => {
        const values = v.split(',');

        // Build object without original indices
        const row = titles.reduce(function(obj, title, index) {

          // Populate Object using titles as keys
          return ((obj[title] = values[index]), obj)
          }, {});

        // Add original index as a key, as well as a visible property and return row
        let res = Object.assign({d_fs23dR_Rt791:[],'':idx},row)
        return res;
      });
  };


  // Forces event handlers to wait a bit for user to finish typing
  debounce = (func, wait, immediate) => {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
        timeout = null;
  			func.apply(context, args);
  		};
      // Clears any previous requests
  		clearTimeout(timeout);
      // Initiate new request
  		timeout = setTimeout(later, wait);
  	};
  };

  packageStatsWorkerData = (key,index,row) => {

	  let sData = {}
	  sData['csvData'] = this.state.csvData;
	  sData['invisibleProp'] = this.state.invisibleProp;
	  sData['key'] = key;
	  sData['index'] = index;
	  sData['row'] = row;

	  return sData;

  }

  // Set state based on output of statsWorker
  processStatsWorkerData = (data) => {
	this.setState({
	colId: data.key,
	rowId: data.index,
	rowCount: data.row_count,
	colSum: data.col_sum,
	colMean: data.col_mean,
	colSd: data.col_sd,
	isText: false
	});
  }

  // Triggers statistics view
  onMouseOver = this.debounce((key,index,row) =>
  {

    // Package Relevant Data For Worker
    let statsInput = this.packageStatsWorkerData(key,index,row);

    // Send CSV data to stats worker for easy non-blocking computation
    this.state.statsWorker.postMessage(statsInput);

  }, 800)

  // Respond to user uploading csv
  uploadCSV = (event) => {

    this.setState({
      inProgress: 1
    });

    let reader = new FileReader();
    var fileName = event.target.files[0].name;

    reader.onload = function () {

      // Read CSV
      let csvArray = this.csvToJSON(reader.result);

      // Clone header and keep as sort direction state separate from data
      var columnKeysSortedDown = cloneDeep(csvArray[0]);

      for (const prop of Object.keys(columnKeysSortedDown)) {
        columnKeysSortedDown[prop] = true;
      }

      this.setState({
        fileName: fileName,
        csvData: csvArray,
        keysSortedDown: columnKeysSortedDown
      });

      // Show loader icon while waiting for tabular view to fully render
      setTimeout(() => {
        this.setState({
          inProgress: 2
        });

        // Attach scroll handler only after content has loaded
        const rootDiv = document.getElementsByClassName(this.state.scrollContName)[0]
        // Add listener for lazy rendering
        rootDiv.addEventListener('scroll', this.onScroll, false);
      }, 100);

    }.bind(this); // Bind class methods to onload
    reader.readAsBinaryString(event.target.files[0])
  }

  // Toggles string-distance matching for all future inputs
  toggleFuzzy = (e) =>
  {
      this.setState({
        fuzzyMatchingOn: !this.state.fuzzyMatchingOn
      });
  }

  // Triggers loading additional content
  onScroll = (event) => {

		let scrollTop = (document.getElementsByClassName(this.state.scrollContName)[0]).scrollTop + window.innerHeight;
		let bodyHeight = (document.getElementsByClassName(this.state.scrollContName)[0]).scrollHeight;
		let scrollPercentage = (scrollTop / bodyHeight);

		// If the scroll has reached bottom, load more content.
		if(scrollPercentage > 1.0)
    {
      this.setState({
        lastIndexLoaded: this.state.lastIndexLoaded + this.state.recordsToLoad
      });
		}
  }

  // Two Basic Views : Uploader and Display Uploaded Contents
  render() {

    // If CSV has been uploaded, render contents, else show uploader
    if (this.state.inProgress === 0)
    {
      return (
        <Uploader uploadCSV={this.uploadCSV} />
      )
    }
    else
    {
      // Conditionally render loader prior to tabular view
      return (this.state.inProgress === 1 || this.state.csvData === null) ? (
        <Loader />
      ) :
          <div className="csv-cont">
              <div className="csv-inner-cont">
                <Filter csvData={this.state.csvData}  debounce={this.debounce}
                 invisibleProp={this.state.invisibleProp} onClick={this.filterCSV} performFilter={this.performFilter} />
                <div className="filter-options-cont">
                  <span>Filter with fuzzy matching &nbsp;</span><span><input onChange={this.toggleFuzzy} type="checkbox"/></span>
                </div>
                <div className="csv-frame">
                { this.state.tableIsLoading === 1 && // Obscure table during sorting or filtering
                 <div className="centeredOverlay">
                      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                 </div>
                }
                  <CSV keysSortedDown={this.state.keysSortedDown} csvData={this.state.csvData} invisibleProp={this.state.invisibleProp}
                  lastIndexLoaded={this.state.lastIndexLoaded} onMouseOver={this.onMouseOver} onClick={this.sortByColumn} />
                </div>
                <div className="header-title">
                  File Name : {this.state.fileName}
                </div>
              </div>
              <div className="data-display-wrapper">
                <div className="data-display-cont">
                <Statistics rowCount={this.state.rowCount} keysSortedDown={this.state.keysSortedDown} csvData={this.state.csvData} invisibleProp={this.state.invisibleProp}
                lastIndexLoaded={this.state.lastIndexLoaded} colId={this.state.colId} rowId={this.state.rowId}
                colSum={this.state.colSum}
                colMean={this.state.colMean}
                colSd={this.state.colSd}
                isText={this.state.isText}
                />
                </div>
              </div>
          </div>
    }
  }
}

export default App;
