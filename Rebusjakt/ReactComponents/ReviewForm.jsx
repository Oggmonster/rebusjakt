
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
		var voteText = this.state.isUpVote ? "Toppen!" : "Botten!";
		var upStyle = this.state.isUpVote ? {fontSize:"1.5em"} : {};
		var downStyle = this.state.isUpVote ? {} : {fontSize:"1.5em"};
		return(
		<div>
			<h2 className="content-sub-heading">Vad tyckte du?</h2>
			<form onSubmit={this.handleSubmit}>
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
				<div className="form-group-btn">
					<div className="row">
						<div className="col-lg-6 col-md-8 col-sm-10">
							<button className="btn btn-blue waves-button waves-light waves-effect" type="submit">Skicka</button>
						</div>
					</div>
				</div>

			</form>
		</div>
		);
	}
});