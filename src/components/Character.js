import React from 'react';
import Card from './Card';

import './Character.css';

export default class Character extends React.Component {
	renderStat(value) {
		return `${value * 10}%`;
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
					<div className="m-stats__header">Hunger</div>
					<div className="m-stats__value">{this.renderStat(stats.hunger)}</div>
					<div className="m-stats__header">Stress</div>
					<div className="m-stats__value">{this.renderStat(stats.stress)}</div>
					<div className="m-stats__header">Horny</div>
					<div className="m-stats__value">{this.renderStat(stats.horny)}</div>
				</div>
				<Card card={card} owner={id} onTaskDropped={onTaskDropped} canBePlayed={canBePlayed} />
				<button onClick={() => onTaskCleared(id)} disabled={!card}>
					Clear
				</button>
			</div>
		);
	}
}