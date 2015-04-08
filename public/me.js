var InputView = React.createClass({
  render : function(){
    console.log("->");
    return (
    <div className="field">
      <label for="{this.props.fieldName}">
        {this.props.caption}
        </label>
        <input type="text" id={this.props.fieldName} onChange={this.props.handleChange} />
      
    </div>);
  }
});

var FormView = React.createClass({
  getInitialState : function(){
    return {
      //ola : "..."
      fieldsMissing : true
    }
  },
  fieldChanged : function(fieldName){
    return function(field){

      var state = {};
      state[fieldName] = field.target.value;
      this.setState(state);

      //console.log(this.state);

     

    }
  },
  
  checkFields : function(){

    if (this.state['ola'] !== ""){
        return false; //this.setState({ fieldsMissing : false });        
      }
      else{
        return true; //this.setState({ fieldsMissing : true }); 
      }

  },


  render : function(){
    //console.log('render...')
    var fieldsMissing = this.checkFields();
    return (
          <div>
	         <InputView caption="Ola" name="ola" handleChange={this.fieldChanged('ola').bind(this)} />
           <InputView caption="Bola" name="bola" handleChange={this.fieldChanged('bola').bind(this)}  />
           <InputView caption="Yola" name="yola" handleChange={this.fieldChanged('yola').bind(this)}  />
           <p>
            {this.state.ola}
            <br/>
            {this.state.bola}
            <br/>
            {this.state.yola}
            <br/>
           </p>
           <button disabled={fieldsMissing}>Save</button>
         </div>
    );
  }
})


React.render(
     
     <FormView />
     
     ,	document.getElementById('fields')
);