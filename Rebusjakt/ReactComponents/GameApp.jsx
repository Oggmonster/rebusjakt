
var GameRiddle = React.createClass({
	handleOpenRiddle : function(e){
		e.preventDefault();
		this.props.onRiddleOpen(this.props.gameRiddle);
	},
	handleAnswerQuestions: function(e){
		e.preventDefault();
		this.props.onAnswerQuestions(this.props.gameRiddle);
	},
	handleCollectQuestions: function(e){
		e.preventDefault();
		this.props.onCollectQuestions(this.props.gameRiddle);
	},
	render: function(){
		var actions, extraContent, gameRiddle = this.props.gameRiddle, cardClass = "card";
		if(gameRiddle.isSolved){
			if(gameRiddle.isCompleted && gameRiddle.isCorrect){
				cardClass += " card-green-bg";
			}else if(!gameRiddle.isCorrect){
				cardClass += " card-red-bg";
			} else {
				if(gameRiddle.hasQuestions){
					var unAnswered = gameRiddle.gameQuestions.filter(function(q){ return !q.isAnswered; }).length;
					extraContent = <p><strong>{unAnswered} st obesvarade frågor</strong></p>;
					actions = <a href="#"  onClick={this.handleAnswerQuestions}><span className="text-blue">Svara på frågor</span></a>;
				}else{
					extraContent = <p><span className="icon icon-place alt-text"></span> Frågorna finns vid {gameRiddle.riddle.LocationName}</p>;
					actions = <a href="#" onClick={this.handleCollectQuestions}><span className="text-blue">Hämta frågor</span></a>;
				}
			}
		}else{
			actions = <a href="#" onClick={this.handleOpenRiddle}><span className="text-blue">Lös rebus</span></a>;
		}
		return (
				<div className="col-lg-3 col-md-4 col-sm-6">
					<div className={cardClass}>
						<div className="card-main">
							<div className="card-inner">
								<p dangerouslySetInnerHTML={{__html: emojione.toImage(gameRiddle.riddle.Description)}} />
								{extraContent}
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
			return (<GameRiddle gameRiddle={gameRiddle} onRiddleOpen={this.handleRiddleOpen} onCollectQuestions={this.handleCollectQuestions} onAnswerQuestions={this.handleAnswerQuestions} />);		
		}.bind(this));
		return (
			 <div className="card-wrap">
				<div className="row">          
					{nodes}
				</div>
            </div>	
		);
	}
});

var GameApp = React.createClass({
	save : function(){
		this.state.master.save();
	},
	handleRiddleSolved: function(gameRiddle){
		
		this.save();
		$("#game-container").show();
		$("#content-container").hide();
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleReturn: function(){
		this.save();
		$("#game-container").show();
		$("#content-container").hide();
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleRiddleOpen: function(gameRiddle){
		$("#game-container").hide();
		$("#content-container").show();
		React.render(<RiddleGuesser gameRiddle={gameRiddle} maxwrong={3} onReturn={this.handleReturn} onSolved={this.handleRiddleSolved}  />, document.getElementById("content-container"));
	},
	handleCollectQuestions: function(gameRiddle){
		$("#game-container").hide();
		$("#content-container").show();
		React.render(<LocationChecker gameRiddle={gameRiddle} onReturn={this.handleReturn} />, document.getElementById("content-container"));
	},	
	handleAnswerQuestions: function(gameRiddle){
		$("#game-container").hide();
		$("#content-container").show();
		React.render(<QuestionGuesser gameRiddle={gameRiddle} onReturn={this.handleReturn} onCompleted={this.handleQuestionsCompleted} />, document.getElementById("content-container"));
	},
	handleQuestionsCompleted: function(gameRiddle){
		$("#game-container").show();
		$("#content-container").hide();
		gameRiddle.isCompleted = true;
		this.save();
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleGiveUp(e){
		e.preventDefault();
		if(confirm("Är du säker på att du vill avsluta?")){
			this.state.master.finish();
		}		
	},
	getInitialState: function() {
		var gameRiddles = this.props.gameMaster.gameRiddles;
		return { master: this.props.gameMaster, data: gameMaster.gameRiddles, total: gameRiddles.length };
    },
	render: function(){
		var solvedCount = this.state.data.filter(function(r){ return r.isSolved; }).length;
		var isFinished = this.state.data.every(function(r){ return r.isCompleted });	
		return (
		<div>
		{
			isFinished ? 
			<div>
				<h2 className="content-sub-heading">Snyggt du har klarat alla rebusar!</h2>
				<p>Ditt resultat {this.state.master.score()}p</p>
				<p>
					<a href="#" onClick={this.handleGiveUp}>Nollställ</a>
				</p>
			</div> :
			<div>
				<h2 className="content-sub-heading">
					{solvedCount} av {this.state.total} rebusar avklarade.
				</h2>
				<hr />
				<GameRiddleList data={this.state.data} onRiddleOpen={this.handleRiddleOpen} onCollectQuestions={this.handleCollectQuestions} onAnswerQuestions={this.handleAnswerQuestions} />
			</div>
		}
		</div>
		);
	}
});

var gameMaster = new GameMaster(huntData.Riddles, huntData.HuntId);

React.render(<GameApp gameMaster={gameMaster} />, document.getElementById("game-container"));
