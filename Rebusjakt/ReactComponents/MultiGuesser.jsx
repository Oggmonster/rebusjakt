var MultiGuesser = React.createClass({
	handleGuess: function(){
		var isCorrect = false; 
		var isMultiAnswer = this.props.answer.indexOf(",") !== -1;
		if(isMultiAnswer){
			var correctAnswers = this.props.answer.split(",").map(function(a){
				return a.toUpperCase().trim();
			});
			var correctGuesses = 0;
			$(".answer-option:checked").each(function(){
				var index = correctAnswers.indexOf($(this).val());
				if(index !== -1){
					correctGuesses++;
				}
				isCorrect = correctAnswers.length === correctGuesses;
			});
		}else{
			isCorrect = $(".answer-option:checked").val() === this.props.answer;
		}
		this.props.onHasAnswered(isCorrect);
	},
	
	render: function(){
		var multiTitle;
		var answerOptions = this.props.options.split(",").map(function(o){
			return o.toUpperCase().trim();
		});
		var isMultiAnswer = this.props.answer.indexOf(",") !== -1;
		if(isMultiAnswer){
			this.props.answer.split(",").map(function(a){
				answerOptions.push(a.toUpperCase().trim());
			});
		}else{
			answerOptions.push(this.props.answer.toUpperCase());
		}		
		answerOptions = answerOptions.sort(function() { return .5 - Math.random(); });
		var answerButtons = answerOptions.map(function(option){
			var content;
			if(isMultiAnswer){
				content = <div className="checkbox checkbox-adv">
							<label>
								<input className="access-hide answer-option" name="AnswerOption" type="checkbox" value={option} />{option}
								<span className="circle"></span>
								<span className="circle-check"></span>
								<span className="circle-icon icon icon-done"></span>
							</label>
					</div>;				
			}else{
				content = <div className="radio radio-adv">
							<label>
								<input className="access-hide answer-option" name="AnswerOption" value={option} type="radio" />{option}
								<span className="circle"></span>
								<span className="circle-check"></span>
							</label>
						</div>;
			}
			return content;
		}.bind(this));		
		return(
			<div>
				<div className="form-group">
					{answerButtons}
				</div>
				<button className="btn btn-blue" onClick={this.handleGuess}>Svara</button>
			</div>
		);
	}
});