
var TrueOrFalseGuesser = React.createClass({
	handleGuess: function(answer){
		var isCorrect = this.props.answer.toUpperCase() === answer.toUpperCase();
		this.props.onHasAnswered(isCorrect);
	},
	render: function(){
		return (
			<div>
				<button className="btn btn-green" onClick={this.handleGuess.bind(null, "true")}>Sant</button> eller <button className="btn btn-red" onClick={this.handleGuess.bind(null, "false")}>Falskt</button>
			</div>
		);
	}
});

