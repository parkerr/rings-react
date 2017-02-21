import React, { Component } from 'react';
import './App.css';
import CircularProgressBar from './circles'


function updateStoredUserData(poundsLost) {
    window.localStorage['poundsLost'] = poundsLost
}

function getStoredUserData() {
    return window.localStorage['poundsLost'] || 0
}


class App extends Component {
	constructor(props, context) {
    super(props, context)
    this.state = {poundsLost: parseInt(getStoredUserData())}
	this.onDecrease = this.onDecrease.bind(this)
	this.onIncrease = this.onIncrease.bind(this)
  }
	
 onDecrease(){
	 var newAmount = this.state.poundsLost - 1 
     this.setState({...this.state, poundsLost: newAmount})
	 updateStoredUserData(newAmount)
 }	

 onIncrease(){
	 var newAmount = this.state.poundsLost + 1 
     this.setState({...this.state, poundsLost: newAmount})
	 updateStoredUserData(newAmount)	
 }
	
  render() {
	  
	  var poundsLost = this.state.poundsLost
	  return (
      <div className="App parent">
	  <div>
		<button onClick={this.onDecrease}>Decrease</button>
		<h4 className="text-center">{poundsLost}</h4>
		<button onClick={this.onIncrease}>Increase</button>
		</div>
        <CircularProgressBar percentage={60} initialAnimation={false} stones={5} poundsLost={poundsLost} halfStone={true}/>
      </div>
    );
  }
}

export default App;
