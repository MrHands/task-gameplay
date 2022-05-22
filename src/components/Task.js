import React from 'react';
import { useDrop } from 'react-dnd';
import reactStringReplace from 'react-string-replace';

import Dice from './Dice';

import './Task.scss';

function deepClone(object) {
	return JSON.parse(JSON.stringify(object));
}

function effectText(effect) {
	const { type, value } = effect;

	switch (type) {
		case 'pleasure': {
			return `${value}%`;
		}
		default: {
			return `${value}`;
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
		description,
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
		drop: dice => onDiceDropped(dice.id, task, character),
	}), [task]);

	if (isOver && canDrop) {
		const result = canDiceBeDropped(diceDropped.id, task, character);
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
			staminaUsed = Math.max(0, Math.min(staminaUsed - diceUsed.value, difficulty));
		}
	}

	// dice element

	let diceValue = difficulty;
	if (diceUsed !== null) {
		diceValue = Math.max(0, difficulty - diceUsed.value);
	}

	let eleDice = null;
	if (task.dice !== null) {
		eleDice = (
			<Dice
				className="-drop"
				id={diceUsed.id}
				value={diceUsed.value}
				isSpent={task.outcome !== ''}
			/>
		);
	} else {
		const diceClasses = [ 'a-dice', '-drop' ];
		if (difficulty !== 0) {
			diceClasses.push('-task');
		} else {
			diceClasses.push('-empty');
		}

		eleDice = (
			<div className={diceClasses.join(' ')}>
				{(diceValue > 0 || difficulty > 0) ? diceValue : ''}
			</div>
		);
	}

	// effects

	const copyEffects = effects.map(effect => deepClone(effect));
	copyEffects.push({
		type: 'stamina',
		value: -staminaUsed
	});

	// description

	let descriptionText = description;

	const replaceText = (type) => {
		const effect = copyEffects.find(effect => effect.type === type);
		if (effect !== null) {
			descriptionText = reactStringReplace(descriptionText, `{${type}}`, () => effectText(effect));
		}
	}

	replaceText('pleasure');
	replaceText('passionate');
	replaceText('intimate');
	replaceText('submissive');

	if (diceUsed) {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => (<span class="a-emptyBox"></span>));
	}

	// start button

	console.log(`task ${task.id} difficulty ${difficulty} staminaUsed ${staminaUsed}`);

	let startDisabled = diceValue > staminaUsed || task.outcome !== '';

	let startText = `Spend ${diceValue} Stamina`;
	if (staminaUsed === 0) {
		startText = 'Start';
	}

	if (task.id === 'rest') {
		startDisabled = task.dice === null || task.outcome !== '';
		startText = 'Start';
	}

	let eleStartButton = null;
	if (difficulty > 0) {
		eleStartButton = (
			<button
				className="o-task__start"
				onClick={() => onTaskStart(character, task)}
				disabled={startDisabled}
			>
				{startText}
			</button>
		);
	}

	return (
		<div className={classes.join(' ')} ref={drop}>
			<h2 className="o-task__title">{title}</h2>
			<div className="o-task__description">
				{descriptionText}
			</div>
			<div className="o-task__container">
				<div className="o-task__container__dice-value">
					{eleDice}
				</div>
			</div>
			{eleStartButton}
		</div>
	);
}