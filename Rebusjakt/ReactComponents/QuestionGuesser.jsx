
var GameQuestion = React.createClass({
	handleHasAnswered : function(isCorrect){
		var gameQuestion = this.props.data;
		gameQuestion.isAnswered = true;
		gameQuestion.isCorrect = isCorrect;
		this.props.onSave();
		this.props.onHasAnswered(gameQuestion);
	},
	render: function(){
		var answer = this.props.data.question.Answer;
		var answerForms = {
			"text" : <TextGuesser answer={answer} wrongGuesses={this.props.data.wrongGuesses} correctGuesses={this.props.data.correctGuesses} maxwrong={3} onHasAnswered={this.handleHasAnswered} onSave={this.props.onSave} />,
			"number" : <NumberGuesser answer={answer} onHasAnswered={this.handleHasAnswered} />,
			"multi" : <MultiGuesser answer={answer} options={this.props.data.question.AnswerOptions} onHasAnswered={this.handleHasAnswered}s />,
			"trueorfalse" : <TrueOrFalseGuesser answer={answer} onHasAnswered={this.handleHasAnswered} />
		};
		var img;
		if(this.props.data.question.ImageSrc){
			img = <p><img src={this.props.data.question.ImageSrc} /></p>;
		}
		return(
			<div>
				{img}
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
			finishedMessage = <p><span dangerouslySetInnerHTML={{__html: emojione.toImage(":thumbsup:")}} /> Alla frågor besvarade. Du kan återgå till rebuslistan.</p>;
		}
		if(this.state.showQuestion){
			jsxQuestion = <GameQuestion data={this.state.gameQuestion} onHasAnswered={this.handleHasAnswered} onSave={this.props.onSave} />;
		}else{
			var nodes = this.state.gameQuestions.map(function(q){
				var actions, img, cardClass = "card";
				if(q.isAnswered){
					cardClass += q.isCorrect ? " card-green-bg" : " card-red-bg";
				}else{
					actions = <p><a href="#" onClick={this.handleOpenQuestion.bind(this, q)} className="btn btn-green">Svara</a></p>;
				}
				if(q.question.ImageSrc){
					img = <div class="card-img">
							<img  src={q.question.ImageSrc} />
						</div>;
				}
				return (
					<div className="col-lg-3 col-md-4 col-sm-6">
						<div className={cardClass}>
							<div className="card-main">
								{img}
								<div className="card-inner">
									<p>{q.question.Description}</p>
									{actions}
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
						{finishedMessage}
						<a href="#" onClick={this.handleReturn} className="btn btn-flat btn-blue"><span className="icon icon-chevron-left"></span>Återgå till rebuslistan</a>
					</div>;
		}	
		return(
			<div>
			{
				<div>
					{jsxQuestion}
					{jsxList}
				</div>
			}
			</div>			
		);
	}
});