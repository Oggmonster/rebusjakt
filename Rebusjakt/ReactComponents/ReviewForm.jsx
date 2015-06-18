
var ReviewForm = React.createClass({
	handleSubmit: function(event){
		event.preventDefault();
		var huntReview = {
			Description : this.refs.description.getDOMNode().value,
			IsPositive : this.state.isUpVote
		};
		this.props.onSubmit(huntReview);
	},
	handleVote: function(isUpVote, event){
		event.preventDefault();
		this.setState({isUpVote: isUpVote});
	},
	getInitialState: function(){
		return {isUpVote : true};
	},
	render: function(){
		var voteText = this.state.isUpVote ? "Toppen!" : "meh";
		var upStyle = this.state.isUpVote ? {fontSize:"1.5em"} : {};
		var downStyle = this.state.isUpVote ? {} : {fontSize:"1.5em"};
		return(
		<div className="card-wrap">
			<div className="row">
			<div className="col-lg-6 col-md-8 col-sm-10">
			<div className="card">
				<div className="card-main">
				<div className="card-inner">
					<p className="card-heading text-alt">Vad tyckte du?</p>				
					<p>{voteText}</p>
					<a href="#" style={upStyle} onClick={this.handleVote.bind(null, true)}><span dangerouslySetInnerHTML={{__html: emojione.toImage(":thumbsup:")}} /></a>
					&nbsp; &nbsp; &nbsp; &nbsp;
					<a href="#" style={downStyle} onClick={this.handleVote.bind(null, false)} ><span dangerouslySetInnerHTML={{__html: emojione.toImage(":thumbsdown:")}} /></a>
					<div className="form-group">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<label>Kommentar</label>
								<textarea rows="3" cols="30" className="form-control form-control-default" name="Description" ref="description"></textarea>
							</div>
						</div>
					</div>
					<p>
						<a href="#" onClick={this.handleSubmit} className="btn btn-blue">Skicka</a>
					</p>
				</div>
				</div>
			</div>
			</div>
			</div>
		</div>
		);
	}
});