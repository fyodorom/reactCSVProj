import React from 'react'
import '../css/App.css';

const Loader = (props) => {

	return (
    <div className="select-cont">
        <div className="upload-cont">
            {/* Initial Load View */}
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
 )


}


export default Loader
