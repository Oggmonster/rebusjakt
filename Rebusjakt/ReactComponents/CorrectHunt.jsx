

var CorrectAnswer = React.createClass({
	render: function(){
		var userAnswer = this.props.gameQuestion.isCorrect ? "rätt" : "fel";		
		return (
			<div className="tile">
				<div className="tile-inner">
					<p>
						<strong>Fråga:</strong> {this.props.gameQuestion.question.Description}<br />
						<strong>Svar:</strong> {this.props.gameQuestion.question.Answer} <br />
						<small>Du svarade {userAnswer}</small> 
					</p>
				</div>
			</div>
		);
	}
});

var CorrectRiddle = React.createClass({
	render: function(){
		var questionNodes = this.props.gameRiddle.gameQuestions.map(function(gameQuestion, i){
			return <CorrectAnswer gameQuestion={gameQuestion} key={i} />;
		});
		var userAnswer = this.props.gameRiddle.isCorrect ? "rätt" : "fel";		
		return(
			<div className="col-lg-3 col-md-4 col-sm-6">
				<div className="card">
					<div className="card-main">
						<div className="card-inner">
							<p dangerouslySetInnerHTML={{__html: emojione.toImage(this.props.gameRiddle.riddle.Description)}} />
							<p><strong>Svar:</strong> {this.props.gameRiddle.riddle.Answer}<br />
							<small>Du svarade {userAnswer}</small>
							</p>
							<div className="tile-wrap">
								{questionNodes}
							</div>
						</div>
					</div>
				</div>
			</div>	
		);
	}
});

var CorrectHunt = React.createClass({
	render: function(){
		var riddleNodes = this.props.gameRiddles.map(function(gameRiddle, i){
			return <CorrectRiddle gameRiddle={gameRiddle} key={i} />;
		});
		return(
			<div className="card-wrap">
				<div className="row">        
					{riddleNodes}
				</div>
			</div>
		);
	}
});