import React from 'react';

export default class Card extends React.Component {
	render() {
		const {
			card
		} = this.props;

		return (
			<div class="o-card">
				<h2>{card.title}</h2>
			</div>
		);
	}
}
