
var LocationChecker = React.createClass({
	unlock: function(isSuspicious){
		var gameRiddle = this.state.gameRiddle;
		gameRiddle.hasQuestions = true;
		this.setState({isUnlocked: true, isSuspicious: isSuspicious});
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
			}.bind(this),"json");
	},
	handleError: function(error){
	/*
		switch(error.code) {
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				console.log("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred.");
				break;
		}*/
		this.setState({showAlternative: true});
	},
	handleCheckLocation: function(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.handlePosition);
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
		var unlocked, altbutton, suspicious, distanceMessage;
		if(this.state.distance){
			distanceMessage = <p>Du befinner dig just nu ca {this.state.distance} m därifrån</p>;
		}
		if(this.state.showAlternative){
			altbutton = <p><button className="btn btn-red" onClick={this.handleForceUnlock}>Jag svär jag är där!</button></p>;
		}
		if(this.state.isSuspicious){
			suspicious = <img src="/images/suspicious.jpg" alt="Suspicious" />;
		}
		return (
			<div>
				<h2 className="content-sub-heading">Hämta frågor vid {this.state.location}</h2>
				{
					this.state.isUnlocked ?
					<div>
						{suspicious}
						<p>
							Frågorna är nu upplåsta. Du kan återgå till rebuslistan.
						</p>
					</div>
					:
					<div>
						<p>
							Du måste befinna dig inom 50 m från platsen för att kunna hämta frågorna.
						</p>
						{distanceMessage}
						<button className="btn btn-blue" onClick={this.handleCheckLocation}>Jag är där</button>
						{altbutton}
					</div>
				}
				<p>
					<a href="#" onClick={this.handleReturn}>Återgå till rebuslistan</a>
				</p>
				<GoogleMap lat={this.state.lat} lng={this.state.lng} />
			</div>
		);
	}
});
