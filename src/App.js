import React, { Component } from 'react';
import './App.css';
import CircularProgressBar from './circles'
import request from 'superagent'
import { Checkbox } from 'react-bootstrap';



function updateStoredUserData(nickname) {
  window.localStorage['nickname'] = nickname
}

function forgetStoredUserData() {
  delete window.localStorage['nickname']
}


function getStoredNickname() {
  return window.localStorage['nickname'] || ''
}


class App extends Component {
	constructor(props, context) {
    super(props, context)
    this.state = {nickname: getStoredNickname(), poundsLost:0, stones:0, showHalves:false}
    this.onLogin = this.onLogin.bind(this)
    this.onLogout = this.onLogout.bind(this)    
	this.onDecrease = this.onDecrease.bind(this)
	this.onIncrease = this.onIncrease.bind(this)
  }
  
  componentWillMount() {
      if(this.state.nickname){
         this.getUserData(this.state.nickname)  
      } 
  }
  
  onLogout() {
    forgetStoredUserData()
    this.setState({...this.state, nickname: undefined})
  }
  
  onLogin(nickname) {
    updateStoredUserData(nickname)
    this.setState({...this.state, nickname: nickname})
    this.getUserData(nickname)  
 }

 getUserData(nickname) {
     var url = '/api/nicknames/' + nickname
     request.get(url)
     .send()
     .end((err, res) => {
       if (err) {
       }
       else {
         console.log(res)
         const parsed = JSON.parse(res.text) 
         this.setState({...this.state, poundsLost: parsed.poundsLost, stones: parsed.stones, showHalves: parsed.showHalves})
       }
     })
   }

 updateUserData(poundsLost,stones,showHalves){
     var url = '/api/nicknames/' + this.state.nickname
     console.log(poundsLost)
     
     request.put(url)
     .send({
         poundsLost: poundsLost,
         stones: stones,
         showHalves: showHalves
     })
     .end((err, res) => {
       if (err) {
         console.error(err)
       }
       else {
         const parsed = JSON.parse(res.text)
           this.setState({...this.state, poundsLost: parsed.poundsLost, stones: parsed.stones, showHalves: parsed.showHalves})
       }
     })
   }

	
 onDecrease(){
	 var newAmount = this.state.poundsLost - 1 
     this.setState({...this.state, poundsLost: newAmount})
     this.updateUserData(newAmount,this.state.stones,this.state.showHalves)
 }	

 onIncrease(){
	 var newAmount = this.state.poundsLost + 1 
     this.setState({...this.state, poundsLost: newAmount})
     this.updateUserData(newAmount,this.state.stones,this.state.showHalves)	
 }
	
  render() {
	if (this.state.nickname) {
	  var poundsLost = this.state.poundsLost
	  return (
       <div>   
          
    <nav className="navbar navbar-inverse">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Hello {this.state.nickname}</a>
        </div>
          { this.state.nickname ? <button className="navbar-btn btn btn-primary btn-sm navbar-right" onClick={ this.onLogout }>Logout</button> : undefined } 
      </div>
    </nav>            
        <div className="container-fluid">
            <div className="row">    
		        <button className="col-md-1 col-sm-1 col-md-offset-1 col-sm-offset-1 btn btn-primary btn-sm" onClick={this.onDecrease}>Decrease</button>
		        <p className="col-md-1 col-sm-1">{poundsLost}</p>
		        <button className="col-md-1 col-sm-1 btn btn-primary btn-sm" onClick={this.onIncrease}>Increase</button>
          
      <div className="settings-form form">
        <div className="form-group">
          <label htmlFor="stones">Stones:</label>
          <div>
            <input className="form-control" type="text" value={ this.state.stones} onChange={ this.onChangeNickname } id="nickname" />
<div className="checkbox">
  <Checkbox></Checkbox>
</div>
          </div>
        </div>
      </div>
            </div>
        <div className="row">             
        <CircularProgressBar percentage={60} initialAnimation={false} stones={5} poundsLost={poundsLost} halfStone={true}/></div>
      </div>
        </div>        
    );
    }
    return (
      <div className="container">
        <LoginForm onLogin={ this.onLogin } />
      </div>
    )
  }
}

class LoginForm extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {nickname: ''}
    this.onChangeNickname = this.onChangeNickname.bind(this)
    this.onLoginClick = this.onLoginClick.bind(this)
  }

  onChangeNickname(e) {
    this.setState({...this.state, nickname: e.target.value})
  }

  onLoginClick() {
    this.props.onLogin(this.state.nickname)
  }

  render() {
    return (
      <div className="login-form form">
        <h2>Login</h2>
        <h4>Choose a unique nickname.</h4>
        <div className="form-group">
          <label htmlFor="nickname">Nickname:</label>
          <div>
            <input className="form-control" type="text" value={ this.state.nickname } onChange={ this.onChangeNickname } id="nickname" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={ this.onLoginClick }>Login</button>
      </div>
    )
  }

}

export default App;
