

var NumberGuesser = React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
		var numberNode = this.refs.number.getDOMNode();
        var number = numberNode.value.trim();
		var isCorrect = parseInt(this.props.answer,10) === parseInt(number, 10);
		this.props.onHasAnswered(isCorrect);
	},
	render: function(){
		return(
			<form onSubmit={this.handleSubmit}>
				<p>
					<label>Skriv in ett nummer som svar</label>
				</p>
				<p>
					<input placeholder="Nummer" type="text" ref="number" />
				</p>
				<p>
					<input className="btn btn-primary" type="submit" value="Svara" />
				</p>
			</form>		
		);
	}
});

var MultiGuesser = React.createClass({
	handleGuess: function(answer){
		var isCorrect = answer === this.props.answer;
		this.props.onHasAnswered(isCorrect);
	},
	render: function(){
		var answerOptions = this.props.options.split(",").map(function(o){
			return o.toUpperCase().trim();
		});
		answerOptions.push(this.props.answer.toUpperCase());
		answerOptions = answerOptions.sort(function() { return .5 - Math.random(); });
		var answerButtons = answerOptions.map(function(option){
			return (<li><p><button className="btn" onClick={this.handleGuess.bind(this,option)}>{option}</button></p></li>);
		}.bind(this));
		
		return(
			<ol>
				{answerButtons}
			</ol>
		);
	}
});

var GameQuestion = React.createClass({
	handleHasAnswered : function(isCorrect){
		var gameQuestion = this.props.data;
		gameQuestion.isAnswered = true;
		gameQuestion.isCorrect = isCorrect;
		this.props.onHasAnswered(gameQuestion);
	},
	render: function(){
		var answer = this.props.data.question.Answer;
		var answerForms = {
			"text" : <TextGuesser answer={answer} maxwrong={2} onHasAnswered={this.handleHasAnswered} />,
			"number" : <NumberGuesser answer={answer} onHasAnswered={this.handleHasAnswered} />,
			"multi" : <MultiGuesser answer={answer} options={this.props.data.question.AnswerOptions} onHasAnswered={this.handleHasAnswered}s />
		};
		return(
			<div>
				<h2>{this.props.data.question.Name}</h2>
				<p>{this.props.data.question.Description}</p>
				{answerForms[this.props.data.question.AnswerType]}
			</div>
		);
	}
});

var QuestionGuesser = React.createClass({
	getGameQuestions : function(questions){
		var gameQuestions = [];
		questions.forEach(function(q){
			gameQuestions.push({
				question : q,
				isAnswered : false,
				isCorrect: false
			});
		});
		return gameQuestions;
	},
	componentWillReceiveProps : function(nextProps){
        this.setState({ gameQuestions : this.getGameQuestions(nextProps.gameRiddle.riddle.Questions), riddle: nextProps.gameRiddle.riddle, showQuestion: false });
    },
	getInitialState: function() {		
		return { gameQuestions : this.getGameQuestions(this.props.gameRiddle.riddle.Questions), riddle: this.props.gameRiddle.riddle, showQuestion: false };	
	},		
	handleReturn: function(){
		this.props.onReturn();
	},
	handleOpenQuestion: function(gameQuestion, event){
		event.preventDefault();
		this.setState({gameQuestion: gameQuestion, showQuestion: true});
	},
	handleHasAnswered: function(gameQuestion){
		this.setState({showQuestion: false});
	},
	handleCompleted: function(){
		var score = this.state.gameQuestions.filter(function(q){ return q.isCorrect; }).length;
		this.props.onCompleted(this.props.gameRiddle, score);
	},
	render: function(){
		var jsxList, jsxQuestion;
		var isFinished = this.state.gameQuestions.every(function(q){ return q.isAnswered; }); 		
		if(this.state.showQuestion){
			jsxQuestion = <GameQuestion data={this.state.gameQuestion} onHasAnswered={this.handleHasAnswered} />;
		}else{
			var nodes = this.state.gameQuestions.map(function(q){
				var content;
				if(q.isAnswered){
					content = <li><span className="line-through">{q.question.Name}</span> { q.isCorrect ? ":)" : ":(" }</li>;
				}else{
					content = <li><a href="#" onClick={this.handleOpenQuestion.bind(this, q)}>{q.question.Name}</a></li>;
				}
				return content;
			}.bind(this));

			jsxList = <div>
						<h2>Frågor till rebus {this.state.riddle.Name}</h2>
						<ol>
							{nodes}
						</ol>
						<hr />
						<button className="btn" onClick={this.handleReturn}>Återgå till rebuslistan</button>
					</div>;
		}	
		return(
			<div>
			{
				isFinished ? 
				<div>
					<p>
						Bra gjort du svarade på alla frågor.
					</p>					
					<button className="btn btn-lg btn-success" onClick={this.handleCompleted}>Boom!</button>
				</div> :
				<div>
					{jsxQuestion}
					{jsxList}
				</div>
			}
			</div>			
		);
	}
});