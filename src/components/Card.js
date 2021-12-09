import React from 'react';

import DraggableCard from './DraggableCard';
import './Card.css';

export default class Card extends React.Component {
	render() {
		const {
			card
		} = this.props;

		if (!card) {
			return <div className="o-card -empty" />;
		}

		return (
			<DraggableCard className="o-card" {...this.props}>
				<h2 className="o-card__title">{card.title}</h2>
				<ul className="o-card__efects">
					{ card.effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {effect.value}</li>;
					})}
				</ul>
			</DraggableCard>
		);
	}
}
