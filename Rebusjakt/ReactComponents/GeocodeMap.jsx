
    var GeocodeMap = React.createClass({
        getMarker : function(map){
            var marker;
            return function(){
                if(!marker){
                    var marker = new google.maps.Marker({
                        position: map.getCenter(),
                        map: map,
                        draggable: true
                    });
                }
                return marker;
            }();
        },
        getMap : function(){
            var map;
            return function(){
                if(!map){
                    var mapOptions = {
                        zoom: 4,
                        center: new google.maps.LatLng(59.32932349999999,18.068580800000063)
                    };
                    map = new google.maps.Map(React.findDOMNode(this.refs.map),
                        mapOptions);

                    google.maps.event.addListener(map,'click',function(event) { 
                        var lat = event.latLng.lat();
                        var lng = event.latLng.lng();
                        var latlng = new google.maps.LatLng(lat,lng);
                        this.geoCodeIt({'latLng': latlng, 'region' : 'se'});
                    }.bind(this));
                }
                return map;
            }.bind(this)();
        },
        geoCodeIt : function(data){
            var geocoder = new google.maps.Geocoder();
            var map = this.getMap();
            geocoder.geocode(data, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.setCenter(results[0].geometry.location);
                    var marker =  this.getMarker(map);
                    var location = results[0].geometry.location;
                    marker.setPosition(location);
                    this.props.onPickPosition({'lat': location.lat(), 'lng' : location.lng() });
                    if (results[0].geometry.viewport) 
                        map.fitBounds(results[0].geometry.viewport);
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
        componentDidMount: function(){
            var map = this.getMap();
			$(".txt-address").focus();
        },
        render: function () {
            return(
                    <div>
						<h2 className="content-sub-heading">Välj kartposition</h2>
                        <p>
                            Sök efter en plats eller klicka på kartan för att ange den plats som rebusen ska leda till.
                        </p>
						<p>
							

						</p>
						                           
                        <form onSubmit={this.handleSubmit}>
							<div className="form-group">
								<div className="row">
									<div className="col-lg-6 col-md-8 col-sm-10">
										<label>Plats</label>
										<input className="form-control form-control-default txt-address" type="text" ref="address"  />
											
									</div>
								</div>
								<div className="form-group-btn">
									<div className="row">
										<div className="col-lg-6 col-md-8 col-sm-10">
											<input className="btn btn-blue" type="submit" value="Sök adress" />	
										</div>
									</div>
								</div>
							</div>
                        </form>           
                        <div className="map-holder" ref="map"></div>
                    </div>
                );
        }

    });