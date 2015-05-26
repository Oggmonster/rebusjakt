
    var RiddleForm = React.createClass({
        handleMapPosition: function(position){
			var riddle = this.state.riddle;
			riddle.Latitude = position.lat;
			riddle.Longitude = position.lng;
			this.setState({riddle: riddle});            
        },        
		handleEmojiSelected: function(short){
			var riddle = this.state.riddle;
			riddle.Description = (riddle.Description || "") + " " + short + " ";
			this.setState({riddle: riddle});
		},
		handleCancel: function(){
			var original = this.state.original;
			var riddle = this.state.riddle;
			riddle =  $.extend(true, riddle, original); //copy back from original
			this.setState({ riddle: riddle });
			this.props.onRiddleCancel();
		},
        handleSubmit: function(e){
            e.preventDefault();
            return false;
        },
		handleSaveForm: function(e){
			e.preventDefault();
            var latNode = this.refs.lat.getDOMNode();
            var lngNode = this.refs.lng.getDOMNode();
            var lat = latNode.value;
            var lng = lngNode.value;
            if(!lat || !lng)
            {
                alert("Du måste lägga till en adress som rebusen ska leda till");
                return false;
            }
			var riddle = {};
			$("#riddle-form").serializeArray().map(function(x){
				riddle[x.name] = x.value;
			});
			riddle.Description = emojione.toShort(riddle.Description);
            this.props.onRiddleSubmit(riddle);
			//var riddleForm = this.refs.riddleform.getDOMNode();
			//this.props.onRiddleSubmit(this.props.riddle.Id, $(riddleForm).serialize());
			this.refs.riddle.getDOMNode().value = '';
			this.refs.answer.getDOMNode().value = '';
            latNode.value = '';
            lngNode.value = '';
		},
		handleShowEmojiPicker: function(){
			this.setState({ showEmojiPicker: true });
		},
		handleShowMap: function(){
			this.setState({showMap: true});
		},
        handleChange: function(attribute, event) {            
            var riddle = this.state.riddle;    
            riddle[attribute] = event.target.value;
            this.setState({riddle: riddle});
        },
        getInitialState: function() {
			var original = $.extend(true, {}, this.props.riddle); //copy
            return { riddle: this.props.riddle, original: original };
        },
        render: function(){
			var riddleDescription, map, emojiPicker;
			if(this.state.riddle.Description){
				riddleDescription = <p dangerouslySetInnerHTML={{__html: emojione.toImage(this.state.riddle.Description)}} />;
			}
			if(this.state.showMap){
				map = <GeocodeMap lat={this.state.riddle.Latitude} lng={this.state.riddle.Longitude} onPickPosition={this.handleMapPosition} />;          
			}
			if(this.state.showEmojiPicker){
				emojiPicker = <EmojiPicker onEmojiSelected={this.handleEmojiSelected} />;
			}
            return (
                <div>
					{riddleDescription}				
                    <form id="riddle-form" ref="riddleform" onSubmit={this.handleSubmit} className="form">
						<input type="hidden" name="Id" ref="id" value={this.props.riddle.Id} />
                        <input type="hidden" name="HuntId" value={this.props.huntId} />
						<input type="hidden" name="Latitude" ref="lat" value={this.state.riddle.Latitude} onChange={this.handleChange.bind(this, "Latitude")} />
                        <input type="hidden" name="Longitude" ref="lng" value={this.state.riddle.Longitude} onChange={this.handleChange.bind(this, "Longitude")} />
						<div className="form-group">
							<div className="row">
								<div className="col-lg-6 col-md-8 col-sm-10">
									<label>Rebus</label>
									<textarea id="Description" rows="3" cols="30" className="form-control form-control-default" name="Description" ref="riddle" value={this.state.riddle.Description} onChange={this.handleChange.bind(this, "Description")}></textarea>
									<span className="form-help form-help-msg">Du kan använda emojis i texten (välj nedan om du inte redan har stöd från emojis)</span>
									<p>
										<a className="btn collapsed waves-button waves-effect" data-toggle="collapse" href="#collapsible-emoji-region" onClick={this.handleShowEmojiPicker}>
											<span className="collapsed-hide">Dölj</span>
											<span className="collapsed-show">Välj emoji</span>
										</a>	
									</p>									
									<div className="collapsible-region collapse" id="collapsible-emoji-region">
										{emojiPicker}
									</div>			
								</div>
							</div>
						</div>
                        <div className="form-group">
							<div className="row">
								<div className="col-lg-6 col-md-8 col-sm-10">
									<label>Svar</label>
									<input id="Answer" className="form-control form-control-default" type="text" name="Answer" ref="answer" value={this.state.riddle.Answer} onChange={this.handleChange.bind(this, "Answer")} />
								</div>
							</div>
						</div>
						<div className="form-group">
							<div className="row">
								<div className="col-lg-6 col-md-8 col-sm-10">
									<label>Namn på plats dit rebusen leder</label>
									<input className="form-control form-control-default" type="text" name="LocationName" ref="locationname" value={this.state.riddle.LocationName} onChange={this.handleChange.bind(this, "LocationName")} />
								</div>
							</div>
						</div>
					</form>
					<div className="form-group">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<a className="btn collapsed waves-button waves-effect" data-toggle="collapse" href="#collapsible-map-region" onClick={this.handleShowMap}>
									<span className="collapsed-hide">Dölj</span>
									<span className="collapsed-show">Välj kartposition</span>
								</a>	
								<div className="collapsible-region collapse" id="collapsible-map-region">
									{map}
								</div>								
							</div>
						</div>
					</div>
                    <div className="form-group-btn">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								<button className="btn btn-blue waves-button waves-light waves-effect" onClick={this.handleSaveForm}>Spara</button>
								&nbsp;
								<a className="btn btn-flat btn-red waves-button waves-effect" onClick={this.handleCancel}>Avbryt</a>
							</div>
						</div>
					</div>
                </div>
                );
        }
    });

    var RiddleList = React.createClass({
        handleEdit: function(riddle, event){
			event.preventDefault();
            this.props.onRiddleEdit(riddle);
        },
        handleDelete: function(riddle, event){
			event.preventDefault();
            if(confirm("Är du säker på att du vill ta bort rebusen?")){
                this.props.onRiddleDelete(riddle);
            }
        },
        addQuestions: function(riddle, event){
			event.preventDefault();
            this.props.onRiddleNewQuestions(riddle);
        },
        render: function(){
            var riddleNodes = this.props.data.map(function (riddle) {
                return (
                  <div className="col-lg-3 col-md-4 col-sm-6">
					<div className="card">
						<div className="card-main">
							<div className="card-inner">								
								<p dangerouslySetInnerHTML={{__html: emojione.toImage(riddle.Description)}} />
								<p>{riddle.Answer}</p>
								<p>
									Antal frågor: {riddle.Questions.length}
								</p>
							</div>
							<div className="card-action">
								<ul className="nav nav-list pull-left">
									<li>
										<a href="#" onClick={this.addQuestions.bind(this, riddle)}>
											<span className="text-blue">Frågor</span>
										</a>
									</li>
									<li>
										<a href="#" onClick={this.handleEdit.bind(this, riddle)} title="Ändra"><span className="access-hide">Ändra</span><span className="icon icon-edit"></span></a>
									</li>
									<li>
										<a href="#" onClick={this.handleDelete.bind(this, riddle)} title="Ta bort"><span className="access-hide">Ta bort</span><span className="icon icon-delete"></span></a>
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
						{riddleNodes}
					</div>
                </div>				
                );
        }
    });

    var RiddleCreator = React.createClass({
        handleNewRiddleClick : function(){
            var riddle = { Id : 0 };
            this.setState({ showRiddleForm: true, riddle: riddle});
        },
        handleRiddleSubmit: function(riddle){
            if(riddle.Id > 0){
				this.saveRiddleEdit(riddle);
            }else{
                this.saveNewRiddle(riddle);
            }
        },
		handleRiddleCancel: function(){
			var riddles = this.state.data;
			this.setState({ data: riddles, showRiddleForm: false });
		},
        saveNewRiddle: function(riddle){
            var riddles = this.state.data;
            $.post("/riddleadmin/addriddle",riddle, function(response){
                if(response.errors.length === 0){
                    riddles.unshift(response.riddle);     
                    this.setState({ data: riddles, showRiddleForm: false });
                }else{
                    console.log(response.errors);
                }
            }.bind(this),"json");
        },
        saveRiddleEdit: function(riddle){
            var riddles = this.state.data;
            $.post("/riddleadmin/editriddle",riddle, function(response){
                if(response.errors.length === 0){
                    this.setState({ data: riddles, showRiddleForm: false });
                }else{
                    console.log(response.errors);
                }
            }.bind(this),"json");
        },
        handleRiddleEdit: function(riddle){    
            this.setState({ showRiddleForm: true, riddle: riddle});            
        },
        handleRiddleDelete: function(riddle){
            var riddles = this.state.data;       
            $.post("/riddleadmin/deleteriddle",{ id: riddle.Id },"json");
			for(var i = riddles.length-1; i >= 0; i--){
                if(riddles[i].Id === riddle.Id){
                    riddles.splice(i, 1);    
                    break;
                }
            }
            this.setState({ data: riddles, showRiddleForm: false });
        },
        handleRiddleNewQuestions: function(riddle){                        
            $("#riddle-container").hide();
            $("#question-container").show();
            React.render(<QuestionCreator riddle={riddle} onQuestionsComplete={this.handleQuestionsComplete} />, document.getElementById("question-container"));
        },
        handleQuestionsComplete: function(){
            $("#question-container").hide();
            $("#riddle-container").show();
            var riddles = this.state.data;      
            this.setState({ data: riddles, showRiddleForm: false });
        },
        getInitialState: function() {
            return { data: this.props.initialData, showRiddleForm: false };
        },
        render: function () {           
            var riddleForm, riddleList, newButton, intro, backButton;
            if(this.state.showRiddleForm){
				var riddle = this.state.riddle;
                riddleForm = <RiddleForm riddle={riddle} onRiddleSubmit={this.handleRiddleSubmit} onRiddleCancel={this.handleRiddleCancel} huntId={this.props.huntId} />;
            }
            else{
				intro = <h2 className="content-sub-heading">Lägg till nya eller redigera befintliga rebusar</h2>;
                newButton = <button className="btn btn-blue" onClick={this.handleNewRiddleClick} >Lägg till ny rebus</button>;
                riddleList = <RiddleList data={this.state.data} onRiddleEdit={this.handleRiddleEdit} onRiddleDelete={this.handleRiddleDelete} onRiddleNewQuestions={this.handleRiddleNewQuestions} />;
				backButton = <p><a href="/hunt" title="Tillbaka till admin">Tillbaka till admin</a></p>;
            }

            return (
                <div className="riddle-creator">
					{intro}
                    {riddleForm}
                    {newButton}                                     
                    {riddleList}         
					{backButton}           
                </div>
                );
        }
    });
    React.render(<RiddleCreator initialData={huntData.Riddles} huntId={huntData.HuntId} />, document.getElementById("riddle-container"));
    
    


    
   
   