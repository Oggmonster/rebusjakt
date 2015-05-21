

    var QuestionForm = React.createClass({
        handleSubmit: function(e){
            e.preventDefault();
            var questiontype = this.getDOMNode().querySelector('[name="AnswerType"]:checked').value;
            var question = {};
            $("#question-form").serializeArray().map(function(x){
                question[x.name] = x.value;
            }); 
            $("#question-form .make-empty").each(function(){
                $(this).val('');
            });
            this.props.onQuestionSubmit(question);
        },
        handleOptionClick: function(e){
            var multichoiche = this.refs.multi.getDOMNode();
            if(multichoiche.checked){
                $("#answersoptions-container").removeClass("hide");
            }else{
                $("#answersoptions-container").addClass("hide");
            }
        },
        handleChange: function(attribute, event) {            
            var question = this.state.question;    
            question[attribute] = event.target.value;
            this.setState({question: question});
        },
        getInitialState: function() {
            return { question: this.props.question};
        },
        render: function(){
            return(
                <form id="question-form" onSubmit={this.handleSubmit}>
                    <input type="hidden" name="Id" value={this.props.question.Id} />
                    <input type="hidden" name="RiddleId" value={this.props.question.RiddleId} />
                    <p>
                        <input type="text" placeholder="Namn" name="Name" ref="name" className="make-empty" value={this.state.question.Name} onChange={this.handleChange.bind(this, "Name")} />
                    </p>
                    <p>
                        <label>Innehåll</label><br />
                        <textarea cols="30" rows="3" name="Description" className="make-empty" value={this.state.question.Description} onChange={this.handleChange.bind(this, "Description")} ></textarea>
                    </p>
                    <h6>Välj typ av svar</h6>
                    <p>
                        <label><input type="radio" name="AnswerType" value="text" defaultChecked  onClick={this.handleOptionClick} /> Text som svar</label>
                    </p>      
                    <p>
                        <label><input type="radio" name="AnswerType" value="number" onClick={this.handleOptionClick} /> Siffra som svar</label>
                    </p>
                    <p>
                        <label><input type="radio" name="AnswerType" value="multi" ref="multi" onClick={this.handleOptionClick} /> Flerval</label>
                    </p>
                    <p className="hide" id="answersoptions-container">
                        <label>Skriv in svarsalternativ separerade med kommatecken (obs skriv ej in svaret bland alternativen).</label><br />
                        <textarea cols="30" rows="3" name="AnswerOptions" ref="answeroptions" value={this.state.question.AnswerOptions} onChange={this.handleChange.bind(this, "AnswerOptions")} ></textarea>
                    </p>
                    <p>
                        <label><input type="text" placeholder="Svar" name="Answer" ref="Answer" className="make-empty" value={this.state.question.Answer} onChange={this.handleChange.bind(this, "Answer")}  /></label>
                    </p>                    
                    <p>
                        <input className="btn btn-primary" type="submit" value="Spara" />             
                    </p>                    
                </form>
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
                return (<li>
                            <h4>{question.Name}</h4> 
                            <p>
                                {question.Description}
                            </p>
                            <button className="btn" onClick={this.handleEditClick.bind(this, question)}>Ändra</button> &nbsp;
                            <button className="btn btn-danger" onClick={this.handleDeleteClick.bind(this, question)}>Ta bort</button>                           
                       </li> );
            }.bind(this));
            return (
                <div>
                    <h4>Frågor</h4>                    
                    <ul>
                        {questionNodes}
                    </ul>
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
            return { data: this.props.riddle.Questions, riddle : this.props.riddle, question: question, showForm : true };
        },
        render: function () {
            var questionForm, questionList, newButton;
            if(this.state.showForm){
                questionForm = <QuestionForm onQuestionSubmit={this.handleQuestionSubmit} question={this.state.question} />;
            }else{
                questionList = <QuestionList data={this.state.data} onQuestionEdit={this.handleQuestionEdit} onQuestionDelete={this.handleQuestionDelete} onNewQuestion={this.handleNewQuestion} />;
                newButton = <button className="btn btn-primary" onClick={this.handleNewQuestion}>Ny fråga</button>;             
            }
            
            return (
                <div className="question-creator">
                    <h4>Lägg till frågor för rebus: {this.props.riddle.Name}</h4>
                    {questionForm}
                    {newButton}
                    {questionList}                    
                    <hr />
                    <button onClick={this.handleQuestionsComplete} className="btn btn-primary">Klar med frågor</button>
                    
                </div>
                );
        }
    });