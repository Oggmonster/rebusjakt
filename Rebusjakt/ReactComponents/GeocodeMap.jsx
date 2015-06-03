
    var GeocodeMap = React.createClass({
        initMap : function(){
			var lat = this.state.lat || 59.32932349999999;
			var lng = this.state.lng || 18.068580800000063;
			var mapOptions = {
                zoom: 12,
                center: new google.maps.LatLng(lat,lng)
            };
            var map = new google.maps.Map(React.findDOMNode(this.refs.map),
                mapOptions);

            google.maps.event.addListener(map,'click',function(event) { 
                var lat = event.latLng.lat();
                var lng = event.latLng.lng();
                var latlng = new google.maps.LatLng(lat,lng);
                this.geoCodeIt({'latLng': latlng, 'region' : 'se'});
            }.bind(this));
			var marker = new google.maps.Marker({
                position: map.getCenter(),
                map: map
            });
			this.geocoder = new google.maps.Geocoder();
			this.map = map;
			this.marker = marker;
        },
        geoCodeIt : function(data){
            var geocoder = this.geocoder;
            var map = this.map;
			var marker = this.marker;
            geocoder.geocode(data, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {    
					map.setCenter(results[0].geometry.location);                
                    var location = results[0].geometry.location;
                    marker.setPosition(location);
					var lat = location.lat();
					var lng = location.lng();
					this.setState({lat: lat, lng: lng});
                    this.props.onPickPosition({'lat': lat , 'lng' : lng });
                    if (results[0].geometry.viewport){
                        map.fitBounds(results[0].geometry.viewport);					
					} 						
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            }.bind(this));
        },
        handleSubmit : function(e){
            e.preventDefault();            
            var address = React.findDOMNode(this.refs.address).value.trim();
            this.geoCodeIt({ 'address': address, 'region': 'se'});            
        },
		componentWillReciveProps: function(nextProps){
			this.setState({ lat: nextProps.lat, lng: nextProps.lng });
			this.initMap();
		},
		getInitialState: function() {
            return { lat: this.props.lat, lng: this.props.lng };
        },
        componentDidMount: function(){
            this.initMap();
			$(".txt-address").focus();
        },
        render: function () {
			var mapStyle = {height:"350px"};
            return(
                    <div>
						<h2 className="content-sub-heading">Välj kartposition</h2>
                        <p>
                            Sök efter en plats eller klicka på kartan för att markera kartposition.
                        </p>
                        <form onSubmit={this.handleSubmit}>
							<div className="form-group">
								<div className="row">
									<div className="col-lg-12">
										<input className="form-control form-control-default txt-address input-inline" placeholder="Plats" type="text" ref="address"  />
										<input className="btn btn-blue btn-inline" type="submit" value="Sök" />												
									</div>
								</div>
							</div>
                        </form>           
                        <div className="map-holder" style={mapStyle} ref="map"></div>
                    </div>
                );
        }

    });