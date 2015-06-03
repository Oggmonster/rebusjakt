﻿// @hash v2-D7749BCDBB4D28AE0854FD58EF6C7F28
// Automatically generated by ReactJS.NET. Do not edit, your changes will be overridden.
// Version: 1.5.2 (build 05eb7cc)
// Generated at: 2015-06-02 15:24:31
///////////////////////////////////////////////////////////////////////////////

    var RiddleForm = React.createClass({displayName: "RiddleForm",
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
			if(this.state.riddle.Description){
				riddleDescription = React.createElement("p", {dangerouslySetInnerHTML: {__html: emojione.toImage(this.state.riddle.Description)}});
			}
			if(this.state.showMap){
				map = React.createElement(GeocodeMap, {lat: this.state.riddle.Latitude, lng: this.state.riddle.Longitude, onPickPosition: this.handleMapPosition});          
			}
			if(this.state.showEmojiPicker){
				emojiPicker = React.createElement(EmojiPicker, {onEmojiSelected: this.handleEmojiSelected});
			}
            return (
                React.createElement("div", null, 
					riddleDescription, 				
                    React.createElement("form", {id: "riddle-form", ref: "riddleform", onSubmit: this.handleSubmit, className: "form"}, 
						React.createElement("input", {type: "hidden", name: "Id", ref: "id", value: this.props.riddle.Id}), 
                        React.createElement("input", {type: "hidden", name: "HuntId", value: this.props.huntId}), 
						React.createElement("input", {type: "hidden", name: "Latitude", ref: "lat", value: this.state.riddle.Latitude, onChange: this.handleChange.bind(this, "Latitude")}), 
                        React.createElement("input", {type: "hidden", name: "Longitude", ref: "lng", value: this.state.riddle.Longitude, onChange: this.handleChange.bind(this, "Longitude")}), 
						React.createElement("div", {className: "form-group"}, 
							React.createElement("div", {className: "row"}, 
								React.createElement("div", {className: "col-lg-6 col-md-8 col-sm-10"}, 
									React.createElement("label", null, "Rebus"), 
									React.createElement("textarea", {id: "Description", rows: "3", cols: "30", className: "form-control form-control-default", name: "Description", ref: "riddle", value: this.state.riddle.Description, onChange: this.handleChange.bind(this, "Description")}), 
									React.createElement("span", {className: "form-help form-help-msg"}, "Du kan använda emojis i texten (välj nedan om du inte redan har stöd från emojis)"), 
									React.createElement("p", null, 
										React.createElement("a", {className: "btn collapsed waves-button waves-effect", "data-toggle": "collapse", href: "#collapsible-emoji-region", onClick: this.handleShowEmojiPicker}, 
											React.createElement("span", {className: "collapsed-hide"}, "Dölj"), 
											React.createElement("span", {className: "collapsed-show"}, "Välj emoji")
										)	
									), 									
									React.createElement("div", {className: "collapsible-region collapse", id: "collapsible-emoji-region"}, 
										emojiPicker
									)			
								)
							)
						), 
                        React.createElement("div", {className: "form-group"}, 
							React.createElement("div", {className: "row"}, 
								React.createElement("div", {className: "col-lg-6 col-md-8 col-sm-10"}, 
									React.createElement("label", null, "Svar"), 
									React.createElement("input", {id: "Answer", className: "form-control form-control-default", type: "text", name: "Answer", ref: "answer", value: this.state.riddle.Answer, onChange: this.handleChange.bind(this, "Answer")})
								)
							)
						), 
						React.createElement("div", {className: "form-group"}, 
							React.createElement("div", {className: "row"}, 
								React.createElement("div", {className: "col-lg-6 col-md-8 col-sm-10"}, 
									React.createElement("label", null, "Namn på plats dit rebusen leder"), 
									React.createElement("input", {className: "form-control form-control-default", type: "text", name: "LocationName", ref: "locationname", value: this.state.riddle.LocationName, onChange: this.handleChange.bind(this, "LocationName")})
								)
							)
						)
					), 
					React.createElement("div", {className: "form-group"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-lg-6 col-md-8 col-sm-10"}, 
								React.createElement("a", {className: "btn collapsed waves-button waves-effect", "data-toggle": "collapse", href: "#collapsible-map-region", onClick: this.handleShowMap}, 
									React.createElement("span", {className: "collapsed-hide"}, "Dölj"), 
									React.createElement("span", {className: "collapsed-show"}, "Välj kartposition")
								), 	
								React.createElement("div", {className: "collapsible-region collapse", id: "collapsible-map-region"}, 
									map
								)								
							)
						)
					), 
                    React.createElement("div", {className: "form-group-btn"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-lg-6 col-md-8 col-sm-10"}, 
								React.createElement("button", {className: "btn btn-blue waves-button waves-light waves-effect", onClick: this.handleSaveForm}, "Spara"), 
								" ", 
								React.createElement("a", {className: "btn btn-flat btn-red waves-button waves-effect", onClick: this.handleCancel}, "Avbryt")
							)
						)
					)
                )
                );
        }
    });

    var RiddleList = React.createClass({displayName: "RiddleList",
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
                  React.createElement("div", {className: "col-lg-3 col-md-4 col-sm-6"}, 
					React.createElement("div", {className: "card"}, 
						React.createElement("div", {className: "card-main"}, 
							React.createElement("div", {className: "card-inner"}, 								
								React.createElement("p", {dangerouslySetInnerHTML: {__html: emojione.toImage(riddle.Description)}}), 
								React.createElement("p", null, riddle.Answer), 
								React.createElement("p", null, 
									"Antal frågor: ", riddle.Questions.length
								)
							), 
							React.createElement("div", {className: "card-action"}, 
								React.createElement("ul", {className: "nav nav-list pull-left"}, 
									React.createElement("li", null, 
										React.createElement("a", {href: "#", onClick: this.addQuestions.bind(this, riddle)}, 
											React.createElement("span", {className: "text-blue"}, "Frågor")
										)
									), 
									React.createElement("li", null, 
										React.createElement("a", {href: "#", onClick: this.handleEdit.bind(this, riddle), title: "Ändra"}, React.createElement("span", {className: "access-hide"}, "Ändra"), React.createElement("span", {className: "icon icon-edit"}))
									), 
									React.createElement("li", null, 
										React.createElement("a", {href: "#", onClick: this.handleDelete.bind(this, riddle), title: "Ta bort"}, React.createElement("span", {className: "access-hide"}, "Ta bort"), React.createElement("span", {className: "icon icon-delete"}))
									)
								)
							)
						)
					)
                  )
                );
            }.bind(this));
            return (
                React.createElement("div", {className: "card-wrap"}, 
					React.createElement("div", {className: "row"}, 
						riddleNodes
					)
                )				
                );
        }
    });

    var RiddleCreator = React.createClass({displayName: "RiddleCreator",
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
            React.render(React.createElement(QuestionCreator, {riddle: riddle, onQuestionsComplete: this.handleQuestionsComplete}), document.getElementById("question-container"));
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
                riddleForm = React.createElement(RiddleForm, {riddle: riddle, onRiddleSubmit: this.handleRiddleSubmit, onRiddleCancel: this.handleRiddleCancel, huntId: this.props.huntId});
            }else if(this.state.showMap){
				var positions = this.state.positions;
				var first = positions.shift();
				mapContent = React.createElement("div", null, React.createElement(GoogleMap, {lat: first.lat, lng: first.lng, positions: positions}), React.createElement("a", {href: "#", onClick: this.handleHideMap}, "Tillbaka"));
			}
            else{
				intro = React.createElement("h2", {className: "content-sub-heading"}, "Lägg till nya eller redigera befintliga rebusar");
                newButton = React.createElement("button", {className: "btn btn-blue", onClick: this.handleNewRiddleClick}, "Lägg till ny rebus");
                riddleList = React.createElement(RiddleList, {data: this.state.data, onRiddleEdit: this.handleRiddleEdit, onRiddleDelete: this.handleRiddleDelete, onRiddleNewQuestions: this.handleRiddleNewQuestions});
				backButton = React.createElement("p", null, React.createElement("a", {href: "/riddleadmin/index", title: "Tillbaka till admin"}, "Tillbaka till admin"));
				if(this.state.data.length > 0){
					mapButton = React.createElement("button", {onClick: this.handleShowMap, className: "btn"}, React.createElement("span", {className: "icon icon-place"}), " Visa karta");
				}
            }

            return (
                React.createElement("div", {className: "riddle-creator"}, 
					intro, 
                    riddleForm, 
					mapContent, 
                    newButton, "   ", mapButton, 
                    riddleList, 
					backButton
                )
                );
        }
    });
    React.render(React.createElement(RiddleCreator, {initialData: huntData.Riddles, huntId: huntData.HuntId}), document.getElementById("riddle-container"));
    
    


    
   
   