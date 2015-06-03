
    var GoogleMap = React.createClass({
        initDynamicMap : function(){
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(this.props.lat,this.props.lng)
            };
            var map = new google.maps.Map(React.findDOMNode(this.refs.map),
                mapOptions);
			
			
			var latLng = new google.maps.LatLng(this.props.lat,this.props.lng);
			var marker = new google.maps.Marker({
                position: latLng,
                map: map                        
            });
			
			if(this.props.positions){
				var bounds = new google.maps.LatLngBounds();
				bounds.extend(latLng);
				this.props.positions.forEach(function(position){
					latLng = new google.maps.LatLng(position.lat,position.lng);
					var marker = new google.maps.Marker({
						position: latLng,
						map: map,
						title: position.name                       
					});
					bounds.extend(latLng);
				});
				map.fitBounds(bounds);
			}		
        },   
		loadScript: function(){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			window.googleMapCallback = this.initDynamicMap;
			script.src = 'https://maps.googleapis.com/maps/api/js?callback=googleMapCallback';
			document.body.appendChild(script);
		},     
		getMapSrc: function(){
			var src = "https://maps.googleapis.com/maps/api/staticmap?center=" + this.props.lat + "," + this.props.lng + "&markers=color:blue%7C" + this.props.lat + "," + this.props.lng + "&zoom=16&size=450x450&sensor=false";
			return src;
		},
		getInitialState: function(){
			var isMulti = false; 
			if(this.props.positions && this.props.positions.length > 0){
				isMulti = true;
			}
			var mapSrc = isMulti ? "" : this.getMapSrc();
			return{mapSrc: mapSrc, isMultiMarker : isMulti};
		},
		componentDidMount: function(){					
			if(this.props.positions && this.props.positions.length > 0){
				if("google" in window){
					this.initDynamicMap();							
				}else{					
					this.loadScript();			
				}						
			}				
		},
        render: function () {			
			var mapContainer;
			if(this.state.isMultiMarker){
				var mapStyle = {height:"350px"};
				mapContainer = <div className="map-holder" ref="map" style={mapStyle}></div>;
			}else{
				mapContainer = <img src={this.state.mapSrc} className="map-holder" />;
			}
			
            return(
				<div>
					{mapContainer}           
				</div>
                );
        }
    });