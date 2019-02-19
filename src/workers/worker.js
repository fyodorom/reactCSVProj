export default () => {
	self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals

		if (!e) return;

		let csvData = e.data["csvData"];
		let invisibleProp = e.data["invisibleProp"]
		let key = e.data['key']
		let index = e.data['index']
		//let row = e.data['row']

	    // Considers all rows, whether scrolled to or not, but only those that match filters
	    var all_active_rows = csvData.filter(row => row[invisibleProp].length === 0 && row[""] !== 0);

	    var array_of_col_values = all_active_rows.map(row => row[key]);
	    var row_count = array_of_col_values.length;

	    // Set Non-numeric stats
	    if (isNaN(csvData[index][key]))
	    {
		  let returnObj = {}
		  returnObj.key = key;
		  returnObj.index = index;
		  returnObj.row_count = row_count;

		  postMessage(returnObj);

	    }
	    else
	    {
	      // Builds column-based statistics
	      const sum = (accumulator, currentValue) => Number(accumulator) + Number(currentValue);
	      const average = arr => arr.reduce((sum, val) => sum + val) / row_count;

	      var range_lowest = 0 //Math.min(...array_of_col_values);
	      var range_highest = 5 //Math.max(...array_of_col_values);
	      var col_sum = array_of_col_values.reduce(sum);
	      var col_mean = col_sum/row_count.toFixed(3);

	      const sd  = arr => Math.sqrt(average(arr.map(val => ((val - col_mean) ** 2))));
	      var col_sd = sd(array_of_col_values).toFixed(3)

		  let returnObj = {}
		  returnObj.key = key;
		  returnObj.index = index;
		  returnObj.row_count = row_count;
		  returnObj.range_lowest = range_lowest;
		  returnObj.range_highest = range_highest;
		  returnObj.col_sum = col_sum;
		  returnObj.col_mean = col_mean;
		  returnObj.col_sd = col_sd;

	      postMessage(returnObj);
	    }

	})
}
