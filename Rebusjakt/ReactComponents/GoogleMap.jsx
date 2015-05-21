
    var GoogleMap = React.createClass({
        setMarker : function(map){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.props.lat,this.props.lng),
                map: map                        
            });
        },
        getMap : function(){
            var map;
            return function(){
                if(!map){
                    var mapOptions = {
                        zoom: 16,
                        center: new google.maps.LatLng(this.props.lat,this.props.lng)
                    };
                    map = new google.maps.Map(React.findDOMNode(this.refs.map),
                        mapOptions);
                }
                return map;
            }.bind(this)();
        },        
        componentDidMount: function(){
            var map = this.getMap();
            this.setMarker(map);
        },
        render: function () {
            return(
                    <div className="map-holder" ref="map"></div>
                );
        }

    });