import React from 'react';
import './AudioPlayer.css';

export class AudioPlayer extends React.Component {

	constructor(props) {
		super(props);

		this.play          = this.play.bind(this);
		this.pause         = this.pause.bind(this);
		this.errorHandler  = this.errorHandler.bind(this);
		this.update        = this.update.bind(this);
		this.clickSlider   = this.clickSlider.bind(this);
		this.currentTime   = this.currentTime.bind(this);
		this.clickRange    = this.clickRange.bind(this);

		this.state = {
			isPlaying: false,
			currentTime: 0
		};
	}

	errorHandler(event) {
		console.log(event);
	}

	load() {
		let audio = document.querySelector('#audio');
		audio.load();
		this.play();
	}

	play() {
		let playing = this.state.isPlaying;
		if (!playing) {
			let audio = document.querySelector('#audio');
			audio.play();
			this.setState({isPlaying: !playing});
		}
	}

	pause() {
		let playing = this.state.isPlaying;
		if (playing) {
			let audio = document.querySelector('#audio');
			audio.pause();
			this.setState({isPlaying: !playing});
		}
	}

	update(event) {
		let audio = document.querySelector('#audio'),
			track = document.querySelector('#player-track'),
			lower = document.querySelector('.mdl-slider__background-lower'),
			upper = document.querySelector('.mdl-slider__background-upper');
		track.value = audio.currentTime;
		if (track.value > 0) {
			track.classList.remove('is-lowest-value');
		}

		let val1 = audio.currentTime / audio.duration;
		let val2 = (audio.duration - audio.currentTime) / audio.duration;
		lower.style.flex = `${val1} 1 0%`;
		upper.style.flex = `${val2} 1 0%`;

		this.currentTime(track.value);

		if (audio.currentTime === audio.duration) {
			this.pause();
		}
	}

	clickSlider(event) {
		let audio = document.querySelector('#audio'),
			track = document.querySelector('#player-track');
		audio.currentTime = event.target.value;
		track.value = event.target.value;
		this.play();
	}

	clickRange(event) {
		this.pause();
		let audio = document.querySelector('#audio'),
			track = document.querySelector('#player-track');
		audio.currentTime = event.target.value;
		track.value = event.target.value;
	}

	currentTime(num) {
		this.setState({ currentTime: num });
	}
	
	render() {
		return (
			<div>
				<audio id="audio" autoPlay onError={this.errorHandler} onTimeUpdate={this.update}>
				  <source src={this.props.music}></source>
				</audio>
				<div id="player">
					{this.props.data}
					<div className="player-controls">
					{ !this.state.isPlaying &&
						<i className="material-icons icon" onClick={this.play}>play_arrow</i>
					}
					{ this.state.isPlaying &&
						<i className="material-icons icon" onClick={this.pause}>pause</i>
					}
						<p className="range-container"><input id="player-track" className="mdl-slider mdl-js-slider" onMouseDown={this.clickRange} onMouseUp={this.clickSlider} type="range" min="0" max="30" defaultValue="0" tabIndex="0" /></p>
	  					<span className="time">0:{this.state.currentTime < 10 && 
	  						0
	  					}{this.state.currentTime}</span>
  					</div>
				</div>
			</div>
		)
	}
}