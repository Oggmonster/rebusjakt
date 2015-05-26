
    var GoogleMap = React.createClass({
        initMap : function(){
            var mapOptions = {
                zoom: 16,
                center: new google.maps.LatLng(this.props.lat,this.props.lng)
            };
            var map = new google.maps.Map(React.findDOMNode(this.refs.map),
                mapOptions);

			var marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.props.lat,this.props.lng),
                map: map                        
            });
        },        
        componentDidMount: function(){
            this.initMap();
        },
        render: function () {
            return(
                    <div className="map-holder" ref="map"></div>
                );
        }
    });