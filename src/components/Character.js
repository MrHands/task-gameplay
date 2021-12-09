import React from 'react';
import Card from './Card';

import './Character.css';

export default class Character extends React.Component {
	render() {
		const {
			id,
			name,
			stats,
			card,
			onTaskDropped,
			onTaskCleared,
		} = this.props;

		return (
			<div className="o-character">
				<h2 className="o-character__name">{name}</h2>
				<div className="m-stats o-character__stats">
					<div className="m-stats__header">Hunger</div>
					<div className="m-stats__value">{stats.hunger}%</div>
					<div className="m-stats__header">Stress</div>
					<div className="m-stats__value">{stats.stress}%</div>
					<div className="m-stats__header">Horny</div>
					<div className="m-stats__value">{stats.horny}%</div>
				</div>
				<Card card={card} owner={id} onTaskDropped={onTaskDropped} />
				<button onClick={() => onTaskCleared(id)} disabled={!card}>
					Clear
				</button>
			</div>
		);
	}
}