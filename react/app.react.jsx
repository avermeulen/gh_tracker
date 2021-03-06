/** @jsx React.DOM */

var socket = io();

var RecentCommit = React.createClass({
	render : function(){
		return (<li>{this.props.commit.type} @ {this.props.commit.repositoryName} </li>);
	}
});

var commitList = ["Commit One", "Commit Three", "Commit 900", "Commit...", "Commit 111"];
var repositoryList = ["Repo 1", "Other repo", "yet another repo"];

var RecentCommitsView = React.createClass({
	render : function(){

		this.props.events = this.props.events || [];
		var commits = this.props.events.map(function(commit){
			return <RecentCommit commit={commit} />
		});

		return(
			<span>
				<strong>Recent commits</strong>
				<ul>{commits}</ul>
			</span>
			);
	}
});

var RepositoryView = React.createClass({
	render : function(){

		return (
			<span className="label label-default">{this.props.repositoryName}</span>
		);
	}
});

var RepositoryListView = React.createClass({

	render : function(){

		this.props.repositories = this.props.repositories || [];

		var repositories = this.props.repositories.map(function(repository){
			return <RepositoryView repositoryName={repository} />;
		});

		return (
			<span>
				<strong>Repositories</strong>
				<br/>
				{repositories}
		</span>);
	}
});

var LastCodedBadgeView = React.createClass({

	render : function () {
		var labelStyle = "label";

		if (this.props.activeDaysAgo === 0){
			labelStyle += " label-success";
			return (
				<span className={labelStyle}>Committed today</span>
			);
		}
		else if (this.props.activeDaysAgo <= 3){
			labelStyle += " label-warning";
		}
		else {
			labelStyle += " label-danger";
		};

		return (
			<span className={labelStyle}>Committed {this.props.activeDaysAgo} days ago</span>
		);
	}

});

var Sparkline = React.createClass({
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
		return (<span className="sparkline" ></span>);
	}

});


var CoderView = React.createClass({
	render: function(){
		var githubURL = "https://github.com/" + this.props.githubUsername;
		var githubRepoURL = "https://github.com/" + this.props.activeRepo;

		return (

			<div className="col-sm-4 col-md-4">
				<div className="panel panel-default">
				  	<div className="panel-heading">
				  		<strong>{this.props.firstName} {this.props.lastName} - <a href={githubURL} target="_blank" > {this.props.githubUsername}</a></strong>
			  		</div>

					<div className="panel-body">
						<a href={githubRepoURL}>
							<LastCodedBadgeView activeDaysAgo={this.props.activeDaysAgo}/>
						</a>
						<Sparkline preset="hilite-last" dataset={this.props.commits}  />

					</div>
				</div>
			</div>
		)
	}
});


var CoderListView = React.createClass({

	render : function(){

		var coders = this.props.coders || [];
		var key = 0;
		var coderViews = coders.map(function(coder){
			console.log("============");
			console.log(coder.active_repo);
			key++;
			return (
				<CoderView key={key}
				   	firstName={coder.firstName}
				   	lastName={coder.lastName}
					githubUsername={coder.username}
					activeDaysAgo = {coder.active_days_ago}
					events={coder.events}
					commits={coder.commits}
					activeRepo={coder.active_repo}
				    repositoryList={coder.repositories} />
				);
		});

		var coderBatches = _.chunk(coderViews, 3);

		var batches = coderBatches.map(function(coderBatch) {
				return ( <div className="row user-row">
						{coderBatch}
					</div> )
				});


		return (
			<div>
				{batches}
			</div>
		);


	}
});

var FormField = React.createClass({
	render : function(){
		return (
			<div className="form-group">
			    <label for={this.props.fieldName}>{this.props.caption}
			    	<input type="text" className="form-control" value={this.props.value} id={this.props.fieldName} name={this.props.fieldName}
			    	onChange={this.props.onChange} />
			    </label>
			 </div>
		);
	}
});

var AddCoderView = React.createClass({
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
			<div className="row well">
				<form className="form-inline" method="post" action="/coders" autocomplete="off">

				  <FormField fieldName="firstName" ref="firstName" value={this.state.firstName} caption="First name" onChange={this.handleChange('firstName').bind(this)} />
				  <FormField fieldName="lastName" ref="lastName" value={this.state.lastName} caption="Last name" onChange={this.handleChange('lastName').bind(this)}/>
				  <FormField fieldName="username" ref="username" value={this.state.username} caption="Github username" onChange={this.handleChange('username').bind(this)} />

				  <button type="submit" onClick={this.addCoder} className="btn btn-default"
				  	disabled={disabled} >Add coder</button>

				  <button onClick={this.doRefresh} className="btn btn-default">Refresh</button>

				</form>
			</div>
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

/*
var RepositoryListEntry = React.createClass({

});

var RepositoryList = React.createClass({

	this.props.repositories.map(
		function(repository){
			return <RepositoryListEntry repoName="repository.name" />
		}
	)

	return(<table className="table">

	</table>);
});
*/

var App = React.createClass({

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

			<div>
				<h1>Github overview</h1>
				<h2>Coders</h2>
				<AddCoderView />
				<CoderListView coders={this.state.coders} />
			</div>

		);
	}
});


var showActivity = function(){
	var coders = JSON.parse(document.getElementById('coderList').innerHTML);
	React.render(
			<App coders={coders}/>,
			document.getElementById('coders')
	);
};
