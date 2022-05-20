import React from 'react';
import { useDrop } from 'react-dnd';

import Dice from './Dice';

import './Task.scss';

function deepClone(object) {
	return JSON.parse(JSON.stringify(object));
}

function effectText(effect) {
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

export default function Task(props) {
	const {
		task,
		character,
		canDiceBeDropped,
		onDiceDropped,
		onTaskStart,
	} = props;

	const classes = (() => {
		const {
			className,
		} = props;

		const classes = ['o-task'];

		classes.push(className);

		return classes;
	})();

	const {
		title,
		difficulty,
		effects,
	} = task;

	let diceUsed = task.dice;

	const [ { isOver, canDrop, diceDropped }, drop ] = useDrop(() => ({
		accept: 'dice',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			diceDropped: monitor.getItem(),
		}),
		drop: dice => onDiceDropped(dice.id, task),
	}), [task]);

	if (isOver && canDrop) {
		const result = canDiceBeDropped(diceDropped.id, task);
		if (result[0]) {
			diceUsed = result[1];
			classes.push('-active');
		} else {
			classes.push('-denied');
		}
	}

	// stamina

	let staminaUsed = Math.min(character?.stats.stamina || 0, difficulty);
	if (diceUsed !== null) {
		if (task.id === 'rest') {
			staminaUsed = -diceUsed.value;
		} else {
			staminaUsed = Math.max(0, Math.min(staminaUsed, difficulty - diceUsed.value));
		}
	}

	const textStamina = (diceUsed !== null) ? `${staminaUsed} ▼` : staminaUsed;

	// dice element

	let eleDice = null;

	if (task.dice !== null) {
		console.log(task);
		eleDice = (
			<Dice
				id={diceUsed.id}
				value={diceUsed.value}
				isSpent={task.outcome !== ''}
			/>
		);
	} else {
		eleDice = (
			<div className="a-dice -empty">
				{(task.id === 'rest' && diceUsed !== null) ? diceUsed.value : staminaUsed}
			</div>
		);
	}

	// effects

	const copyEffects = effects.map(effect => deepClone(effect));
	copyEffects.push({
		type: 'stamina',
		value: -staminaUsed
	});

	// start button

	let startDisabled = difficulty > staminaUsed || task.outcome !== '';

	let startText = `Spend ${Math.min(staminaUsed, difficulty)} Stamina`;
	if (staminaUsed === 0) {
		startText = 'Start';
	}

	if (task.id === 'rest') {
		startDisabled = task.dice === null || task.outcome !== '';
		startText = 'Start';
	}

	return (
		<div className={classes.join(' ')} ref={drop}>
			<h2 className="o-task__title">{title}</h2>
			<div className="o-task__effects">
				<h3>Rewards</h3>
				<ul className="o-task__rewards">
				{ copyEffects.map((effect, index) => {
					return <li key={`effect-${index}`}>{effect.type} {effectText(effect)}</li>;
				})}
				</ul>
			</div>
			<div className="o-task__container">
				<div className="o-task__container__dice-value">
					{eleDice}
				</div>
			</div>
			<button
				className="o-task__start"
				onClick={() => onTaskStart(character, task)}
				disabled={startDisabled}
			>
				{startText}
			</button>
		</div>
	);
}