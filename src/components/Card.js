import React from 'react';

import './Card.css';

export default class Card extends React.Component {
	render() {
		const {
			card
		} = this.props;

		return (
			<div className="o-card">
				<h2>{card.title}</h2>
			</div>
		);
	}
}
