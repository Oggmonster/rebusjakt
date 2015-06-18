
var ChallengeCreator = React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
		this.setState({isSending: true});
		var emails = this.refs.emails.getDOMNode().value.split(',');
		var challengeData = {
			HuntId : this.props.huntId,
			UserId : this.props.userId,
			Emails : emails,
			Message : this.refs.message.getDOMNode().value,
			StartDate : this.refs.startdate.getDOMNode().value
		};
		$.post("/challenge/createchallenge", challengeData, function(response){
			if(response.errors){
				var errorMessage = "";
				response.errors.forEach(function(error){
					errorMessage += error + "<br>";
				});
				toastIt(errorMessage);
				this.setState({isSending:false, emails: emails});
			}else{
				this.setState({isFinished : true, showForm : false });	
			}			
		}.bind(this), "json")
		.fail(function(error){ 
			toastIt("Något gick fel när vi skulle skicka din utmaning :("); 
			this.setState({isSending: false});  
		}.bind(this));
	},
	handleCancel: function(e){
		e.preventDefault();
		this.setState({showForm : false});
	},
	handleChallenge: function(){
		this.setState({showForm : true});
	},
	getInitialState : function(){
		return { showForm : false };
	},
	render: function(){
		var defaultMessage = "Hej, antar du utmaningen?"
		return (
				this.state.showForm ? 
				(
					this.state.isSending ?
					(
					<div>
						<p>Skickar din utmaning...</p>
						<div className="progress">
							<div className="progress-bar-indeterminate"></div>
						</div>
					</div>
					)
					:
					(
					<form onSubmit={this.handleSubmit}>
						<h2 className="content-sub-heading">Utmana dina vänner</h2>
						<div className="form-group">
							<label>Skriv in e-postadresser till de vänner som du vill utmana. Separera med kommatecken</label>
							<textarea cols="30" rows="4" ref="emails" placeholder="E-postadresser" className="form-control form-control-default" defaultValue={this.state.emails}></textarea>
						</div>
						<div className="form-group">
							<label>Starttid</label>
							<input type="datetime-local" ref="startdate" className="form-control form-control-default" />
						</div>
						<div className="form-group">
							<label>Meddelande till mottagarna</label>
							<textarea cols="30" rows="4" ref="message" placeholder="Meddelande" className="form-control form-control-default" defaultValue={defaultMessage}></textarea>
						</div>
						<div className="form-group-btn">
							<button className="btn btn-blue" type="submit">Skicka utmaning</button>
							<a href="#" className="btn btn-flat btn-red" onClick={this.handleCancel}>Avbryt</a>
						</div>
					</form>
					)
				)
				:
				this.state.isFinished ?
				(
					<div>
						<h2 className="content-sub-heading">Din utmaning är skickad!</h2>
						<p>
							Du kan följa dina utmaningar <a href="/challenge/mychallenges">här</a>
						</p>					
					</div>
				)
				:
				(
					<div>
						<p>
						<button className="btn btn-green" onClick={this.handleChallenge}>Utmana andra</button>
						</p>
					</div>
				)
			);
	}

});
