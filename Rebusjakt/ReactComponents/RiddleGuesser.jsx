    

    var Riddle = React.createClass({        
        render: function(){
            return(
                <div>
                    <h3>{this.props.data.Name}</h3>
                    <p>{this.props.data.Description}</p>                    
                 </div>
                );
        }
    });

    var RiddleEndGame = React.createClass({
		completedGuessing: function(){
			this.props.onSolved(this.props.isWinner);
		},
        render: function(){
            return(
                <div>
                    {
                        this.props.isWinner ? 
                        <div>
                            <h4>Bra där du gissade rätt</h4>
                            <p>
                                Kartan nedan visar platsen där du hittar dina frågor.
                            </p>
							<button className="btn" onClick={this.completedGuessing}>Återgå till rebuslistan</button>
                            <GoogleMap lat={this.props.riddle.Latitude} lng={this.props.riddle.Longitude} />
                        </div> : 
                        <div>
                            <h4>Tss tss, inte ens nära.</h4>
							<button className="btn" onClick={this.completedGuessing}>Återgå till rebuslistan</button>
                        </div>
                    }
                </div>
                );
        }
    });


    var RiddleGuesser = React.createClass({
        handleHasAnswered : function(isCorrect) {
            this.setState({ isOver : true, isWinner : isCorrect });
        },
        handleGuess : function(guess){
            //check if wrong guess - and check against no of wrong guesses
            guess = guess.toUpperCase();
            var guessCount = this.state.guesscount;
            guessCount++;
            var guesses = this.state.guesses;
            guesses.push(guess);
            var guessWord = this.state.guessword;
            var answer = this.state.riddle.Answer;
            var wrongcount = this.state.wrongcount;
            if(guess.length > 1){
                if(guess === answer){
                    this.endGuessing(true);
                    return false;
                }else{
                    wrongcount++;
                }
            }else{
                var guessWordChars = guessWord.split('');
                var answerChars = answer.split('');
                var hasHit = false;
                for(var i = 0; i < answer.length; i++){
                    if(answer[i] === guess){
                        guessWordChars[i] = guess;
                        hasHit = true;
                    }                        
                }
                if(!hasHit)
                    wrongcount++;

                guessWord = guessWordChars.join('');
            }
            if(guessWord === answer){
                this.endGuessing(true);
                return false;
            }
            if(wrongcount >= this.props.maxwrong){
                this.endGuessing(false);
                return false;
            }
            this.setState({guesscount:guessCount, wrongcount: wrongcount, guessword: guessWord, guesses : guesses, isOver : false });
        },
        
		handleSolved: function(isWinner){
			var gameRiddle = this.state.gameRiddle;
			gameRiddle.isSolved = true;
			gameRiddle.isCorrect = isWinner;
			this.props.onSolved(gameRiddle);
		},
		handleReturn: function(){
			this.props.onReturn();
		},
        componentWillReceiveProps : function(nextProps){
			var riddle = nextProps.gameRiddle.riddle;
            this.setState({ gameRiddle: nextProps.gameRiddle, riddle: riddle, isOver: false });
        },
        getInitialState: function() {
			var riddle = this.props.gameRiddle.riddle;
            return { gameRiddle: this.props.gameRiddle, riddle: riddle, isOver : false };
        },
        render: function () { 
                
                return (
                    <div className="riddle-guesser">
                        { 
                            this.state.isOver ? 
                            <RiddleEndGame isWinner={this.state.isWinner} riddle={this.state.riddle} onSolved={this.handleSolved} /> : 
                            <div>
                                <Riddle data={this.state.riddle}  />                                
                                <TextGuesser answer={this.state.riddle.Answer} maxwrong={2} onHasAnswered={this.handleHasAnswered} />
								<hr />
								<button className="btn" onClick={this.handleReturn}>Återgå till rebuslistan</button>
                            </div>
                        }
                        
                    </div>                
                );
        }
    });
   