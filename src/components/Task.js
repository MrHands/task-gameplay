import React from 'react';

import Dice from './Dice';
import DroppableDice from './DroppableDice';

import './Task.scss';

export default class Task extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['o-task'];

		classes.push(className);

		return classes;
	}

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

		const {
			dice
		} = task;

		let diceDropped = null;

		if (dice !== null) {
			diceDropped = (
				<Dice
					id={dice.id}
					value={dice.value}
				/>
			);
		} else {
			diceDropped = (
				<DroppableDice className="a-dice -empty" {...this.props} />
			);
		}

		return (
			<div className={this.classes.join(' ')}>
				<h2 className="o-task__title">{task.title}</h2>
				<div className="o-task__effects">
					<h3>Rewards</h3>
					<ul className="o-task__rewards">
					{ task.effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {this.effectText(effect)}</li>;
					})}
					</ul>
				</div>
				<div className="o-task__required">
					<h3>Required</h3>
				</div>
				<div className="o-task__dice">
					{diceDropped}
				</div>
				{/* 
				<div className="o-task__carousel">
					<TaskStart
						onStaminaChange={onStaminaChange}
						onTaskStart={onTaskStart}
						character={character}
						{...task}
					/>
				</div> */}
			</div>
		);
	}
}