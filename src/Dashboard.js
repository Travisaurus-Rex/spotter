import React from 'react';
import './Dashboard.css';

import { Sidebar } from './Sidebar';
import { Tab } from './Tab';
import { AudioPlayer } from './AudioPlayer';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class Dashboard extends React.Component {

	access_token;

	constructor(props) {
		super(props);

		let params = this.getHashParams();
		this.access_token = params.access_token;

		if (this.access_token) {
            let token = {
                access_token: this.access_token,
                expires: Date.now() + 3600000
            };

            token = JSON.stringify(token);
            localStorage.setItem('access_token', token);

        } else if ( localStorage.getItem('access_token') ) {
            let token = localStorage.getItem('access_token');
            let now   = Date.now();

            token = JSON.parse(token);

            if ( token.expires < now ) {
                alert('Your token expired')
            } else {
                this.access_token = token.access_token;
                console.log('Your token is gud.')
                let timeLeft = ((token.expires - now) / 1000) / 60;
                console.log(`You have ${timeLeft} minutes left before your session expires.`);
            }

        } else {
			window.location = 'http://localhost:3000';
		}
		
		this.state = { 
			access_token: this.access_token, 
			api: 'https://api.spotify.com/v1/', 
			categories: [],
            loading: false,
			releases: [],
			newReleases: '',
            album: '',
			songUrl: '',
            songTitle: '',
            tab: '',
            playlist_list: '',
            playlist_single: '',
            profile: '',
		};

        this.requestSpotify     = this.requestSpotify.bind(this);
        this.saveSpotify        = this.saveSpotify.bind(this);

        this.saveTrack          = this.saveTrack.bind(this);

        this.createAlbumTrackJsx     = this.createAlbumTrackJsx.bind(this);
        this.createPlaylistTrackJsx  = this.createPlaylistTrackJsx.bind(this);

		this.getHashParams      = this.getHashParams.bind(this);
		this.getStuff           = this.getStuff.bind(this);
        this.getAlbum           = this.getAlbum.bind(this);
        this.getCategory        = this.getCategory.bind(this);
        this.getPlaylist        = this.getPlaylist.bind(this);

        this.prepareAlbum       = this.prepareAlbum.bind(this);
        this.prepareCategory    = this.prepareCategory.bind(this);
        this.prepareCategories  = this.prepareCategories.bind(this);
        this.prepareNewReleases = this.prepareNewReleases.bind(this);
        this.preparePlaylist    = this.preparePlaylist.bind(this);
        this.prepareProfile     = this.prepareProfile.bind(this);

        this.playSong           = this.playSong.bind(this);
        this.updateAddIcon      = this.updateAddIcon.bind(this);
	}

	getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    componentWillMount() {
        this.getStuff('profile')
    }

    componentDidMount() {
        this.getStuff('categories', 'tab_categories_all');
    }

    getStuff(text, id = null) {
        this.setState({loading: true});
        if (id && this.state.tab !== id) {
            this.setState({tab: id});
        }
    	let option = {};
    	switch(text) {
    		case 'categories':
    			option.url = 'browse/categories?limit=50';
    			break;
    		case 'new releases':
    			option.url = 'browse/new-releases?limit=50';
    			break;
            case 'featured playlists':
                option.url = 'browse/featured-playlists?limit=50';
                break;
            case 'profile':
                option.url = 'me';
                break;
    		default:
    			console.log('Do nothin');
    			break;
    	}
    	option.query = text;
    	this.requestSpotify(option);
    }

    getAlbum(event) {
        this.setState({loading: true});
        event.preventDefault();
        this.setState({tab: 'tab_album'});
        let option = {
            url: `albums/${event.target.id}`,
            query: 'album'
        }
        this.requestSpotify(option);
    }

    getPlaylist(event) {
        this.setState({loading: true});
        let { user_id, playlist_id } = event.target.dataset;
        let option = {
            url: `users/${user_id}/playlists/${playlist_id}`,
            query: 'playlist'
        }
        this.requestSpotify(option);
    }

    playSong(event) {
        let song   = event.currentTarget.dataset.href;
        let title  = event.currentTarget.dataset.title;
        let artist = event.currentTarget.dataset.artist;
        let tracks = document.getElementsByClassName('track');
        let data;
  
        for ( let t of tracks ) {
            t.classList.remove('currently-playing');
        }

 
            event.currentTarget.classList.add('currently-playing');
            data = (
                <h6 className="song-title">
                    {title} 
                    <span className="green"> by </span> 
                    {artist}
                </h6>
            );
            this.setState({songUrl: song});
            this.setState({songTitle: data})
            this.refs.audio.load();
    }

    requestSpotify(option) {
    	let headers = new Headers();
    	headers.set('Authorization', `Bearer ${this.state.access_token}`);

    	fetch(this.state.api + option.url, {
    		method: 'get',
    		headers: headers,
    		mode: 'cors',
    		cache: false
    	})
    		.then( res => res.json())
    		.then( res => {
    			switch(option.query) {
                    case 'categories':
    				    this.prepareCategories(res);
                        break;
                    case 'featured playlists':
                        this.prepareCategory(res);
                        break;
                    case 'category':
                        this.prepareCategory(res);
                        break;
    			    case 'new releases':
    				    this.prepareNewReleases(res);
                        break;
    			    case 'album':
                        this.prepareAlbum(res);
                        break;
                    case 'playlist':
                        this.preparePlaylist(res);
                        break;
                    case 'profile':
                        this.prepareProfile(res);
                        break;
                    default:
                        console.log('do nuthin');
                        break;
                    }
    		})
    		.catch( err => console.error(err));
    }

    saveSpotify(option) {
        let headers = new Headers();
        headers.set('Authorization', `Bearer ${this.state.access_token}`);

        fetch(this.state.api + option.url, {
            method: 'put',
            headers: headers,
            mode: 'cors',
            cache: false
        })
            .then( res => {
                switch(option.query) {
                    case 'track':
                        if (res.ok) {
                            this.updateAddIcon(option.parent);
                        }
                        break;
                    default:
                        console.log('do nuthin');
                        break;
                    }
            })
            .catch( err => console.error(err));
    }

    saveTrack(event) {
        let { id, parent_id } = event.target.dataset;
        let option = {
            url: `me/tracks?ids=${id}`,
            query: 'track',
            id: id,
            parent: parent_id
        }

        this.saveSpotify(option);
    }

    updateAddIcon(id) {
        let iconContainer = document.getElementById(id);

        iconContainer.children[0].classList.add('slide-up');
        iconContainer.children[1].classList.add('slide-up');
    }

    createAlbumTrackJsx(tracks, artist) {
        let jsx = [];
        tracks.forEach(t => {
            let track;
            if (t.preview_url) {
                track = (
                    <li key={t.name} className="track-container">
                        <span
                            className="track"
                            data-id={t.id} 
                            data-href={t.preview_url} 
                            data-title={t.name} 
                            data-artist={artist} 
                            onClick={this.playSong}
                            >
                            {t.name}
                        </span>
                        <span id={t.id} className="track-icon-container">
                            <i 
                                className="material-icons add-track" 
                                data-id={t.id} 
                                data-parent_id={t.id}
                                onClick={this.saveTrack}
                                >
                                add_circle
                            </i>
                            <i 
                                className='material-icons track-added'
                                >
                                done
                            </i>
                        </span>
                    </li>
                );
            } else {
                track = (
                    <li key={t.name} className="track-container unplayable">
                        <span
                            className="track no-preview"
                            data-id={t.id} 
                            data-title={t.name} 
                            data-artist={artist} 
                            >
                            {t.name}
                        </span>
                    </li>
                );
            }
            jsx.push(track);
        })

        return jsx;
    }

    createPlaylistTrackJsx(tracks) {

        let jsxTracks = [];

        tracks.forEach(t => {

            let jsxTrack;

            let jsxArtists = [];

            t.track.artists.forEach((artist, i) => {
                let jsxArtist;
                if (i === 0) {
                    jsxArtist = <span key={artist.name + i + "_artist_key"}>{artist.name}</span>;
                } else if (i === 1) {
                    jsxArtist = <span key={artist.name + i + "_artist_key"}><span className="green"> feat. </span>{artist.name}</span>;
                } else {
                    jsxArtist = <span key={artist.name + i + "_artist_key"}>, {artist.name}</span>;
                }

                jsxArtists.push(jsxArtist);
            })

            if (t.track.preview_url) {
                jsxTrack = (
                    <li 
                        className="track-container"
                        key={t.track.name} 
                        >
                        <div
                            className="track music-data playlist-track"
                            data-href={t.track.preview_url} 
                            data-title={t.track.name} 
                            data-artist={t.track.artists[0].name} 
                            onClick={this.playSong}
                        >
                        <h5>{t.track.name}</h5><h6><span className="green">by</span> {jsxArtists}</h6>
                        </div>
                        <span id={t.track.id} className="track-icon-container playlist-track-icon-container">
                            <i 
                                className="material-icons add-track" 
                                data-id={t.track.id} 
                                data-parent_id={t.track.id}
                                onClick={this.saveTrack}
                                >
                                add_circle
                            </i>
                            <i 
                                className='material-icons track-added'
                                >
                                done
                        </i>
                        </span>
                    </li>
                )
            } else {
                jsxTrack = (
                <li 
                    className="track-container unplayable"
                    key={t.track.name}  
                    >
                    <div
                        className="track unplayable-playlist-track no-preview"
                        data-href={null} 
                        data-title={t.track.name} 
                        data-artist={t.track.artists[0].name}
                        >
                        <h5>{t.track.name}</h5><h6>by {t.track.artists[0].name}</h6>
                    </div>
                </li>
            )
            }
            jsxTracks.push(jsxTrack);
        })
        return jsxTracks;
    }

    prepareAlbum(album) {
        
        const tracks = this.createAlbumTrackJsx(album.tracks.items, album.artists[0].name);

        const jsxAlbum = (
            <div className="album-tab">
                    <div className="album-data-container">
                        <div className="width-container">
                            <img 
                                className="album-cover" 
                                alt={album.name} 
                                src={album.images[1].url} 
                                />
                            <div className="album-meta-data">
                                <h1 className="music-data album-title">{album.name}</h1>
                                <h2 className="music-data"><span className="green">by</span> {album.artists[0].name}</h2>
                                <h5 className="music-data green">{album.label}</h5>
                                <h5 className="music-data">Released {album.release_date}</h5>
                                <h5 className="music-data">{album.genres[0]}</h5>
                                <h5 className="music-data">{album.copyrights.text}</h5>
                                <h6 className="music-data">Rating {album.popularity}</h6>
                                <a 
                                    className="ghost-button view-on-spotify"
                                    href={album.external_urls.spotify}
                                    target="__blank"
                                    >View on Spotify</a>
                            </div>
                        </div>
                    </div>
                    <div className="width-container">
                        <div className="album-tracklist-container">
                            <h5 className="music-data">Track List</h5>
                            <ol className="tracklist music-data">
                                {tracks}
                            </ol>
                        </div>
                    </div>
            </div>
        );
        
        this.setState({album: jsxAlbum, loading: false});
    }

    preparePlaylist(list) {

        let tracks = this.createPlaylistTrackJsx(list.tracks.items);

        const jsxList = (
            <div className="album-tab">
                <div className="album-data-container">
                    <div className="width-container">
                        <img src={list.images[0].url} alt={list.name} />
                        <div className="album-meta-data">
                            <h1 className="album-title">{list.name}</h1>
                            <h5 className="album-description">{list.description}</h5>
                            <a 
                                href={list.external_urls.spotify} 
                                target="__blank"
                                className="ghost-button view-on-spotify"
                                >
                                View on Spotify
                            </a>
                            <a
                                href=""
                                className="ghost-button save-playlist"
                                >
                                Save Playlist
                            </a>
                        </div>
                    </div>
                </div>
                <div className="width-container">
                    <ol className="music-data tracklist">{tracks}</ol>
                </div>
            </div>
        );

        this.setState({
            tab: 'tab_playlist_single',
            playlist_single: jsxList,
            loading: false
        })
    }

    prepareCategories(categories) {

    	let items    = categories.categories.items,
    	    newitems = [];

    	items.forEach(i => {
    		newitems.push(
                <li key={i.name.toString()} className='category-item mdl-cell mdl-cell--2-col'>
                    <img 
                        alt={i.name} 
                        src={i.icons[0].url} 
                        className='category-icon' 
                        />
                    <div className="category-name-container">
                        <span className="music-data category-name">
                            {i.name}
                        </span>
                    </div>
                    <a 
                        href='' 
                        className='category-link'  
                        data-id={i.id} 
                        onClick={this.getCategory}
                        >
                    </a>
                </li>
            );
    	})

        const jsxCategories = (
            <ul className='categories-list mdl-grid'>
                {newitems}
            </ul>
        )
  
    	this.setState({ 
            categories: jsxCategories, 
            loading: false 
        });
    }

    prepareCategory(playlists) {
        let lists = [];

        playlists.playlists.items.forEach(i => {
            lists.push(
                <li key={i.name} className="playlist mdl-cell mdl-cell--3-col">
                    <img 
                        alt={i.name} 
                        src={i.images[0].url} 
                        data-user_id={i.owner.id} 
                        data-playlist_id={i.id} 
                        onClick={this.getPlaylist} 
                        />
                </li>
            )
        })

        const jsxPlaylist = (<ul className="mdl-grid">{lists}</ul>);

        this.setState({
            playlist_list: jsxPlaylist,
            tab: 'tab_playlist_list', 
            loading: false
        });

    }

    getCategory(event) {
        event.preventDefault();
        let id = event.target.dataset.id;
        let option = {
            url: `browse/categories/${id}/playlists?limit=50`,
            query: 'category'
        }

        this.requestSpotify(option);
    }

    prepareNewReleases(releases) {

    	let albums = releases.albums.items;

    	let newAlbums = [];

    	albums.forEach(a => {
    		newAlbums.push(
                <li key={a.name.toString()} 
                    className="album-item mdl-cell mdl-cell--3-col" 
                    id={a.href}
                    >
                    <img 
                        alt={a.name} 
                        src={a.images[1].url} 
                        />
                    <span className="music-data">
                        <p>{a.artists[0].name}</p>
                        <p>{a.name}</p>
                    </span>
                    <a 
                        href="" 
                        id={a.id}
                        onClick={this.getAlbum}></a>
                </li>
            )	
    	})

        const jsxAlbums = (
            <ul className='albums-list mdl-grid'>
                {newAlbums}
            </ul>
        )

    	this.setState({ 
            releases: jsxAlbums, 
            loading: false 
        });
    }

    prepareProfile(profile) {
        console.log(profile);
        let jsxProfile,
            name;

        if (profile.display_name) {
            name = profile.display_name;
        } else {
            name = profile.id;
        }

        if (profile.images[0]) {

            console.log(profile.images[0]);

        }

        if (profile.images[0]) {
            jsxProfile = (
                <div className="profile">
                    <div className="profile-picture-container">
                        <img 
                            id="profile-picture"
                            className="profile-picture" 
                            src={profile.images[0].url} 
                            alt="user profile image"
                            />
                    </div>
                    <span className="username">{name}</span>
                </div>
            );
        } else {
            jsxProfile = (
                <div className="profile">
                    <div className="profile-picture-container">
                        <img 
                            className="profile-picture"
                            src="../static/img/pic.jpg"
                            alt="user profile image"
                            />
                    </div>
                    <span className="username">{name}</span>
                </div>
            );
        }
        this.setState({profile: jsxProfile});
    }

	render() {
		return ( 
			<div className='dashboard-page mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-tabs'>
                <Sidebar 
                    action={this.getStuff} 
                    profile={this.state.profile} 
                    />
                <main className="mdl-layout__content">
                <div className="loading-container">
                    { this.state.loading &&
                        <div id="p2" className="loading-thingy mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
                    }
                </div>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={200}
                    >
                { this.state.tab === 'tab_categories_all' &&
                    <Tab content={this.state.categories} />
                }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={200}
                    >
                { this.state.tab === 'tab_newreleases' &&
                    <Tab content={this.state.releases} />
                }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={200}
                    >
                { this.state.tab === 'tab_album' &&
                    <Tab content={this.state.album} />
                }  
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={400}
                    transitionLeaveTimeout={200}
                    >
                { this.state.tab === 'tab_playlist_list' &&
                    <Tab content={this.state.playlist_list} />
                }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="fade"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={200}
                    >
                { this.state.tab === 'tab_playlist_single' &&
                    <Tab content={this.state.playlist_single} />
                }
                </ReactCSSTransitionGroup>
                <AudioPlayer music={this.state.songUrl} data={this.state.songTitle} ref="audio" />
                </main>
			</div>
		)
	}
}