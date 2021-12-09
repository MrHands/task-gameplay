import React from 'react';

import DraggableCard from './DraggableCard';
import DroppableCard from './DroppableCard';
import './Card.css';

export default class Card extends React.Component {
	render() {
		const {
			card,
			onTaskDropped,
		} = this.props;

		if (!card) {
			return <DroppableCard className="o-card -empty" onTaskDropped={onTaskDropped} />;
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
