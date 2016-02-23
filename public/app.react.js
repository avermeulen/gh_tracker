/** @jsx React.DOM */

var socket = io();

var RecentCommit = React.createClass({displayName: "RecentCommit",
	render : function(){
		return (React.createElement("li", null, this.props.commit.type, " @ ", this.props.commit.repositoryName, " "));
	}
});

var commitList = ["Commit One", "Commit Three", "Commit 900", "Commit...", "Commit 111"];
var repositoryList = ["Repo 1", "Other repo", "yet another repo"];

var RecentCommitsView = React.createClass({displayName: "RecentCommitsView",
	render : function(){

		this.props.events = this.props.events || [];
		var commits = this.props.events.map(function(commit){
			return React.createElement(RecentCommit, {commit: commit})
		});

		return(
			React.createElement("span", null, 
				React.createElement("strong", null, "Recent commits"), 
				React.createElement("ul", null, commits)
			)
			);
	}
});

var RepositoryView = React.createClass({displayName: "RepositoryView",
	render : function(){

		return (
			React.createElement("span", {className: "label label-default"}, this.props.repositoryName)
		);
	}
});

var RepositoryListView = React.createClass({displayName: "RepositoryListView",

	render : function(){

		this.props.repositories = this.props.repositories || [];

		var repositories = this.props.repositories.map(function(repository){
			return React.createElement(RepositoryView, {repositoryName: repository});
		});

		return (
			React.createElement("span", null, 
				React.createElement("strong", null, "Repositories"), 
				React.createElement("br", null), 
				repositories
		));
	}
});

var LastCodedBadgeView = React.createClass({displayName: "LastCodedBadgeView",

	render : function () {
		var labelStyle = "label";

		if (this.props.activeDaysAgo === 0){
			labelStyle += " label-success";
			return (
				React.createElement("span", {className: labelStyle}, "Committed today")
			);
		}
		else if (this.props.activeDaysAgo <= 3){
			labelStyle += " label-warning";
		}
		else {
			labelStyle += " label-danger";
		};

		return (
			React.createElement("span", {className: labelStyle}, "Committed ", this.props.activeDaysAgo, " days ago")
		);
	}

});

var Sparkline = React.createClass({displayName: "Sparkline",
	componentDidMount : function(){

	},

	render : function(){

	}

});

var Sparkline = React.createClass({displayName: "Sparkline",
	componentDidMount : function(){
		var el = React.findDOMNode(this),
				data = sparky.parse.numbers(this.props.dataset),
    		preset = sparky.presets.get(this.props.preset),
    		options = sparky.util.getElementOptions(el, preset);
    sparky.sparkline(el, data, options);
	},

	render : function(){
		return (React.createElement("span", {className: "sparkline"}));
	}

});


var CoderView = React.createClass({displayName: "CoderView",
	render: function(){
		var githubURL = "https://github.com/" + this.props.githubUsername;

		return (

			React.createElement("div", {className: "col-sm-4 col-md-4"}, 
				React.createElement("div", {className: "panel panel-default"}, 
				  	React.createElement("div", {className: "panel-heading"}, 
				  		React.createElement("strong", null, this.props.firstName, " ", this.props.lastName, " - ", React.createElement("a", {href: githubURL, target: "_blank"}, " ", this.props.githubUsername))
			  		), 

					React.createElement("div", {className: "panel-body"}, 
						React.createElement(LastCodedBadgeView, {activeDaysAgo: this.props.activeDaysAgo}), 
						React.createElement(Sparkline, {preset: "hilite-last", dataset: this.props.commits})

					)
				)
			)
		)
	}
});


var CoderListView = React.createClass({displayName: "CoderListView",

	render : function(){

		var coders = this.props.coders || [];
		var key = 0;
		var coderViews = coders.map(function(coder){
			key++;
			return (
				React.createElement(CoderView, {key: key, 
						   	firstName: coder.firstName, 
						   	lastName: coder.lastName, 
								githubUsername: coder.username, 
								activeDaysAgo: coder.active_days_ago, 
								events: coder.events, 
								commits: coder.commits, 
						    repositoryList: coder.repositories})
				);
		});

		var coderBatches = _.chunk(coderViews, 3);

		var batches = coderBatches.map(function(coderBatch) {
				return ( React.createElement("div", {className: "row user-row"}, 
						coderBatch
					) )
				});


		return (
			React.createElement("div", null, 
				batches
			)
		);


	}
});

var FormField = React.createClass({displayName: "FormField",
	render : function(){
		return (
			React.createElement("div", {className: "form-group"}, 
			    React.createElement("label", {for: this.props.fieldName}, this.props.caption, 
			    	React.createElement("input", {type: "text", className: "form-control", value: this.props.value, id: this.props.fieldName, name: this.props.fieldName, 
			    	onChange: this.props.onChange})
			    )
			 )
		);
	}
});

var AddCoderView = React.createClass({displayName: "AddCoderView",
	getInitialState : function(){
		return {
			firstName : "",
			lastName : "",
			username : ""
			//disabled : true
		};
	},
	render : function(){
		var disabled = this.isDisabled();

		return (
			React.createElement("div", {className: "row well"}, 
				React.createElement("form", {className: "form-inline", method: "post", action: "/coders", autocomplete: "off"}, 

				  React.createElement(FormField, {fieldName: "firstName", ref: "firstName", value: this.state.firstName, caption: "First name", onChange: this.handleChange('firstName').bind(this)}), 
				  React.createElement(FormField, {fieldName: "lastName", ref: "lastName", value: this.state.lastName, caption: "Last name", onChange: this.handleChange('lastName').bind(this)}), 
				  React.createElement(FormField, {fieldName: "username", ref: "username", value: this.state.username, caption: "Github username", onChange: this.handleChange('username').bind(this)}), 

				  React.createElement("button", {type: "submit", onClick: this.addCoder, className: "btn btn-default", 
				  	disabled: disabled}, "Add coder"), 

				  React.createElement("button", {onClick: this.doRefresh, className: "btn btn-default"}, "Refresh")

				)
			)
			);
	},

	isDisabled : function(){

		var disabled = this.state.firstName.trim() === "" ||
    		this.state.lastName.trim() === "" ||
    		this.state.username.trim() === "";

    	return disabled;

	},

	handleChange : function(fieldName){
		return function(elem){
			var state = {};
      		state[fieldName] = elem.target.value;
      		this.setState(state);
		};
	},

	doRefresh : function (e) {
		$.get("/api/coders/refresh", function(data){
			toastr.warning("Refreshing data for " +  data.coders + " coders");
		});
		e.preventDefault();
	},

	addCoder : function(e){

		var self = this;
		$.post("api/coders", this.state, function(){
			toastr.warning('Added coder...');

			self.setState({
				lastName : "",
				firstName : "",
				username : ""
			});

		});

		e.preventDefault();

	}
});

var App = React.createClass({displayName: "App",

	getInitialState : function(){
		return {
			coders : this.props.coders
		};
	},

	componentDidMount : function(){
		var i = 1;
		var self = this;

		socket.on('events_updated', function(){

			$.get("api/coders", this.state, function(coders){
				toastr.warning('Coders updated!');
				self.setState({coders : coders});
			});

		});

		socket.on('coder_added', function(input){

			toastr.warning('Coder added!');

			var coders = self.state.coders;

			var userData = input.data;

			coders.push({
				id : userData._id,
				firstName : userData.firstName,
				lastName : userData.lastName,
				username : userData.username,
				events : userData.activities,
				repositories : userData.repositories
			});

			self.setState({coders : coders});
		});
	},

	render : function(){
		return (

			React.createElement("div", null, 
				React.createElement("h1", null, "Github overview"), 
				React.createElement("h2", null, "Coders"), 
				React.createElement(AddCoderView, null), 
				React.createElement(CoderListView, {coders: this.state.coders})
			)

		);
	}
});


var showActivity = function(){
	var coders = JSON.parse(document.getElementById('coderList').innerHTML);
	React.render(
			React.createElement(App, {coders: coders}),
			document.getElementById('coders')
	);
	
};
