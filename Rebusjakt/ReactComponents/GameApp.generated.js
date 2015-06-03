﻿// @hash v2-AED261FC8EDF2D479CA58733B1C327A9
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 1.5.2 (build 05eb7cc)
// Generated at: 2015-06-02 15:24:31
///////////////////////////////////////////////////////////////////////////////

var GameRiddle = React.createClass({displayName: "GameRiddle",
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
					extraContent = React.createElement("p", null, React.createElement("strong", null, unAnswered, " st obesvarade frågor"));
					actions = React.createElement("a", {href: "#", onClick: this.handleAnswerQuestions}, React.createElement("span", {className: "text-blue"}, "Svara på frågor"));
				}else{
					extraContent = React.createElement("p", null, React.createElement("span", {className: "icon icon-place alt-text"}), " Frågorna finns vid ", gameRiddle.riddle.LocationName);
					actions = React.createElement("a", {href: "#", onClick: this.handleCollectQuestions}, React.createElement("span", {className: "text-blue"}, "Hämta frågor"));
				}
			}
		}else{
			actions = React.createElement("a", {href: "#", onClick: this.handleOpenRiddle}, React.createElement("span", {className: "text-blue"}, "Lös rebus"));
		}
		return (
				React.createElement("div", {className: "col-lg-3 col-md-4 col-sm-6"}, 
					React.createElement("div", {className: cardClass}, 
						React.createElement("div", {className: "card-main"}, 
							React.createElement("div", {className: "card-inner"}, 
								React.createElement("p", {dangerouslySetInnerHTML: {__html: emojione.toImage(gameRiddle.riddle.Description)}}), 
								extraContent
							), 
							React.createElement("div", {className: "card-action"}, 
								React.createElement("ul", {className: "nav nav-list pull-left"}, 
									React.createElement("li", null, actions)
								)
							)
						)						
					)
				)					
		);	 
	}
});

var GameRiddleList = React.createClass({displayName: "GameRiddleList",
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
			return (React.createElement(GameRiddle, {key: i, gameRiddle: gameRiddle, onRiddleOpen: this.handleRiddleOpen, onCollectQuestions: this.handleCollectQuestions, onAnswerQuestions: this.handleAnswerQuestions}));		
		}.bind(this));
		return (
			 React.createElement("div", {className: "card-wrap"}, 
				React.createElement("div", {className: "row"}, 
					nodes
				)
            )	
		);
	}
});

var GameApp = React.createClass({displayName: "GameApp",
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
		React.render(React.createElement(RiddleGuesser, {gameRiddle: gameRiddle, maxwrong: 3, onReturn: this.handleReturn, onSolved: this.handleRiddleSolved}), document.getElementById("content-container"));
	},
	handleCollectQuestions: function(gameRiddle){
		this.showContentContainer();
		React.render(React.createElement(LocationChecker, {gameRiddle: gameRiddle, onReturn: this.handleReturn}), document.getElementById("content-container"));
	},	
	handleAnswerQuestions: function(gameRiddle){
		this.showContentContainer();
		React.render(React.createElement(QuestionGuesser, {gameRiddle: gameRiddle, onReturn: this.handleReturn, onCompleted: this.handleQuestionsCompleted}), document.getElementById("content-container"));
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
		React.render(React.createElement("div", null, React.createElement(GoogleMap, {positions: positions, lat: first.lat, lng: first.lng}), React.createElement("a", {href: "#", onClick: this.handleReturn}, "Tillbaka")), document.getElementById("content-container"));
	},
	handleTimeIsUp : function(){
		this.setState({timeIsUp: true});
	},
	handleReachedFinish : function(){
		var self = this;
		this.state.master.finish(function(response){
			console.log(response);
			self.setState({isFinished: true});
		});
	},
	getInitialState: function() {
		var gameRiddles = this.props.gameMaster.gameRiddles;
		return { master: this.props.gameMaster, data: gameMaster.gameRiddles, total: gameRiddles.length };
    },
	render: function(){
		var countDowntimer, mapButton, endMessage = "Snyggt du har klarat alla rebusar!";
		var marginStyle = { marginLeft : '20px'}
		var solvedCount = this.state.data.filter(function(r){ return r.isSolved; }).length;
		var hasCorrectRiddles = this.state.data.filter(function(r){ return r.isCorrect; }).length > 0;
		var allCompleted = this.state.data.every(function(r){ return r.isCompleted });
		var isCompleted = allCompleted || this.state.timeIsUp ;	
		if(this.state.master.duration > 0){
			if(this.state.timeIsUp){
				endMessage = "Tiden är slut!";
			}
			countDowntimer = React.createElement(CountDownTimer, {duration: this.state.master.duration, started: this.state.master.started, onTimeIsUp: this.handleTimeIsUp});
		}
		if(hasCorrectRiddles){
			mapButton = React.createElement("button", {onClick: this.handleShowMap, className: "btn btn-blue", style: marginStyle}, React.createElement("span", {className: "icon icon-place"}), " Visa karta");
		}
		return (
		React.createElement("div", null, 
		
			isCompleted ? 
			this.state.isFinished ? 
			(
			React.createElement("div", null, 
				React.createElement("p", null, "Ditt resultat ", this.state.master.score(), " p"), 
				React.createElement("p", null, 
					"För att föreviga ögonblicket får ni gärna ta en lagbild och ladda upp till Instagram med hashtagen #rebusjakt."
				), 
				React.createElement("a", {className: "btn collapsed waves-button waves-effect", "data-toggle": "collapse", href: "#collapsible-correct-hunt"}, 
					React.createElement("span", {className: "collapsed-hide"}, "Dölj"), 
					React.createElement("span", {className: "collapsed-show"}, "Visa rätta svar")
				), 	
				React.createElement("div", {className: "collapsible-region collapse", id: "collapsible-correct-hunt"}, 
					React.createElement(CorrectHunt, {gameRiddles: this.state.data})
				), 	
				React.createElement(ReviewForm, null)
			)
			)
			:
			(React.createElement("div", null, 
				React.createElement("h2", {className: "content-sub-heading"}, endMessage), 
				React.createElement("p", null, "Bege dig till målet!"), 
				React.createElement(LocationChecker, {gameRiddle: this.state.master.endGameRiddle, onReturn: this.handleReachedFinish})
			)) :
			(React.createElement("div", null, 
				React.createElement("p", null, 
				countDowntimer, 				
				React.createElement("span", {className: "alt-text text-green", style: marginStyle}, 
					solvedCount, " av ", this.state.total, " rebusar avklarade."
				), 
				mapButton
				), 
				React.createElement("hr", null), 
				React.createElement(GameRiddleList, {data: this.state.data, onRiddleOpen: this.handleRiddleOpen, onCollectQuestions: this.handleCollectQuestions, onAnswerQuestions: this.handleAnswerQuestions})
			))
		
		)
		);
	}
});

var gameMaster = new GameMaster(huntData);
React.render(React.createElement(GameApp, {gameMaster: gameMaster}), document.getElementById("game-container"));