import React from 'react';
import './Sidebar.css';

export class Sidebar extends React.Component {
	constructor(props) {
		super(props);

		this.activateLink  = this.activateLink.bind(this);
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.search        = this.search.bind(this);
		this.blurred       = this.blurred.bind(this);

		this.state = {
			menuActive: false,
			q: '',
		};
	}

	activateLink(event) {
		event.preventDefault();
		this.props.action(event.target.dataset.request, event.target.dataset.id);
		var el = document.getElementsByClassName('sidebar-link');
		for (let e of el) {
			e.classList.remove('activated-link');
		}
		event.target.classList.add('activated-link');
		if (this.state.menuActive) {
			this.toggleSidebar();
		}
	}

	toggleSidebar() {
		let sidebar = document.querySelector('#sidebar');
		let bool    = !this.state.menuActive;

		if (bool) {
			sidebar.classList.remove('slide-out');
			sidebar.classList.add('slide-in');
		} else {
			sidebar.classList.add('slide-out');
			sidebar.classList.remove('slide-in');
		}
		this.setState({menuActive: bool});
	}

	search(event) {
		let label = document.querySelector('.search-input-label');
		label.style.visibility = 'hidden';

		let { value: query } = event.target;
		this.setState({q: query});
		if (event.keyCode === 13) {
			console.log('you hit enter, this would be a good time to send that search query to spotify eh?');
			console.log(`You searched for ${query}`);
		}
	}

	blurred(event) {
		event.target.value = "";
		let label = document.querySelector('.search-input-label');
		label.style.visibility = 'visible';
	}

	render() {
		return (
			<div id="sidebar" className="mdl-layout__drawer">
				<div className="hamburger" onClick={this.toggleSidebar}>
					<div className="line"></div>
					<div className="line"></div>
					<div className="line"></div>
				</div>
                <span className="mdl-layout-title">Spotter</span>
                <div className="thingy1 thingy2">
                	{this.props.profile}
                	<div className="mdl-textfield mdl-js-textfield">
					    <input 
					    	className="mdl-textfield__input search-input" 
					    	type="text" 
					    	onKeyDown={this.search}
					    	onBlur={this.blurred}
					    	/>
					    <label className="mdl-textfield__label search-input-label">Search</label>
					</div>
                	<span 
                		className="sidebar-link activated-link"
                		data-request='categories' 
                		data-id="tab_categories_all" 
                		onClick={ this.activateLink }
                		>
                		categories
                	</span>
                	<span 
                		className="sidebar-link"
                		data-request='featured playlists' 
                		data-id="tab_playlist_list" 
                		onClick={ this.activateLink }
                		>
                		featured playlists
                	</span>
                    <span 
                    	className="sidebar-link"
                    	data-request='new releases'  
                    	data-id="tab_newreleases" 
                    	onClick={ this.activateLink }
                    	>
                    	new releases
                    </span>
                </div>
            </div>
		)
	}
}