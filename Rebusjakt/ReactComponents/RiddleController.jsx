





    var RiddleController = React.createClass({
        initRiddles: function(){
            var data;
            if(!data){
                data  = [];
                var riddle1 = {
                    name : "Rebus 1",
                    riddle : "RR + DD",
                    answer : "R2D2",
                    lat: 0,
                    lng: 0
                };
                var riddle2 = {
                    name : "Rebus 2",
                    riddle : "döskalle + stjärna",
                    answer : "DEATH STAR",
                    lat: 0,
                    lng: 0
                };
                var riddle3 = {
                    name : "Rebus 3",
                    riddle : "abba + te + hydda",
                    answer : "JABBA THE HUT",
                    lat: 0,
                    lng: 0
                };
                data.push(riddle1);
                data.push(riddle2);
                data.push(riddle3);
            }
            return data;
        },
        handleClick: function(key){
            var riddles = this.initRiddles();
            var mainElements = {
                "riddle" : function(){ return <RiddleCreator initialData={riddles}  />; },
                "question" : function(){ return <QuestionCreator />; }
            };
            var element = mainElements[key]();
            React.render(element, document.getElementById("container"));
        },
        render : function(){
            return(
                <div>
                    <button onClick={this.handleClick.bind(this, "riddle")}>Ny rebus</button>   
                    <button onClick={this.handleClick.bind(this, "question")}>Ny fråga</button>                     
                </div>
                );
        }
    });

    React.render(
        <RiddleController />, document.getElementById("controller")
        );