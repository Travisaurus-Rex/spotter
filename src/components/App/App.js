import React, { Component } from 'react';
import './App.css';

export class App extends Component {

  client_id = '991b886572774be4aa5669dfa890e829';
  client_secret = 'ad90db290e7346b89b641849a33bc831';
  redirect_uri = 'http://localhost:3000/dashboard';



  constructor(props) {
    super(props);

    this.state = { uri: `https://accounts.spotify.com/authorize?client_id=${this.client_id}&response_type=token&redirect_uri=${this.redirect_uri}&state=boobs&scope=user-library-modify`};

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    window.location = this.state.uri;
  }

  render() {
    return (
      <div className='page-container'>
        <div className='introduction'>
            <div className='intro-text-box'>
              <h1>Spotter</h1>
              <h3>is a simple user interface for discovering new music with the Spotify API.</h3>
            </div>
            <h1 className='login-prompt-text'>This application requires a Spotify account.</h1>
            <div className='button-container'>
            <button className='login-button' onClick={this.handleLogin}>Login with Spotify</button>
            </div>
        </div>
      </div>
    );
  }
}


