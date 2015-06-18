
var ResultView = React.createClass({
	render : function(){
		return (
				<div className="tile">
					<div className="tile-inner">
						<p>
							{this.props.data.ChallengedUserName} <br />
							{this.props.data.UserScore.Score} p
						</p>
					</div>
				</div>
			);
	}
});

var ChallengeResult = React.createClass({
	showResult : function(groupid){
		$.post("/challenge/GetChallengeResultByGroupId", {id : groupid}, function(response){
			if(response.length > 0){
				this.setState({challenges: response});
			}else
			{
				this.setState({challenges: []});
			}			
		}.bind(this),"json");
	},
	componentWillReceiveProps : function(nextProps){
		this.showResult(nextProps.groupid);
	},
	getInitialState: function(){
		this.showResult(this.props.groupid);
		return { challenges : []};
	},
	render: function(){
		var nodes = this.state.challenges.map(function(challenge, i){
				return <ResultView data={challenge} key={i} />;
			});
		return (
			
			nodes.length > 0 ?
			(
				<div className="tile-wrap">
					{nodes}
				</div>
			)
			:
			(
			<div className="tile-wrap">
				<div className="tile">
					<div className="tile-inner">
						Det verkar inte vara någon som har slutfört jakten än.
					</div>
				</div>
			</div>
			)
			
		);
	}
});