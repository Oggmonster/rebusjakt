


var LocationPicker = React.createClass({
	handleMapPosition: function(position){
		this.props.latInput.val(position.lat);
		this.props.lngInput.val(position.lng)
    }, 
	handleShowMap: function(){
		this.setState({showMap: true});
	},
	getInitialState: function(){
		var lat = this.props.latInput.val();
		var lng = this.props.lngInput.val();
		return { Latitude : lat, Longitude : lng };
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
						<a className="btn collapsed waves-button waves-effect" data-toggle="collapse" href={"#" + this.props.collapsibleId} onClick={this.handleShowMap}>
							<span className="collapsed-hide">Dölj</span>
							<span className="collapsed-show">{this.props.pickText}</span>
						</a>	
						<div className="collapsible-region collapse" id={this.props.collapsibleId}>
							{map}
						</div>								
					</div>
				</div>
			</div>
		);
	}
});
var startLatInput = $("#StartLatitude"), startLngInput = $("#StartLongitude"), endLatInput = $("#EndLatitude"), endLngInput = $("#EndLongitude");
React.render(<LocationPicker latInput={startLatInput} lngInput={startLngInput} pickText="Markera start på karta" collapsibleId="collapsible-start" />, document.getElementById("start-location-picker"));

React.render(<LocationPicker latInput={endLatInput} lngInput={endLngInput} pickText="Markera målgång på karta" collapsibleId="collapsible-end" />, document.getElementById("end-location-picker"));