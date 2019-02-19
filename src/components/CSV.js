import React from 'react';
import '../css/App.css';

/* Conditionally renders the table after being fed data from App.js
* Data fed to CSV has properties which determine which columns and
* rows are actually needed
*/
const CSV = (props) => {
  // Renders Rows
  const csvTable = (props.csvData).filter((item) => (item[props.invisibleProp]).length === 0).map((row, index )=> {
    // Renders individual entries and header if first element
    const cData = Object.entries(row).map((key,value) => {
        if (index !== 0)
        {
          // Don't render the invisible property column
          if (key[0] !== props.invisibleProp)
          {
            return (
              <td key={index + "-" + key} onMouseOver={ () => props.onMouseOver(key[0],index,row)} className="cell">
                <span>{key[1]}</span>
              </td>
            )
          }
          else {
            return null
          }
        }
        else {
                  // Renders appropriate caret depending on state of current sort
                  const sortingHat = () => {
                  if (props.keysSortedDown[key[0]])
                  {
                    return <span onClick={ () => props.onClick(key[0])}
                    className="glyphicon glyphicon glyphicon-triangle-top" aria-hidden="true"/>
                  }
                  else
                  {
                    return <span onClick={ () => props.onClick(key[0])}
                    className="glyphicon glyphicon glyphicon-triangle-bottom" aria-hidden="true"/>
                  }
                }
                // Text should be invisble because a filter has been applied
                if (key[0] !== props.invisibleProp)
                {
                  return (
                    <th key={index + "-" + key} className="header-cell">
                      <span>{key}</span>
                      <span>{sortingHat()}</span>
                    </th>
                  )
                }
                else
                {
                  return null
                }
              }
      })
      // Check to make sure we've scrolled far enough to render and that this row isn't being filtered out
      if (index < props.lastIndexLoaded && row[props.invisibleProp].length === 0)
      {
        if (index > 0)
        {
          return (
              <tr className="row" key={row["0"]}>{cData}</tr>
          )
        }
        else
        {
          return (
              <thead key={"header-"+row["0"]}>
                <tr className="header-row row" key={"tr-"+row["0"]}>{cData}</tr>
              </thead>
          )
        }
      }
      else {
        return (null);
      }
  })
  return(
      <table className="data-table">
        {csvTable}
      </table>
  )

}

// Attaches generated props from redux store to CSV props
export default CSV // connect(mapStateToProps)(CSV);
