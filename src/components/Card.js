import React from 'react';

import './Card.css';

export default class Card extends React.Component {
	render() {
		const {
			card
		} = this.props;

		return (
			<div className="o-card">
				<h2 className="o-card__title">{card.title}</h2>
				<ul className="o-card__efects">
					{ card.effects.map(effect => {
						return <li>{effect.type} {effect.value}</li>;
					})}
				</ul>
			</div>
		);
	}
}
