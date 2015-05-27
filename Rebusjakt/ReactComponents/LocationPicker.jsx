


var LocationPicker = React.createClass({
	handleMapPosition: function(position){
		$("#StartLatitude").val(position.lat);
		$("#StartLongitude").val(position.lng);		
    }, 
	handleShowMap: function(){
		this.setState({showMap: true});
	},
	getInitialState: function(){
		return { Latitude : this.props.lat, Longitude : this.props.lng };
	},
	render:function(){
		var map;
		if(this.state.showMap){
			map = <GeocodeMap lat={this.state.Latitude} lng={this.state.Longitude} onPickPosition={this.handleMapPosition} />;          
		}
		return(
			<div className="form-group">
				<div className="row">
					<div className="col-lg-6 col-md-8 col-sm-10">
						<a className="btn collapsed waves-button waves-effect" data-toggle="collapse" href="#collapsible-map-region" onClick={this.handleShowMap}>
							<span className="collapsed-hide">Dölj</span>
							<span className="collapsed-show">Välj kartposition</span>
						</a>	
						<div className="collapsible-region collapse" id="collapsible-map-region">
							{map}
						</div>								
					</div>
				</div>
			</div>
		);
	}
});

var lat = $("#StartLatitude").val();
var lng = $("#StartLongitude").val();
React.render(<LocationPicker lat={lat} lng={lng} />, document.getElementById("location-picker"));