import React from 'react'
import '../css/App.css';

const Uploader = (props) => {

	return (
		<div className="select-cont">
		<div className="upload-cont">
			<div className="title-cont">Please choose a .CSV file to get started</div>
			<div>
				<label htmlFor="file-upload" className="custom-file-upload">
					<i className="fa fa-cloud-upload"></i> Upload
				</label>
				<input id="file-upload" type="file" onChange={props.uploadCSV}/>
			</div>
		</div>
	</div>
 )


}


export default Uploader
