
var LocationChecker = React.createClass({
	unlock: function(isSuspicious){
		var gameRiddle = this.state.gameRiddle;
		gameRiddle.hasQuestions = true;
		gameRiddle.isSuspicious = isSuspicious;
		this.props.onReturn(gameRiddle);		
	},
	handleReturn: function(){
		this.props.onReturn();
	},
	handleForceUnlock: function(){
		this.unlock(true);
	},
	handlePosition: function(position){
		$.post("/game/CalculateDistance",
			{
				sLatitude: position.coords.latitude,
				sLongitude: position.coords.longitude,
				eLatitude: this.state.lat,
				eLongitude: this.state.lng
			},
			function(distance){
				distance = Math.round(distance);
				if(distance <= 50){
					this.unlock(false);
				}else{
					this.setState({distance: distance, showAlternative: true});
				}
			}.bind(this), "json")
			.fail(function(){
				this.setState({showAlternative:true});
			}.bind(this));
	},
	handleError: function(error){
		switch(error.code) {
			case error.PERMISSION_DENIED:
				alert("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				alert("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				alert("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				alert("An unknown error occurred.");
				break;
		}
		this.setState({showAlternative: true});
	},
	handleCheckLocation: function(){
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(this.handlePosition, this.handleError);
		} else {
			this.setState({showAlternative: true});
		}
	},
	componentWillReceiveProps: function(nextProps){
		var riddle = nextProps.gameRiddle.riddle;
		var location = riddle.LocationName;
		var lat = riddle.Latitude;
		var lng = riddle.Longitude;
        this.setState({gameRiddle:nextProps.gameRiddle, lat : lat, lng: lng, location: location });
    },
	getInitialState: function(){		
		var riddle = this.props.gameRiddle.riddle;
		var location = riddle.LocationName;
		var lat = riddle.Latitude;
		var lng = riddle.Longitude;
		return { gameRiddle:this.props.gameRiddle, lat : lat, lng: lng, location: location };
	},
	render: function(){
		var unlocked, altbutton, distanceMessage;
		if(this.state.distance){
			distanceMessage = <p>Du befinner dig just nu ca {this.state.distance} m därifrån</p>;
		}
		if(this.state.showAlternative){
			altbutton = <p><button className="btn btn-red" onClick={this.handleForceUnlock}>Jag svär jag är där!</button></p>;
		}
		return (
			<div>
				<h2 className="content-sub-heading">Bege dig till {this.state.location}</h2>
				<div>
					<p>
						Du måste befinna dig inom 50 m från platsen.
					</p>
					{distanceMessage}
					<button className="btn btn-blue" onClick={this.handleCheckLocation}>Jag är där</button>
					{altbutton}
				</div>				
				<GoogleMap lat={this.state.lat} lng={this.state.lng} />
			</div>
		);
	}
});
