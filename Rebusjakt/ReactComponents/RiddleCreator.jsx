

    
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
        isValid : function(){
        	if(!this.refs.riddle.getDOMNode().value){
        		toastIt("Du måste skriva in en rebus");
        		return false;
        	}
        	var answer = this.refs.answer.getDOMNode().value;
        	if(!answer){
        		toastIt("Du måste skriva in ett svar");
        		return false;
        	}
        	var regEx = /^[a-z 0-9]+$/i;
        	if(!regEx.test(answer)){
        		toastIt("Endast bokstäver, siffror och mellanslag är tillåtet i svaret.");
        		return false;
        	}
        	if(!this.refs.locationname.getDOMNode().value){
        		toastIt("Du måste skriva in vilken plats rebusen leder till");
        		return false;
        	}        	
        	if(!this.refs.lat.getDOMNode().value){
        		toastIt("Du måste markera rebusens plats på kartan");
        		return false;
        	}
        	return true;

        },
		handleSaveForm: function(e){
			e.preventDefault();
			if(!this.isValid()){
				return false;
			}
			var riddle = {};
			//serializearray ignores disabled (readonly) inputs?
			$("#riddle-form").serializeArray().map(function(x){
				riddle[x.name] = x.value;
			});
			riddle.Latitude = this.refs.lat.getDOMNode().value;
			riddle.Longitude = this.refs.lng.getDOMNode().value;
			riddle.Description = emojione.toShort(riddle.Description);
            this.props.onRiddleSubmit(riddle);
			this.refs.riddle.getDOMNode().value = '';
			this.refs.answer.getDOMNode().value = '';
            this.refs.lat.getDOMNode().value = '';
            this.refs.lng.getDOMNode().value = '';
		},
		handleShowEmojiPicker: function(){
			this.setState({ showEmojiPicker: true });
		},
		handleShowMap: function(){
			this.setState({showMap: true});
		},
        handleChange: function(attribute, event) {            
            var riddle = this.state.riddle;    
			var content = event.target.value;
			if(attribute === "Description"){
				//safeguard against html and script tags
				content = content.replace(/<|>/g,"");
			}
            riddle[attribute] = content;
            this.setState({riddle: riddle});
        },
        getInitialState: function() {
			var original = $.extend(true, {}, this.props.riddle); //copy
            return { riddle: this.props.riddle, original: original };
        },
        render: function(){
			var riddleDescription, map, emojiPicker;
			var coordInputStyle = { width:"80px", display:"inline-block" };
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
									<label>Namn på plats där frågorna finns</label>
									<input className="form-control form-control-default" type="text" name="LocationName" ref="locationname" value={this.state.riddle.LocationName} onChange={this.handleChange.bind(this, "LocationName")} />
								</div>
							</div>
						</div>
					</form>
					<div className="form-group">
						<div className="row">
							<div className="col-lg-6 col-md-8 col-sm-10">
								 <p>
                            		<input name="Latitude" type="text" placeholder="Latitud" ref="lat" readOnly value={this.state.riddle.Latitude} onChange={this.handleChange.bind(this, "Latitude")}  className="form-control form-control-default" style={coordInputStyle} />
                            		<input name="Longitude" type="text" placeholder="Longitud" ref="lng"  readOnly value={this.state.riddle.Longitude} onChange={this.handleChange.bind(this, "Longitude")}  className="form-control form-control-default" style={coordInputStyle} />
                            
                        		</p>       
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
		handleShowMap: function(){
			var riddles = this.state.data;    
			var positions = riddles.map(function(riddle){
				return {
					lat: riddle.Latitude,
					lng: riddle.Longitude,
					name: riddle.LocationName
				};
			});
			this.setState({ showMap: true, positions: positions });
		},
		handleHideMap: function(){
			var riddles = this.state.data;      
            this.setState({ data: riddles, showRiddleForm: false, showMap: false });
		},
        getInitialState: function() {
            return { data: this.props.initialData, showRiddleForm: false };
        },
        render: function () {           
            var riddleForm, riddleList, newButton, mapContent, mapButton, intro, backButton;
            if(this.state.showRiddleForm){
				var riddle = this.state.riddle;
                riddleForm = <RiddleForm riddle={riddle} onRiddleSubmit={this.handleRiddleSubmit} onRiddleCancel={this.handleRiddleCancel} huntId={this.props.huntId} />;
            }else if(this.state.showMap){
				var positions = this.state.positions;
				var first = positions.shift();
				mapContent = <div><GoogleMap lat={first.lat} lng={first.lng} positions={positions} /><a href="#" className="btn btn-blue btn-flat" onClick={this.handleHideMap}>Tillbaka</a></div>;
			}
            else{
				intro = <h2 className="content-sub-heading">Lägg till nya eller redigera befintliga rebusar</h2>;
                newButton = <button className="btn btn-blue" onClick={this.handleNewRiddleClick} >Lägg till ny rebus</button>;
                riddleList = <RiddleList data={this.state.data} onRiddleEdit={this.handleRiddleEdit} onRiddleDelete={this.handleRiddleDelete} onRiddleNewQuestions={this.handleRiddleNewQuestions} />;
				backButton = <a href="/riddleadmin/index" title="Tillbaka till admin" className="btn btn-flat btn-blue">Tillbaka till admin</a>;
				if(this.state.data.length > 0){
					mapButton = <button onClick={this.handleShowMap} className="btn" ><span className="icon icon-place"></span> Visa karta</button>;
				}
            }

            return (
                <div className="riddle-creator">
					{intro}
                    {riddleForm}
					{mapContent}
                    {newButton} &nbsp; {mapButton}                                   
                    {riddleList}         
					{backButton}           
                </div>
                );
        }
    });
    React.render(<RiddleCreator initialData={huntData.Riddles} huntId={huntData.HuntId} />, document.getElementById("riddle-container"));
    
    


    
   
   