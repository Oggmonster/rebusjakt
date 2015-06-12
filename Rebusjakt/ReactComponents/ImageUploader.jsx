var ImageUploader = React.createClass({
	handleSubmit : function(e){
		e.preventDefault();
		var data =  new FormData();
		var files = $("#fileUpload").get(0).files;
		if (files.length > 0) {
           data.append("file", files[0]);
      	}
      	var ajaxRequest = $.ajax({
           type: "POST",
           url: "/image/upload",
           contentType: false,
           processData: false,
           data: data
        });

        ajaxRequest.done(function(response){
        	this.props.onImageUploaded(response);
        }.bind(this));

        ajaxRequest.error(function(){
        	toastIt("Något verkar ha gått fel när vi skulle ladda upp din bild :( Försök igen.")
        });
	},
	render : function(){
		
		return(
			<form id="image-upload-form" onSubmit={this.handleSubmit}>
			<div className="form-group">
				<div className="row">
					<div className="col-lg-6 col-md-8 col-sm-10">
						<label>Ladda upp en bild (om du vill använda det till frågan)</label>
						<input id="fileUpload" type="file" name="file" className="form-control-default form-control" />
						<p>
							<input type="submit" className="btn btn-blue" value="Ladda upp" />
						</p>
						
					</div>
				</div>
			</div>
			
			</form>
			);
	}
});