
var ChallengedView = React.createClass({
	showResult: function(){
		var groupId = this.props.data.GroupId;
		React.render(<ChallengeResult groupid={groupId} />, document.getElementById("challenge-result"));
	},
	acceptChallenge: function(){
		$.post("/challenge/acceptChallenge", {id : this.props.data.Id}, function(){
			this.setState({ isAccepted : true });
		}.bind(this));
	},
	rejectChallenge : function(){
		$.post("/challenge/rejectChallenge", {id : this.props.data.Id}, function(){
			this.props.onReject(this.props.data.Id);
		}.bind(this));
	},
	getInitialState: function(){
		return { isAccepted : this.props.data.IsAccepted };
	},
	render : function(){
		var huntUrl = "/jakt/" + this.props.data.HuntId + "/" + this.props.data.HuntSlug;
		var isAccepted = this.state.isAccepted ? 
			(<div><span className="text-blue">Du har tackat ja <span className="icon icon-check"></span></span><p><button className="btn btn-blue" onClick={this.showResult}>Visa resultat</button></p></div>)
			: 
			(
			<div>
				<button className="btn btn-blue" onClick={this.acceptChallenge}>Ja!</button>&nbsp; &nbsp;
				<button className="btn btn-flat btn-red" onClick={this.rejectChallenge}>Nej</button>
			</div>
			);
		return(
				<div className="tile">
					<div className="tile-inner">
						<p>
							<a href={huntUrl}>{this.props.data.HuntName}</a><br />
							<span className="icon icon-timer"></span> Starttid kl {this.props.data.FriendlyStartTime} <br />
							Utmanare: {this.props.data.ChallengerUserName}
						</p>
						{isAccepted}
					</div>
				</div>
			);
	}
});
var ChallengedApp = React.createClass({
	handleRejection : function(id){
		var challenges = this.state.challenges;
		for(var i = challenges.length - 1; i >= 0; i--){
			if(challenges[i].Id === id){
				challenges.splice(i, 1);
				break;
			}
		}
		this.setState({challenges : challenges});
	},
	getInitialState: function(){
		return { challenges : this.props.data };
	},
	render: function(){
		var nodes = this.state.challenges.map(function(challenge, i){
			return <ChallengedView data={challenge} key={i} onReject={this.handleRejection} />;
		}.bind(this));
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
							<p>Du har inte blivit utmanad av någon än.</p>
						</div>
					</div>
				</div>
			)
		);
	}
});