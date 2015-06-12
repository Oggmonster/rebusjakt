
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
		var nodes = this.props.data.map(function(gameRiddle, i){			
			return (<GameRiddle key={i} gameRiddle={gameRiddle} onRiddleOpen={this.handleRiddleOpen} onCollectQuestions={this.handleCollectQuestions} onAnswerQuestions={this.handleAnswerQuestions} />);		
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
	showContentContainer: function(){
		$("#game-container").hide();
		$("#content-container").show();
	},
	hideContentContainer: function(){
		$("#game-container").show();
		$("#content-container").hide();
	},
	handleRiddleSolved: function(gameRiddle){		
		this.save();
		this.hideContentContainer();
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleReturn: function(){
		this.save();
		this.hideContentContainer();
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleRiddleOpen: function(gameRiddle){
		this.showContentContainer();
		React.render(<RiddleGuesser gameRiddle={gameRiddle} maxwrong={3} onReturn={this.handleReturn} onSolved={this.handleRiddleSolved} onSave={this.save}  />, document.getElementById("content-container"));
	},
	handleQuestionsCollected: function(gameRiddle){
		if(gameRiddle){
			this.save();
			this.handleAnswerQuestions(gameRiddle);
		}else{
			this.handleReturn();
		}
	},
	handleCollectQuestions: function(gameRiddle){
		this.showContentContainer();
		React.render(<div><LocationChecker gameRiddle={gameRiddle} onReturn={this.handleQuestionsCollected} /><a href="#" className="btn btn-flat btn-blue" onClick={this.handleReturn}>Tillbaka</a></div>, document.getElementById("content-container"));
	},	
	handleAnswerQuestions: function(gameRiddle){
		this.showContentContainer();
		React.render(<QuestionGuesser gameRiddle={gameRiddle} onReturn={this.handleReturn} onCompleted={this.handleQuestionsCompleted} onSave={this.save} />, document.getElementById("content-container"));
	},
	handleQuestionsCompleted: function(gameRiddle){
		this.hideContentContainer();
		gameRiddle.isCompleted = true;
		this.save();
		var gameRiddles = this.state.data;
		this.setState({data: gameRiddles});
	},
	handleShowMap: function(){
		this.showContentContainer();
		var positions = this.state.data.filter(function(gameRiddle){
			return gameRiddle.isCorrect;
		}).map(function(gameRiddle){
			return {
				lat: gameRiddle.riddle.Latitude,
				lng: gameRiddle.riddle.Longitude,
				name: gameRiddle.riddle.LocationName
			};
		});
		var first = positions.shift();
		React.render(<div><GoogleMap positions={positions} lat={first.lat} lng={first.lng} /><a href="#" className="btn btn-flat btn-blue" onClick={this.handleReturn}>Tillbaka</a></div>, document.getElementById("content-container"));
	},
	handleTimeIsUp : function(){
		this.setState({timeIsUp: true});
	},
	handleNewPositions : function(){
		var master = this.state.master;
		var gameRiddles = master.gameRiddles;
		this.setState({master : master, data: gameRiddles, total: gameRiddles.length});
	},
	handleReviewSubmit : function(huntReview){
		huntReview.HuntId = this.state.master.huntId;
		huntReview.UserId = this.state.master.userId;
		$.post("/game/addreview",huntReview, function(response){
			//console.log(response);
		},"json");
		this.setState({hasReview:true});
	},
	handleReachedFinish : function(){
		var self = this;
		this.state.master.finish(function(response){
			self.setState({isFinished: true, scoreMessage: response });
		});
	},
	getInitialState: function() {
		var gameRiddles = this.props.gameMaster.gameRiddles;
		return { master: this.props.gameMaster, data: gameMaster.gameRiddles, total: gameRiddles.length };
    },
	render: function(){
		var countDowntimer, mapButton, reviewForm, reviewThanks, scoreMessage = <p>{this.state.scoreMessage}</p>, endMessage = "Snyggt du har klarat alla rebusar!";
		var marginStyle = { marginLeft : '20px'}, backUrl = "/jakt/" + this.state.master.huntId;
		var hasCorrectRiddles = this.state.data.filter(function(r){ return r.isCorrect; }).length > 0;
		var allCompleted = this.state.data.every(function(r){ return r.isCompleted });
		var isCompleted = allCompleted || this.state.timeIsUp;
		var mustPickPositions = this.state.master.isRandom && !this.state.master.hasNewLocations;	
		if(this.state.master.duration > 0){
			if(this.state.timeIsUp){
				endMessage = "Tiden är slut!";
			}
			countDowntimer = <CountDownTimer duration={this.state.master.duration} started={this.state.master.started} onTimeIsUp={this.handleTimeIsUp} />;
		}
		if(hasCorrectRiddles){
			mapButton = <button onClick={this.handleShowMap} className="btn btn-blue" style={marginStyle}><span className="icon icon-place"></span> Visa karta</button>;
		}
		if(this.state.hasReview){
			reviewThanks = <p>Tack för ditt betyg!</p>;
		}else{
			reviewForm = <ReviewForm onSubmit={this.handleReviewSubmit} />;
		}
		return (
		<div>
		{
			isCompleted ? 
				this.state.isFinished ? 
				(
				<div>
					
					<h2 className="content-sub-heading">Ditt resultat är {this.state.master.score()} p med tiden {this.state.master.endTime}</h2>
					{scoreMessage}
					<p>
						<strong><span dangerouslySetInnerHTML={{__html: emojione.toImage(":camera:")}} />  bonusuppdrag (frivilligt)</strong><br /> Ta en bild på platsen där ni befinner er och ladda upp till Instagram med hashtagen #rebusjakt
					</p>
					<a className="btn collapsed waves-button waves-effect" data-toggle="collapse" href="#collapsible-correct-hunt" >
						<span className="collapsed-hide">Dölj</span>
						<span className="collapsed-show">Visa rätta svar</span>
					</a>	
					<div className="collapsible-region collapse" id="collapsible-correct-hunt">
						<CorrectHunt gameRiddles={this.state.data} />
					</div>	
					{reviewForm}
					{reviewThanks}
					<p>
						<a href={backUrl} className="btn">Avsluta</a>
					</p>
				</div>
				)
				:
				(<div>
					<h2 className="content-sub-heading">{endMessage}</h2>
					<LocationChecker gameRiddle={this.state.master.endGameRiddle} onReturn={this.handleReachedFinish} />
				</div>
				) 
			:
			mustPickPositions ? 
				(
					<div>
						<NewLocationsPicker master={this.state.master} onFinished={this.handleNewPositions} />
					</div>
				)
				:
				(<div>
					<p>
						{countDowntimer} {mapButton}		 
					</p>
					<hr />
					<GameRiddleList data={this.state.data} onRiddleOpen={this.handleRiddleOpen} onCollectQuestions={this.handleCollectQuestions} onAnswerQuestions={this.handleAnswerQuestions} />
				</div>
				)
		}
		</div>
		);
	}
});

var gameMaster = new GameMaster(huntData);
React.render(<GameApp gameMaster={gameMaster} />, document.getElementById("game-container"));
