var WrongGuesses = React.createClass({
    render: function(){        
        var wrongGuessesLeft = this.props.maxwrong - this.props.wrongGuesses.length;
        var guessNodes = this.props.wrongGuesses.map(function(word, i){
                return(
                        <div key={i} className="tile tile-red"><div className="tile-inner">{word}</div></div>
                    );
            });
        return(
            <div className="tile-wrap">
                <div className="tile">
                    <div className="tile-inner">Du kan gissa fel <strong>{wrongGuessesLeft}</strong> ggr till</div>
                </div>
                {guessNodes}
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
							<input type="text" className="txt-guess form-control form-control-default input-inline" placeholder="Gissning" ref="guess"  />
							<input type="submit" className="btn btn-blue btn-inline" value="Gissa" />
                            <span className="form-help form-help-msg">Skriv in hela ordet/meningen eller gissa på en bokstav/siffra i taget</span>
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
        var correctGuesses = this.state.correctGuesses;
        var guessword = this.state.guessword;
        var answer = this.props.answer;
        if(guess.length > 1){
            if(guess === answer){
                this.endGuessing(true);
                return false;
            }else{
				wrongGuesses.push(guess);
            }
        }else{ 
            var correctChars = guessword.split('');           
            var answerChars = answer.split('');
            var hasHit = false;
            for(var i = 0; i < answer.length; i++){
                if(answer[i] === guess){
                    correctChars[i] = guess;
                    hasHit = true;
                }                        
            }
            if(!hasHit){
                wrongGuesses.push(guess);
            }else
            {
                correctGuesses.push(guess);
            }           
            guessword = correctChars.join('');
        }
        if(guessword === answer){
            this.endGuessing(true);
            return false;
        }
        if(wrongGuesses.length >= this.props.maxwrong){
            this.endGuessing(false);
            return false;
        }
        this.props.onSave();
        this.setState({wrongGuesses: wrongGuesses, guessword: guessword, correctGuesses: correctGuesses});
	},
	initGuessWord : function(answerWord, correctGuesses){
        var answer = answerWord.split('');
        var guessword = "";
        for (var i = 0; i < answer.length; i++) {
            var letter = answer[i];
            if(correctGuesses.indexOf(letter) !== -1){
                guessword += letter;
            }
            else if(answer[i] === ' '){
                guessword += " ";
            }
            else{
                guessword += "_";
            }
        }
        return guessword;
    },
	componentWillReceiveProps : function(nextProps){
        this.setState({ guessword: this.initGuessWord(nextProps.answer, nextProps.correctGuesses), wrongGuesses: nextProps.wrongGuesses, correctGuesses: nextProps.correctGuesses });
    },
    getInitialState: function() {  
        return { guessword: this.initGuessWord(this.props.answer, this.props.correctGuesses), wrongGuesses: this.props.wrongGuesses, correctGuesses: this.props.correctGuesses };
    },
	render: function(){
        var styling = {letterSpacing:'5px', fontSize:'1.5em'};
        var wrongGuesses;
        if(this.state.wrongGuesses.length > 0){
            wrongGuesses = <WrongGuesses wrongGuesses={this.state.wrongGuesses} maxwrong={this.props.maxwrong} />;
        }
		return(
			<div>
                <label style={styling}>{this.state.guessword}</label>
				<TextGuessingForm onGuess={this.handleGuess} />
                {wrongGuesses}
			</div>
		);
	}
});