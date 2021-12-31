import React from 'react';
import Card from './Card';

import './Character.css';

export default class Character extends React.Component {
	renderStat(type, value, card) {
		let result = `${value * 10}%`;
		if (card) {
			const found = card.effects.find(effect => effect.type === type);
			if (found) {
				result += ` ➔ ${(value + found.value) * 10}%`;
			}
		}
		return result;
	}

	render() {
		const {
			id,
			name,
			stats,
			card,
			onTaskDropped,
			onTaskCleared,
			canBePlayed,
		} = this.props;

		return (
			<div className="o-character">
				<h2 className="o-character__name">{name}</h2>
				<div className="m-stats o-character__stats">
					<div className="m-stats__header">Stamina</div>
					<div className="m-stats__value">{this.renderStat('stamina', stats.stamina, card)}</div>
					<div className="m-stats__header">Pleasure</div>
					<div className="m-stats__value">{this.renderStat('pleasure', stats.pleasure, card)}</div>
					<div className="m-stats__header">Passionate</div>
					<div className="m-stats__value">{this.renderStat('passionate', stats.passionate, card)}</div>
					<div className="m-stats__header">Intimate</div>
					<div className="m-stats__value">{this.renderStat('intimate', stats.intimate, card)}</div>
					<div className="m-stats__header">Dominant</div>
					<div className="m-stats__value">{this.renderStat('dominant', stats.dominant, card)}</div>
				</div>
				<Card card={card} owner={id} onTaskDropped={onTaskDropped} canBePlayed={canBePlayed} />
				<button onClick={() => onTaskCleared(id)} disabled={!card}>
					Clear
				</button>
			</div>
		);
	}
}