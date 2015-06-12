
//lista alla rebusar och målet
//visa översiktskarta



var NewLocationsPicker = React.createClass({
	handleMapPosition : function(position){
		var gameRiddle = this.state.activeRiddle;
		gameRiddle.riddle.Latitude = position.lat;
		gameRiddle.riddle.Longitude = position.lng;
		gameRiddle.hasNewPosition = true;
	},
	pickPosition: function(gameRiddle){
		var lat = gameRiddle.riddle.Latitude;
		var lng = gameRiddle.riddle.Longitude;
		this.setState({showMap : true, activeRiddle: gameRiddle, lat: lat, lng: lng });
	},
	hasPickedPosition: function(){
		var gameRiddle = this.state.activeRiddle;
		gameRiddle.riddle.LocationName = this.refs.locationName.getDOMNode().value;
		var endGameRiddle = this.state.endGameRiddle;
		var gameRiddles = this.state.gameRiddles;
		this.setState({gameRiddles : gameRiddles, endGameRiddle: endGameRiddle, showMap: false});
	},
	handleFinished : function(){
		var master = this.state.master;
		master.hasNewLocations = true;
		master.started = Date.now();
		master.save();
		this.props.onFinished();
	},
	getInitialState : function(){
		var gameRiddles = this.props.master.gameRiddles;
		return { master: this.props.master, gameRiddles : gameRiddles, endGameRiddle : this.props.master.endGameRiddle };
	},
	render: function(){
		var map, hasEndPosition, finishedButton;

		if(this.state.endGameRiddle.hasNewPosition){
			hasEndPosition = <span className="icon icon-check text-green"></span>;
		}
		if(hasEndPosition && this.state.gameRiddles.every(function(gameRiddle){ return gameRiddle.hasNewPosition; })){
			finishedButton = <button className="btn btn-green btn-lg" onClick={this.handleFinished}>Klar med att välja platser</button>;
		}
		var riddleNodes = this.state.gameRiddles.map(function(gameRiddle, i){
			var hasNewPosition;
			if(gameRiddle.hasNewPosition){
				hasNewPosition = <span className="icon icon-check text-green"></span>;
			}
			return (
				<div className="tile">
					<div className="tile-inner">
						<a href="#" className="btn btn-blue btn-md" onClick={this.pickPosition.bind(this, gameRiddle)}>Välj plats för Rebus {i+1}</a> &nbsp; <span className="icon icon-place"></span> {gameRiddle.riddle.LocationName} {hasNewPosition}
					</div>
				</div>
				);
		}.bind(this));
		if(this.state.showMap){
			map = <GeocodeMap lat={this.state.lat} lng={this.state.lng} onPickPosition={this.handleMapPosition} />; 
		}		
		return(
			<div>
				{
					this.state.showMap ? 
					(
						<div>
						<br/>						
						<button className="btn btn-blue" onClick={this.hasPickedPosition}>Klar</button>
						<div className="form-group">
							<div className="row">
								<div className="col-lg-6 col-md-8 col-sm-10">
								<label>Platsnamn</label>
								<input ref="locationName" defaultValue ={this.state.activeRiddle.riddle.LocationName} type="text" className="form-control form-control-default" />
								</div>
							</div>
						</div>						
						{map}
						<button className="btn btn-blue" onClick={this.hasPickedPosition}>Klar</button>
						</div>	
					) 
					:
					(
						<div>
						<h2 className="content-sub-heading">Välj nya platser</h2>
						<div className="tile-wrap">
							{riddleNodes}
							<div className="tile">
								<div className="tile-inner">
									<a href="#" className="btn btn-blue btn-md" onClick={this.pickPosition.bind(this, this.state.endGameRiddle)}>Välj plats för målgången </a> &nbsp; <span className="icon icon-place"></span> {this.state.endGameRiddle.riddle.LocationName} {hasEndPosition}
								</div>
							</div>
						</div>
						<p>
							{finishedButton}
						</p>
						</div>
					)
				}				
			</div>			
		);
	}
});