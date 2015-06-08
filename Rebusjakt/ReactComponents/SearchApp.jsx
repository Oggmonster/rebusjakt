var SearchForm = React.createClass({
	handlePosition: function(position){
		var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var query = this.refs.query.getDOMNode().value;
        var radius = this.refs.radius.getDOMNode().value;
        this.props.onSearch(query, lat, lng, radius);		

	},
	handleGeoError: function(error){
		alert("Kan tyvärr inte använda din position");
	},
	geoCodeAddress : function(){
		var geoCoder = new google.maps.Geocoder();
		var data = { 'address': this.refs.place.getDOMNode().value, 'region': 'se'};
		geoCoder.geocode(data, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {    
                var location = results[0].geometry.location;
				var lat = location.lat();
				var lng = location.lng();
				var query = this.refs.query.getDOMNode().value;
				var radius = this.refs.radius.getDOMNode().value;
        		this.props.onSearch(query, lat, lng, radius);		
            } else {
                alert('Kunde inte hitta den plats du angav: ' + status);
            }
        }.bind(this));
	},
	loadScript: function(){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		window.googleMapCallback = this.geoCodeAddress;
		script.src = 'https://maps.googleapis.com/maps/api/js?callback=googleMapCallback';
		document.body.appendChild(script);
	},     
	handlePlaceSearch : function(){
		if("google" in window){
			this.geoCodeAddress();							
		}else{					
			this.loadScript();			
		}						
	},
	handleSubmit: function(e){
		e.preventDefault();		
		var useLocation = this.refs.uselocation.getDOMNode().checked;
		var place = this.refs.place.getDOMNode().value;
		if(useLocation){
			if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(this.handlePosition, this.handleGeoError);
            }else
            {
            	alert("Kan tyvärr inte använda din position");
            }
		}else if(place.length > 0){
			this.handlePlaceSearch();
		}else{
			var query = this.refs.query.getDOMNode().value;
			var radius = this.refs.radius.getDOMNode().value;
			this.props.onSearch(query, 0, 0, radius);		
		}
	},
	render : function(){
		var marginTop = {marginTop : "10px"}, marginBottom = {marginBottom: "10px"};
		return (
			<form onSubmit={this.handleSubmit} className="form">
				<div className="form-group">
					<div className="row">
						<div className="col-lg-12">
							<span className="form-help form-help-msg">Sök på namn, tema etc.</span>
							<input type="search" placeholder="Sök på namn, tema etc." ref="query" className="input-inline form-control form-control-default" />
							<button className="btn btn-blue btn-inline" type="submit">Sök</button>
							<div className="row" style={marginTop}>
								<div className="col-md-3 col-sm-3" style={marginBottom}>
									<span className="form-help form-help-msg">Stad, stadsdel eller adress</span>
									<input type="text" placeholder="Plats" ref="place" className="form-control form-control-default input-inline" />
								</div>
								<div className="col-md-2 col-sm-2" style={marginBottom}>
									<span className="form-help form-help-msg">Sökradie</span>
									<select ref="radius" className="form-control form-control-default input-inline">
										<option value="1">1 km </option>
										<option value="2">2 km </option>
										<option value="5">5 km </option>
										<option value="10" selected>10 km </option>
										<option value="50">50 km </option>
										<option value="100">100 km </option>
									</select>
									
								</div>	
								<div className="col-md-2 col-sm-2">
									<span className="form-help form-help-msg">Din position</span>
									<div className="checkbox checkbox-adv">
											<label>
												<input className="access-hide answer-option" ref="uselocation" type="checkbox"  />Där jag är
												<span className="circle"></span>
												<span className="circle-check"></span>
												<span className="circle-icon icon icon-done"></span>
											</label>
									</div>
								</div>							
							</div>
						</div>
					</div>
				</div>
			</form>
			);
	}
});

var SearchApp = React.createClass({
	handleSearch: function(q, lat, lng, radius){
		$.post("/search/search", {q:q, latStr:lat, lngStr:lng, radius: radius}, function(result){
			this.setState({hunts : result});
		}.bind(this),"json");
	},
	getInitialState : function(){
		return { hunts : this.props.data };
	},
	render : function(){
		var nodes = this.state.hunts.map(function (hunt, i) {
			var distanceDisplay;
			var huntUrl = "/jakt/" + hunt.Id + "/" + hunt.Slug;
			if(hunt.Distance > 0){
				distanceDisplay = <span>{hunt.Distance} m, </span>
			}
			return (<div className="tile" key={i}>
						<div className="pull-left tile-side">
                            <div className="avatar avatar-blue avatar-md">
                               {i + 1}
                            </div>
                        </div>               
						<div className="tile-inner">
						<a href={huntUrl} title={hunt.Name}>{hunt.Name}</a><br/>
						<span className="icon icon-place text-green"></span> {distanceDisplay}{hunt.StartLocation} &nbsp;
						<span className="icon icon-label text-green"></span> {hunt.Theme}&nbsp;
						<span className="icon icon-timer text-green"></span> {hunt.TimeLimit} min
						
						</div>
					</div>
				);
		});
		if(nodes.length === 0){
			nodes = <div className="tile"><div className="tile-inner">Din sökningen gav noll träffar. Trist för dig :(</div></div>
		}
		return (
			<div>
				<SearchForm onSearch={this.handleSearch} />
				<div className="tile-wrap">{nodes}</div>
			</div>
			
		);
	}
});