
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
			"multi" : <MultiGuesser answer={answer} options={this.props.data.question.AnswerOptions} onHasAnswered={this.handleHasAnswered}s />,
			"trueorfalse" : <TrueOrFalseGuesser answer={answer} onHasAnswered={this.handleHasAnswered} />
		};
		return(
			<div>
				<h2 className="content-sub-heading">{this.props.data.question.Name}</h2>
				<p>{this.props.data.question.Description}</p>
				{answerForms[this.props.data.question.AnswerType]}
			</div>
		);
	}
});

var QuestionGuesser = React.createClass({
	componentWillReceiveProps : function(nextProps){
		var gameQuestions = nextProps.gameRiddle.gameQuestions;
        this.setState({ gameQuestions : gameQuestions, riddle: nextProps.gameRiddle.riddle, showQuestion: false });
    },
	getInitialState: function() {
		var gameQuestions = this.props.gameRiddle.gameQuestions;
		return { gameQuestions : gameQuestions, riddle: this.props.gameRiddle.riddle, showQuestion: false };	
	},		
	handleReturn: function(){
		var isFinished = this.state.gameQuestions.every(function(q){ return q.isAnswered; });
		if(isFinished){
			this.props.onCompleted(this.props.gameRiddle);
		}else{
			this.props.onReturn();
		}		
	},
	handleOpenQuestion: function(gameQuestion, event){
		event.preventDefault();
		this.setState({gameQuestion: gameQuestion, showQuestion: true});
	},
	handleHasAnswered: function(gameQuestion){
		this.setState({showQuestion: false});
	},
	render: function(){
		var jsxList, jsxQuestion, finishedMessage;
		var isFinished = this.state.gameQuestions.every(function(q){ return q.isAnswered; });
		
		if(isFinished){
			finishedMessage = (<div>
				<p>Bra gjort! Alla frågor besvarade <span dangerouslySetInnerHTML={{__html: emojione.toImage(":thumbsup:")}} /></p>
				<p><a href="#" onClick={this.handleReturn} >Återgå till rebuslistan</a></p></div>);
		}
		if(this.state.showQuestion){
			jsxQuestion = <GameQuestion data={this.state.gameQuestion} onHasAnswered={this.handleHasAnswered} />;
		}else{
			var nodes = this.state.gameQuestions.map(function(q){
				var actions, cardClass = "card";
				if(q.isAnswered){
					cardClass += q.isCorrect ? " card-green-bg" : " card-red-bg";
				}else{
					actions = <a href="#" onClick={this.handleOpenQuestion.bind(this, q)}><span className="text-blue">Svara</span></a>;
				}
				return (
					<div className="col-lg-3 col-md-4 col-sm-6">
						<div className={cardClass}>
							<div className="card-main">
								<div className="card-inner">
									<p>{q.question.Description}</p>
								</div>
								<div className="card-action">
									<ul className="nav nav-list pull-left">
										<li>{actions}</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				);
			}.bind(this));

			jsxList = <div>
						<h2 className="content-sub-heading">Frågor till rebus {this.state.riddle.Name}</h2>
						<div className="card-wrap">
							<div className="row">    
								{nodes}   
							</div>
						</div>   
						<p>
							<a href="#" onClick={this.handleReturn}>Återgå till rebuslistan</a>
						</p>
					</div>;
		}	
		return(
			<div>
			{
				<div>
					{finishedMessage}
					{jsxQuestion}
					{jsxList}
				</div>
			}
			</div>			
		);
	}
});