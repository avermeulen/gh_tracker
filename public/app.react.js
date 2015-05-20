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

		return (<span>
			<strong>Repositories</strong>
			<br/>
			{repositories}
		</span>);
	}
});

var CoderView = React.createClass({
	render: function(){
		return (

			<div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xs-offset-0 col-sm-offset-0">
				<div className="panel panel-default">
				  	<div className="panel-heading">
				  		<strong>{this.props.firstName} {this.props.lastName} - @{this.props.githubUsername}</strong>
			  		</div>

					<div className="panel-body">	
						<RecentCommitsView events = {this.props.events} />
						<RepositoryListView repositories = {this.props.repositoryList} />
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
			key++;
			return (
				<CoderView 	key={key}
						   	firstName={coder.firstName}
						   	lastName={coder.lastName}
							githubUsername={coder.username}
							events={coder.events}
						    repositoryList={coder.repositories} />
				);
		});

		return (
			<div className="row user-row">
				{coderViews}	
			</div>
		);
	}
});

var FormField = React.createClass({
	render : function(){
		return (
			<div className="form-group">
			    <label for={this.props.fieldName}>{this.props.caption}
			    	<input type="text" className="form-control" id={this.props.fieldName} name={this.props.fieldName} 
			    	onBlur={this.props.onBlur} />
			    </label>
			 </div>
		);
	}

})

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

				  <FormField fieldName="firstName" ref="firstName" caption="First name" onBlur={this.handleChange('firstName').bind(this)} />
				  <FormField fieldName="lastName" ref="lastName" caption="Last name" onBlur={this.handleChange('lastName').bind(this)}/>
				  <FormField fieldName="username" ref="username" caption="Github username" onBlur={this.handleChange('username').bind(this)} />

				  <button type="submit" onClick={this.addCoder} className="btn btn-default" 
				  	disabled={disabled} >Add coder</button>

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

	addCoder : function(e){
		//alert();

		toastr.warning('Added coder...')

		$.post("api/coders", this.state, function(){


		});

		e.preventDefault();
	}
});

var App = React.createClass({

	getInitialState : function(){
		return {
			coders : this.props.coders
		};
	},

	componentDidMount : function(){
		var i = 1;
		var self = this;

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

var coders = JSON.parse(document.getElementById('coderList').innerHTML);


React.render(
		<App coders={coders}/>,
		document.getElementById('coders')
);
