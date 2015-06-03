var TextGuessingResult = React.createClass({
    render: function(){        
        var styling = {letterSpacing:'5px', fontSize:'1.5em'};
		var wrongWords, wrongGuessesLeft;
		if(this.props.wrongGuesses.length > 0){
			wrongGuessesLeft = this.props.maxwrong - this.props.wrongGuesses.length;
			var guessNodes = this.props.wrongGuesses.map(function(word, i){
				return(
						<div key={i} className="tile tile-red"><div className="tile-inner">{word}</div></div>
					);
			});
			wrongWords = (<div className="tile-wrap">
							{guessNodes}
							<div className="tile"><div className="tile-inner">Du kan gissa fel <strong>{wrongGuessesLeft}</strong> ggr till</div></div>
						</div>);
		}
        return(
            <div>
                <label style={styling}>{this.props.guessword}</label>
                {wrongWords}
            </div>
            );
    }
});

var TextGuessingForm = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        var guessNode = this.refs.guess.getDOMNode();
        var guess = guessNode.value.trim();
        this.props.onGuess(guess);
        guessNode.value = '';
    },
	componentDidUpdate: function(){
		$(".txt-guess").focus();
	},
    render: function(){
        return(
            <form onSubmit={this.handleSubmit} className="form">
				<div className="form-group">
					<div className="row">
						<div className="col-lg-12">							
							<label>Skriv in hela ordet/meningen eller gissa på en bokstav/siffra i taget</label>
							<input type="text" className="txt-guess form-control form-control-default input-inline" placeholder="Gissning" ref="guess"  />
							<input type="submit" className="btn btn-blue btn-inline" value="Gissa" />
						</div>
					</div>
				</div>
            </form>
            );
    }
});

var TextGuesser = React.createClass({
	endGuessing : function(isCorrect) {
		this.props.onHasAnswered(isCorrect);
    },
	handleGuess: function(guess){
		//check if wrong guess - and check against no. of wrong guesses
        guess = guess.toUpperCase();
        var wrongGuesses = this.state.wrongGuesses;
        var guessWord = this.state.guessword;
        var answer = this.props.answer;
        if(guess.length > 1){
            if(guess === answer){
                this.endGuessing(true);
                return false;
            }else{
				wrongGuesses.push(guess);
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
                wrongGuesses.push(guess);

            guessWord = guessWordChars.join('');
        }
        if(guessWord === answer){
            this.endGuessing(true);
            return false;
        }
        if(wrongGuesses.length >= this.props.maxwrong){
            this.endGuessing(false);
            return false;
        }
        this.setState({wrongGuesses: wrongGuesses, guessword: guessWord });
	},
	initGuessWord : function(answerWord){
        var answer = answerWord.split('');
        var guessWord = '';
        for (var i = 0; i < answer.length; i++) {
            guessWord += answer[i] === ' ' ? " " : "_";
        }
        return guessWord;
    },
	componentWillReceiveProps : function(nextProps){
        this.setState({ guessword: this.initGuessWord(nextProps.answer), wrongGuesses: [] });
    },
    getInitialState: function() {
        return { guessword: this.initGuessWord(this.props.answer), wrongGuesses: [] };
    },
	render: function(){
		return(
			<div>
				<TextGuessingResult guessword={this.state.guessword} wrongGuesses={this.state.wrongGuesses} maxwrong={this.props.maxwrong} />
				<TextGuessingForm onGuess={this.handleGuess} />
			</div>
		);
	}
});