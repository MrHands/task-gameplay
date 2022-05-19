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
			canDiceBeDropped,
			onDiceDropped,
		} = this.props;

		const {
			dice,
			title,
			difficulty,
			effects,
		} = task;

		let diceDropped = null;
		let staminaUsed = character?.stats.stamina || 0;

		if (dice !== null) {
			diceDropped = (
				<Dice
					id={dice.id}
					value={dice.value}
				/>
			);

			staminaUsed = Math.max(0, Math.min(staminaUsed, difficulty - dice.value));
		} else {
			diceDropped = (
				<DroppableDice
					className="a-dice -empty"
					canDiceBeDropped={canDiceBeDropped}
					onDiceDropped={onDiceDropped}
					{...this.props}
				/>
			);
		}

		return (
			<div className={this.classes.join(' ')}>
				<h2 className="o-task__title">{title}</h2>
				<div className="o-task__effects">
					<h3>Rewards</h3>
					<ul className="o-task__rewards">
					{ effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {this.effectText(effect)}</li>;
					})}
					</ul>
				</div>
				<div className="o-task__container">
					<h3>Stamina</h3>
					<h3>Dice</h3>
					<h3>Required</h3>
					<div className="o-task__container__stamina">
						<p>{staminaUsed}</p>
					</div>
					<div className="o-task__container__dice">
						{diceDropped}
					</div>
					<div className="o-task__container__required">
						<p>{difficulty}</p>
					</div>
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