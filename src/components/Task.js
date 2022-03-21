import React from 'react';

import Character from './Character';
import DroppableCard from './DroppableCard';
import Card from './Card';

import './Task.css';
import TaskStart from './TaskStart';

export default class Task extends React.Component {
	effectText(effect) {
		const { type, value } = effect;

		switch (type) {
			case 'pleasure': {
				if (value > 0) {
					return `+${value}%`;
				} else {
					return `${value}%`;
				}
			}
			default: {
				if (value > 0) {
					return `+${value}`;
				} else {
					return `${value}`;
				}
			}
		}
	}

	render() {
		const {
			task,
			onTaskStart,
		} = this.props;

		let characterDropped = null;

		if (task.character !== null) {
			characterDropped = <Character {...task.character} taskEffects={task.effects} />;
		} else {
			characterDropped = (
				<DroppableCard className="o-card -empty" {...this.props}>
					<h3 className="o-card__title">Drag character here</h3>
				</DroppableCard>
			);
		}

		return (
			<div className="o-task">
				<h2 className="o-task__title">{task.title}</h2>
				<ul className="o-task__effects">
					{ task.effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {this.effectText(effect)}</li>;
					})}
				</ul>
				<div className="o-task__character">
					{characterDropped}
				</div>
				<div className="o-task__carousel">
					<TaskStart {...task} onTaskStart={onTaskStart} />
				</div>
			</div>
		);
	}
}