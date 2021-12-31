import React from 'react';

import DraggableCard from './DraggableCard';
import DroppableCard from './DroppableCard';
import './Card.css';

export default class Card extends React.Component {
	effectText(value) {
		if (value > 0) {
			return `+${value}%`;
		} else {
			return `${value}%`;
		}
	}

	render() {
		const {
			card,
			owner,
			onTaskDropped,
			canBePlayed,
		} = this.props;

		if (!card) {
			return (
			<DroppableCard
				className="o-card -empty"
				owner={owner}
				onTaskDropped={onTaskDropped}
				canBePlayed={canBePlayed}>
				<h2 className="o-card__title">Resting</h2>
				<ul className="o-card__effects">
					<li>stamina +50%</li>
					<li>pleasure -10%</li>
				</ul>
			</DroppableCard>
			);
		}

		return (
			<DraggableCard className="o-card" {...this.props}>
				<h2 className="o-card__title">{card.title}</h2>
				<ul className="o-card__effects">
					{ card.effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {this.effectText(effect.value)}</li>;
					})}
				</ul>
				<h3>{card.handId}</h3>
			</DraggableCard>
		);
	}
}
