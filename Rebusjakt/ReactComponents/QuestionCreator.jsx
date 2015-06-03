

    var QuestionForm = React.createClass({
        handleSubmit: function(e){
            e.preventDefault();
            var questiontype = this.getDOMNode().querySelector('[name="AnswerType"]:checked').value;
            var question = {};
            $("#question-form").serializeArray().map(function(x){
                question[x.name] = x.value;
            }); 
			var answer = question.Answer.toLowerCase();
			if(questiontype === "trueorfalse" && answer !== "true" && answer !== "false"){
				alert("Du måste skriva true eller false som svar");
				return false;
			}
            $("#question-form .make-empty").each(function(){
                $(this).val('');
            });
            this.props.onQuestionSubmit(question);
        },
		handleCancel: function(e){
			e.preventDefault();
			var original = this.state.original;
			var question = this.state.question;
			question =  $.extend(true, question, original); //copy back from original
			this.setState({ question: question });
			this.props.onQuestionCancel();
		},
        handleOptionClick: function(e){
            var multichoiche = this.refs.multi.getDOMNode();
            if(multichoiche.checked){
                $(".answersoptions-container").removeClass("hide");
            }else{
                $(".answersoptions-container").addClass("hide");
            }
        },
        handleChange: function(attribute, event) {            
            var question = this.state.question;    
            question[attribute] = event.target.value;
            this.setState({question: question});
        },
        getInitialState: function() {
			var original = $.extend(true, {}, this.props.question); //copy
            return { question: this.props.question, original: original};
        },
        render: function(){
			var answerOptionsClasses = "answersoptions-container";			
			if(this.state.question.AnswerType !== "multi"){
				answerOptionsClasses += " hide";
			}
            return(
				<div>
                <form id="question-form" onSubmit={this.handleSubmit} className="form">
                    <input type="hidden" name="Id" value={this.props.question.Id} />
                    <input type="hidden" name="RiddleId" value={this.props.question.RiddleId} />
                    <div className="form-group">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<label>Fråga</label>
								<textarea cols="30" rows="3" name="Description" className="form-control form-control-default make-empty" value={this.state.question.Description} onChange={this.handleChange.bind(this, "Description")} ></textarea>
							</div>
						</div>
					</div>
					<div className="form-group">
						<label>Välj typ av svar</label>
						<div className="radio radio-adv">
							<label htmlFor="input-radio-1">
								<input className="access-hide" id="input-radio-1" name="AnswerType" value="text" type="radio" checked={this.state.question.AnswerType === "text"} onClick={this.handleOptionClick} onChange={this.handleChange.bind(this, "AnswerType")} />Text som svar
								<span className="circle"></span>
								<span className="circle-check"></span>
							</label>
						</div>
						<div className="radio radio-adv">
							<label htmlFor="input-radio-2">
								<input className="access-hide" id="input-radio-2" name="AnswerType" value="number" type="radio" checked={this.state.question.AnswerType === "number"} onClick={this.handleOptionClick} onChange={this.handleChange.bind(this, "AnswerType")} />Siffra som svar
								<span className="circle"></span>
								<span className="circle-check"></span>
							</label>
						</div>
						<div className="radio radio-adv">
							<label htmlFor="input-radio-3">
								<input className="access-hide" id="input-radio-3" name="AnswerType" value="multi" ref="multi" type="radio" checked={this.state.question.AnswerType === "multi"} onClick={this.handleOptionClick} onChange={this.handleChange.bind(this, "AnswerType")} />Flerval
								<span className="circle"></span>
								<span className="circle-check"></span>
							</label>
						</div>
						<div className="radio radio-adv">
							<label htmlFor="input-radio-4">
								<input className="access-hide" id="input-radio-4" name="AnswerType" value="trueorfalse" type="radio" checked={this.state.question.AnswerType === "trueorfalse"} onClick={this.handleOptionClick} onChange={this.handleChange.bind(this, "AnswerType")} />
								Sant eller falskt <small>(skriv <strong>true</strong> eller <strong>false</strong> som svar)</small>
								<span className="circle"></span>
								<span className="circle-check"></span>
							</label>
							
						</div>
					</div>
					<div className={"form-group " + answerOptionsClasses}>
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<textarea cols="30" rows="3" className="form-control form-control-default make-empty" name="AnswerOptions" ref="answeroptions" value={this.state.question.AnswerOptions} onChange={this.handleChange.bind(this, "AnswerOptions")} ></textarea>
							<span className="form-help form-help-msg">Skriv in alternativ till svaret separerade med kommatecken <strong>(obs skriv ej in det faktiska svaret/svaren bland alternativen)</strong></span>
							</div>
						</div>						
					</div>                    
					<div className="form-group">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<label>Svar</label>
								<textarea cols="30" rows="3" className="form-control form-control-default make-empty" name="Answer" ref="Answer" value={this.state.question.Answer} onChange={this.handleChange.bind(this, "Answer")} ></textarea>
								<span className={"form-help form-help-msg " + answerOptionsClasses}>Ska man välja flera alternativ för att svara rätt kan du separera svaren med kommatecken.</span>
							</div>
						</div>						
					</div>
					<div className="form-group-btn">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<button className="btn btn-blue waves-button waves-light waves-effect" type="submit">Spara</button>
								&nbsp;
								<a className="btn btn-flat btn-red waves-button waves-effect" onClick={this.handleCancel}>Avbryt</a>
							</div>
						</div>
					</div>                   
                </form>
				</div>
                );
        }
    });    

    var QuestionList = React.createClass({
            handleEditClick: function(question){
                this.props.onQuestionEdit(question);
            },            
            handleDeleteClick: function(question){
                this.props.onQuestionDelete(question);
            },
            render: function(){
                var questionNodes = this.props.data.map(function(question){
                return (
					<div className="col-lg-3 col-md-4 col-sm-6">
						<div className="card">
							<div className="card-main">
								<div className="card-inner">
									<p className="card-heading text-alt">{question.Name}</p>
									<p>
										{question.Description}
									</p>
									<p>
										{question.Answer}
									</p>
								</div>
								<div className="card-action">
									<ul className="nav nav-list pull-left">
										<li>
											<a href="#" onClick={this.handleEditClick.bind(this, question)} title="Ändra"><span className="access-hide">Ändra</span><span className="icon icon-edit"></span></a>
										</li>
										<li>
											<a href="#" onClick={this.handleDeleteClick.bind(this, question)} title="Ta bort"><span className="access-hide">Ta bort</span><span className="icon icon-delete"></span></a>
										</li>
									</ul>
								</div>
							</div>
						</div>           
					</div>
				);
            }.bind(this));
            return (
				<div className="card-wrap">
					<div className="row">      
                        {questionNodes}
                    </div>
                </div>
                );
        }    
    });

    var QuestionCreator = React.createClass({
        handleQuestionSubmit: function(question){
            if(question.Id > 0){
                this.saveQuestionEdit(question);
            }else{
                this.saveNewQuestion(question);
            }                        
        },
		handleQuestionCancel: function(){
			var questions = this.state.data;
			this.setState({ data: questions, showForm: false });
		},
        saveNewQuestion: function(question){
            var questions = this.state.data;
            $.post("/riddleadmin/AddQuestion",question, function(response){
                if(response.errors.length === 0){
                    questions.unshift(response.question); 
                    this.setState({ data: questions, showForm: false });
                }else{
                    console.log(response.errors);
                }
            }.bind(this),"json");
        },
        saveQuestionEdit: function(question){
            var questions = this.state.data;
            $.post("/riddleadmin/EditQuestion",question, function(response){
                if(response.errors.length === 0){
                    this.setState({ data: questions, showForm: false });
                }else{
                    console.log(response.errors);
                }
            }.bind(this),"json");
        },
        handleQuestionsComplete: function(){
            this.props.onQuestionsComplete();
        },
        handleQuestionEdit: function(question){        
            this.setState({ question: question, showForm: true  });
        },
        handleNewQuestion: function(){
            var question = { Id : 0, RiddleId : this.state.riddle.Id };
            this.setState({question: question, showForm: true});
        },
        handleQuestionDelete: function(question){
			if(!confirm("Är du säker på att du vill ta bort frågan?")){
				return false;
			}
            var questions = this.state.data;
            $.post("/riddleadmin/deletequestion",{id : question.Id }, "json");
            for(var i = questions.length-1; i >= 0; i--){
                if(questions[i].Id === question.Id){
                    questions.splice(i, 1);    
                    break;
                }
            }
            this.setState({ data: questions });
        },
        componentWillReceiveProps : function(nextProps){
            var question = { Id : 0, RiddleId : nextProps.riddle.Id };
            this.setState({ data: nextProps.riddle.Questions, riddle : nextProps.riddle, question: question, showForm: false });
        },
        getInitialState: function () {
            var question = { Id : 0, RiddleId : this.props.riddle.Id };
			var showForm = this.props.riddle.Questions ? false : true;
            return { data: this.props.riddle.Questions, riddle : this.props.riddle, question: question, showForm : showForm };
        },
        render: function () {
            var questionForm, questionList, newButton, backButton;
            if(this.state.showForm){
                questionForm = <QuestionForm onQuestionSubmit={this.handleQuestionSubmit} question={this.state.question} onQuestionCancel={this.handleQuestionCancel} />;
            }else{
                questionList = <QuestionList data={this.state.data} onQuestionEdit={this.handleQuestionEdit} onQuestionDelete={this.handleQuestionDelete} onNewQuestion={this.handleNewQuestion} />;
                newButton = <button className="btn btn-blue" onClick={this.handleNewQuestion}>Ny fråga</button>;  
				backButton =  <button onClick={this.handleQuestionsComplete} className="btn btn-primary">Klar med frågor</button>;           
            }
            
            return (
                <div className="question-creator">
                    <h2 className="content-sub-heading">Hantera frågor för rebus med svaret {this.props.riddle.Answer}</h2>
                    {questionForm}
                    {newButton}
                    {questionList}
					{backButton}                   
                </div>
                );
        }
    });