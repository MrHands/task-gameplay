import React from 'react';

import Character from './Character';
import DroppableCard from './DroppableCard';

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
			character,
			onStaminaChange,
			onTaskStart,
			clampCharacterStat,
		} = this.props;

		let characterDropped = null;

		if (character !== null) {
			const outcomeEffects = task.outcome !== '' ? task.effects : null;

			characterDropped = (
				<Character
					taskEffects={outcomeEffects}
					clampCharacterStat={clampCharacterStat}
					{...character}
				/>
			);
		} else {
			characterDropped = (
				<DroppableCard className="o-character -empty" {...this.props}>
					<h3 className="o-character__title">Drag character here</h3>
				</DroppableCard>
			);
		}

		return (
			<div className="o-task">
				<h2 className="o-task__title">{task.title}</h2>
				<div className="o-task__effects">
					<h3>Rewards</h3>
					<ul className="o-task__rewards">
					{ task.effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {this.effectText(effect)}</li>;
					})}
					</ul>
				</div>
				<div className="o-task__character">
					{characterDropped}
				</div>
				<div className="o-task__carousel">
					<TaskStart
						onStaminaChange={onStaminaChange}
						onTaskStart={onTaskStart}
						character={character}
						{...task}
					/>
				</div>
			</div>
		);
	}
}