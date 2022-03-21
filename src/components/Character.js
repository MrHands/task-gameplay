import React from 'react';
import DraggableCard from './DraggableCard';
import StatsItem from './StatsItem';

import './Character.css';

export default class Character extends React.Component {
	renderStat(type, value, taskEffects) {
		let result = `${value}%`;
		if (taskEffects) {
			const found = taskEffects.find(effect => effect.type === type);
			if (found) {
				const newValue = Math.max(0, Math.min(value + found.value, 100));
				if (newValue !== value) {
					result += ` ➔ ${newValue}%`;
				}
			}
		}
		return result;
	}

	renderPersistentStat(type, value, taskEffects) {
		let result = `${value}`;
		if (taskEffects) {
			const found = taskEffects.find(effect => effect.type === type);
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
			taskEffects,
		} = this.props;

		return (
			<DraggableCard className="o-character" {...this.props}>
				<h2 className="o-character__name">{name}</h2>
				<div className="m-stats o-character__stats">
					{['stamina', 'pleasure', 'passionate', 'intimate', 'dominant'].map((type, index) => {
						return (<StatsItem type={type} stats={stats} effects={taskEffects} />)
					})}
				</div>
			</DraggableCard>
		);
	}
}