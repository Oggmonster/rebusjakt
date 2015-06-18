var NumberGuesser = React.createClass({
	handleSubmit: function(e){
		e.preventDefault();
		var numberNode = this.refs.number.getDOMNode();
        var number = numberNode.value.trim();
		var isCorrect = parseInt(this.props.answer,10) === parseInt(number, 10);
		this.props.onHasAnswered(isCorrect);
	},
	render: function(){
		return(
			<form onSubmit={this.handleSubmit} className="form">
				<div className="form-group">
					<div className="row">
						<div className="col-lg-6 col-md-8 col-sm-10">
							<label>Skriv in ett nummer som svar</label>
							<input className="form-control form-control-default input-inline"  type="number" ref="number" />
							<button className="btn btn-blue waves-button waves-light waves-effect btn-inline" type="submit">Svara</button>
						</div>
					</div>
				</div>				
			</form>		
		);
	}
});