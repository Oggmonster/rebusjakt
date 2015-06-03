


var CountDownTimer = React.createClass({
	timer: function(){
		var diff = this.props.duration - (((Date.now() - this.props.started) / 1000) | 0);
		var minutes = (diff / 60) | 0;
		var seconds = (diff % 60) | 0;
		if(minutes <= 0 && seconds <= 0){
			window.clearInterval(this.interval);
			this.props.onTimeIsUp();
		}else{
			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;
			this.setState({minutes:minutes, seconds:seconds});
		}
		
		
	},
	getInitialState: function(){
		return {minutes: 0, seconds : 0 };
	},
	componentDidMount: function(){
		this.timer();
		this.interval = setInterval(this.timer, 1000);
	},
	componentWillUnmount: function(){
		window.clearInterval(this.interval);
	},
	render: function(){
		return (
			<span><span dangerouslySetInnerHTML={{__html: emojione.toImage(":hourglass:")}} /> {this.state.minutes}:{this.state.seconds}</span>
		);
	}
});