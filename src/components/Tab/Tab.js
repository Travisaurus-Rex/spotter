import React from 'react';
import './Tab.css';

export class Tab extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		return (
			<section className="mdl-layout__tab-panel is-active">
                <div className="page-content">
                	{this.props.content}
                </div>
            </section>
		)
	}
}