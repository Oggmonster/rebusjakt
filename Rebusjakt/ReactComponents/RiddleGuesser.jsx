    

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
                            <h2 className="content-sub-heading">Bra där du gissade rätt</h2>
							<p>
								Bege dig till <strong>{this.props.riddle.LocationName}</strong> för att hämta rebusens frågor.
                            </p>   
                            <a href="#" className="btn btn-flat btn-blue" onClick={this.completedGuessing}><span className="icon icon-chevron-left"></span>Återgå till rebuslistan</a>                        
                            <GoogleMap lat={this.props.riddle.Latitude} lng={this.props.riddle.Longitude} />
							
                        </div> : 
                        <div>
                            <h2 className="content-sub-heading">Tyvärr det var fel</h2>
							<p dangerouslySetInnerHTML={{__html: emojione.toImage(":worried:")}} />
							<a href="#" className="btn btn-flat btn-blue" onClick={this.completedGuessing}><span className="icon icon-chevron-left"></span>Återgå till rebuslistan</a>
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
		handleSolved: function(isWinner){
			var gameRiddle = this.state.gameRiddle;
			gameRiddle.isSolved = true;
			gameRiddle.isCorrect = isWinner;
			if(!isWinner){
				gameRiddle.isCompleted = true;
			}
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
                    <div>
                        { 
                            this.state.isOver ? 
                            <RiddleEndGame isWinner={this.state.isWinner} riddle={this.state.riddle} onSolved={this.handleSolved} /> : 
                            <div>
								<h2 className="content-sub-heading">Lös rebus</h2>
								<p dangerouslySetInnerHTML={{__html: emojione.toImage(this.state.riddle.Description)}} />
                                <TextGuesser answer={this.state.riddle.Answer} wrongGuesses={this.state.gameRiddle.wrongGuesses} correctGuesses={this.state.gameRiddle.correctGuesses} maxwrong={this.props.maxwrong} onHasAnswered={this.handleHasAnswered} onSave={this.props.onSave} />
								<p>
									<a href="#" onClick={this.handleReturn} className="btn btn-flat btn-blue"><span className="icon icon-chevron-left"></span>Återgå till rebuslistan</a>
								</p>
                            </div>
                        }
                        
                    </div>                
                );
        }
    });
   