var TextGuessingResult = React.createClass({
    render: function(){
        var guessNodes = this.props.guesses.map(function(word){
            return(
                    <li>{word}</li>
                );
        });
        var styling = {letterSpacing:'4px'}
        return(
            <div>
                <h3 style={styling}>{this.props.guessword}</h3>
                <p>Antal gissningar: {this.props.guesscount}</p>
                <ul>{guessNodes}</ul>
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
            <form onSubmit={this.handleSubmit}>                    
                <p>
                    <label>Skriv in hela ordet/meningen eller gissa på en bokstav/siffra i taget.</label>
                    <br />
                    <input type="text" placeholder="Gissning" ref="guess" className="txt-guess" />
                </p>                    
                <input type="submit" className="btn btn-primary" value="Gissa" />
            </form>
            );
    }
});

var TextGuesser = React.createClass({
	endGuessing : function(isCorrect) {
		this.props.onHasAnswered(isCorrect);
    },
	handleGuess: function(guess){
		//check if wrong guess - and check against no of wrong guesses
        guess = guess.toUpperCase();
        var guessCount = this.state.guesscount;
        guessCount++;
        var guesses = this.state.guesses;
        guesses.push(guess);
        var guessWord = this.state.guessword;
        var answer = this.props.answer;
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
        this.setState({guesscount:guessCount, wrongcount: wrongcount, guessword: guessWord, guesses : guesses });
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
        this.setState({ guesscount: 0, wrongcount: 0, guessword: this.initGuessWord(nextProps.answer), guesses: [] });
    },
    getInitialState: function() {
        return { guesscount: 0, wrongcount: 0, guessword: this.initGuessWord(this.props.answer), guesses: [] };
    },
	render: function(){
		console.log(this.props);
		return(
			<div>
				<TextGuessingResult guesscount={this.state.guesscount} guessword={this.state.guessword} guesses={this.state.guesses} />
				<TextGuessingForm onGuess={this.handleGuess} />
			</div>
		);
	}
});