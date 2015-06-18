//group challenges by groupid
//show status of each challenge - from not accpeted to finished with score
//take current user id to see if creator or challenged

var ChallengerView = React.createClass({
	
	render : function(){
		var challenge = this.props.data;
		var isAccepted = challenge.IsAccepted ? <span className="text-blue">Har tackat ja <span className="icon icon-check"></span></span> : <span>Har inte svarat</span>;
		return (
				<div className="tile">
					<div className="tile-inner">
						<p>
							 E-post: {challenge.ChallengedEmail} <br />
							 {isAccepted}
						</p>
						
					</div>
				</div>
			);
	}
});

var ChallengeGroupView = React.createClass({
	showResult: function(){
		var firstChallenge = this.props.data[0];
		var groupId = firstChallenge.GroupId;
		console.log(groupId);
		React.render(<ChallengeResult groupid={groupId} />, document.getElementById("challenge-result"));
	},
	render: function(){
		var firstChallenge = this.props.data[0];
		var total = this.props.data.length;
		var accpeted = this.props.data.filter(function(challenge){ return challenge.IsAccepted; }).length;
		var header = firstChallenge.HuntName;
		var huntUrl = "/jakt/" + firstChallenge.HuntId + "/" + firstChallenge.HuntSlug;
		var startTime = firstChallenge.FriendlyStartTime;

		var nodes = this.props.data.map(function(challenge, i){
			return <ChallengerView data={challenge} key={i} />;
		});
		return(
			<div className="card">
				<div className="card-main">
					<div className="card-inner">
					<p className="card-heading"><a href={huntUrl} title={header}>{header}</a></p>	
					<span className="icon icon-timer"></span> Starttid: kl {startTime} <br />
					{accpeted} av {total} deltagare har tackat ja
					<p>
					<p>
						<button className="btn btn-blue" onClick={this.showResult}>Visa resultat</button>
					</p>
					<a className="btn collapsed waves-button waves-effect" data-toggle="collapse" href={"#" + firstChallenge.Id} onClick={this.handleShowMap}>
						<span className="collapsed-hide">Dölj</span>
						<span className="collapsed-show">Visa deltagare</span>
					</a>
					</p>	
					<div className="collapsible-region collapse" id={firstChallenge.Id}>
						<p className="card-heading text-alt"><span className="icon icon-person"></span> Inbjudna deltagare</p>						
						<div className="tile-wrap">
							{nodes}
						</div>						
					</div>	
					</div>
				</div>
			</div>
			);
	}
});



var ChallengerApp = React.createClass({
	getInitialState: function(){
		var challenges = this.props.data;
		var groupids = Object.create(null);
		challenges.forEach(function(challenge){
			groupids[challenge.GroupId] = challenge.GroupId;
		});
		var groups = [];
		for(var key in groupids){
			var challengeGroup = challenges.filter(function(challenge){
				return challenge.GroupId === key;
			});
			groups.push(challengeGroup);
		}
		return { groups : groups };
	},
	render: function(){
		var nodes = this.state.groups.map(function(group, i){
			return <ChallengeGroupView data={group} key={i} />;
		});
		return(
			nodes.length > 0 ?
			(
				<div className="card-wrap">
					{nodes}
				</div>
			)
			:
			(
			<div className="card-wrap">
				<div className="card">
				<div className="card-main">
					<div className="card-inner">
						<p>
							Du har inte utmanat någon.
						</p>
					</div>
				</div>
				</div>
			</div>
			)
			);
	}
});