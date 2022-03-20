import React from 'react';
import DraggableCard from './DraggableCard';

import './Character.css';

export default class Character extends React.Component {
	renderStat(type, value, card) {
		let result = `${value}%`;
		if (card) {
			const found = card.effects.find(effect => effect.type === type);
			if (found) {
				const newValue = Math.max(0, Math.min(value + found.value, 100));
				if (newValue !== value) {
					result += ` ➔ ${newValue}%`;
				}
			}
		}
		return result;
	}

	renderPersistentStat(type, value, card) {
		let result = `${value}`;
		if (card) {
			const found = card.effects.find(effect => effect.type === type);
			if (found) {
				const newValue = value + found.value;
				if (newValue !== value) {
					result += ` ➔ ${newValue}`;
				}
			}
		}
		return result;
	}

	render() {
		const {
			name,
			stats,
		} = this.props;

		const cardShown = null;

		return (
			<DraggableCard className="o-character" {...this.props}>
				<h2 className="o-character__name">{name}</h2>
				<div className="m-stats o-character__stats">
					<div className="m-stats__header">Stamina</div>
					<div className="m-stats__value">{stats.stamina} / 5</div>
					<div className="m-stats__header">Pleasure</div>
					<div className="m-stats__value">{this.renderStat('pleasure', stats.pleasure, cardShown)}</div>
					<div className="m-stats__header">Passionate</div>
					<div className="m-stats__value">{this.renderPersistentStat('passionate', stats.passionate, cardShown)}</div>
					<div className="m-stats__header">Intimate</div>
					<div className="m-stats__value">{this.renderPersistentStat('intimate', stats.intimate, cardShown)}</div>
					<div className="m-stats__header">Dominant</div>
					<div className="m-stats__value">{this.renderPersistentStat('dominant', stats.dominant, cardShown)}</div>
				</div>
			</DraggableCard>
		);
	}
}