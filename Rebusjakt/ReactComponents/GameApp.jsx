
var GameRiddle = React.createClass({
	handleOpenRiddle : function(e){
		e.preventDefault();
		this.props.onRiddleOpen(this.props.gameRiddle);
	},
	handleAnswerQuestions: function(){
		this.props.onAnswerQuestions(this.props.gameRiddle);
	},
	handleCollectQuestions: function(){
		this.props.onCollectQuestions(this.props.gameRiddle);
	},
	render: function(){
		var content, gameRiddle = this.props.gameRiddle;
		if(gameRiddle.isSolved){
			if(gameRiddle.isCorrect){
				var questionButton, questions;
				if(gameRiddle.hasQuestions){
					questions = <p>{gameRiddle.riddle.Questions.length} frågor</p>;
					questionButton = gameRiddle.isCompleted ? <strong>Klar!</strong> : <button className="btn btn-small" onClick={this.handleAnswerQuestions}>Svara på frågor</button>;
				}else {
					questionButton = <button className="btn btn-small" onClick={this.handleCollectQuestions}>Hämta frågor</button>;
				}
				content = <div>
						{gameRiddle.riddle.Name} 
						{questions}
						<p>
							{questionButton}
						</p>
					</div>;
			}else{
				content = <div className="line-through">{gameRiddle.riddle.Name}</div>;
			}
		}else{
			content = <div><a href="#" onClick={this.handleOpenRiddle}>{gameRiddle.riddle.Name}</a></div>;
		}
		return content;		 
	}
});

var GameRiddleList = React.createClass({
	handleCollectQuestions: function(gameRiddle){
		this.props.onCollectQuestions(gameRiddle);
	},
	handleAnswerQuestions: function(gameRiddle){
		this.props.onAnswerQuestions(gameRiddle);
	},
	handleRiddleOpen : function(gameRiddle){
		this.props.onRiddleOpen(gameRiddle);
	},
	render: function(){
		var nodes = this.props.data.map(function(gameRiddle){			
			return(<li><GameRiddle gameRiddle={gameRiddle} onRiddleOpen={this.handleRiddleOpen} onCollectQuestions={this.handleCollectQuestions} onAnswerQuestions={this.handleAnswerQuestions} /><hr/></li>);		
		}.bind(this));
		return (
			<ul className="list-unstyled">
				{nodes}
			</ul>
		);
	}
});

var GameApp = React.createClass({
	handleRiddleSolved: function(gameRiddle){
		var gameRiddles = this.state.data;
		$("#game-container").show();
		$("#riddle-container").hide();
		gameRiddles = gameRiddles.sort(function(a,b){
			if(a.isSolved)
				return -1;
			else if(b.isSolved)
				return 1;
			else
				return 0;
		});
		this.setState({data: gameRiddles});
	},
	handleReturn: function(){
		$("#game-container").show();
		$("#content-container").hide();
	},
	handleRiddleOpen: function(gameRiddle){
		$("#game-container").hide();
		$("#content-container").show();
		React.render(<RiddleGuesser gameRiddle={gameRiddle} maxwrong={3} onReturn={this.handleReturn} onSolved={this.handleRiddleSolved}  />, document.getElementById("content-container"));
	},
	handleCollectQuestions: function(gameRiddle){
		gameRiddle.hasQuestions = true;
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleAnswerQuestions: function(gameRiddle){
		$("#game-container").hide();
		$("#content-container").show();
		React.render(<QuestionGuesser gameRiddle={gameRiddle} onReturn={this.handleReturn} onCompleted={this.handleQuestionsCompleted} />, document.getElementById("content-container"));
	},
	handleQuestionsCompleted: function(gameRiddle, score){
		$("#game-container").show();
		$("#content-container").hide();
		gameRiddle.isCompleted = true;
		gameRiddle.score = score;
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	getInitialState: function() {
		var riddles = this.props.initialData;
		var gameRiddles = [];
		riddles.forEach(function(riddle){
			gameRiddles.push({
				riddle: riddle,
				isSolved: false,
				hasQuestions: false,
				isCorrect: false,
				score: 0,
				isCompleted: false
			});
		});
		return { data: gameRiddles, total: gameRiddles.length };
    },
	render: function(){
		var solvedCount = this.state.data.filter(function(r){ return r.isSolved; }).length;
		var isFinished = this.state.data.every(function(r){ return r.isCompleted });
		var score = 0;
		console.log(this.state.data);		
		score = this.state.data.reduce(function(p,c){ 	
			console.log("p");
			console.log(p);
			console.log(c);
			if(!p)
				p = 0;

			return p + parseInt(c.score, 10); 
		});
		if(isFinished){
			score = this.state.data.reduce(function(a,b){ return a.score + b.score; });
		}
		return (
		<div>
		{
			isFinished ? 
			<div>
				<h2>Snyggt du har klarat alla rebusar!</h2>
				<p>
					Din poäng är {score}
				</p>
			</div> :
			<div>
				<h1>Game on</h1>	
				<p>
					{solvedCount} av {this.state.total} rebusar avklarade.
				</p>
				<p>
					poäng {score}
				</p>
				<hr />
				<GameRiddleList data={this.state.data} onRiddleOpen={this.handleRiddleOpen} onCollectQuestions={this.handleCollectQuestions} onAnswerQuestions={this.handleAnswerQuestions} />
			</div>
		}
		</div>
		);
	}
});

React.render(<GameApp initialData={huntData.Riddles} huntId={huntData.HuntId} />, document.getElementById("game-container"));
