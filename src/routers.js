import React from "react";
import Forms from './forms'
import FormSign from './form-sign'

import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
  
  
  class Routers extends React.Component {
    
    constructor(props){
    super();
    this.data = props.data
  }

  
  
   render(){
     
     return (
      
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
           <Route path="/forms" component={Forms}/>
            <Route path="/" component={FormSign} visible={this.visible}  />
            
          
          </Switch>
        </div>
      </Router>)
  }
  }
  
 
 
export default Routers;
  
  