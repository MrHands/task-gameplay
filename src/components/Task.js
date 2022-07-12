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
		staminaCost,
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
		if (staminaCost > 0) {
			diceClasses.push('-task');
		} else {
			diceClasses.push('-empty');
		}

		eleDice = (
			<div className={diceClasses.join(' ')}>
				{(diceValue > 0 || staminaCost > 0) ? diceValue : ''}
			</div>
		);
	}

	// effects

	const copyEffects = effects.map(effect => deepClone(effect));
	copyEffects.push({
		type: 'stamina',
		value: -staminaCost
	});

	// description

	let descriptionText = description;

	const replaceEffectText = (type) => {
		const effect = copyEffects.find(effect => effect.type === type);
		if (effect !== null) {
			descriptionText = reactStringReplace(descriptionText, `{${type}}`, () => effectText(effect));
		}
	}

	replaceEffectText('pleasure');
	replaceEffectText('passionate');
	replaceEffectText('intimate');
	replaceEffectText('submissive');

	const replaceStatText = (type) => {
		let value = 0;
		if (character !== null && type in character.stats) {
			value = character.stats[type];
		}
		descriptionText = reactStringReplace(descriptionText, `{${type}_lvl}`, () => value);
	}

	replaceStatText('passionate');
	replaceStatText('intimate');
	replaceStatText('submissive');

	if (staminaCost > 0) {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => staminaCost);
	} else if (diceUsed) {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => (<span class="a-emptyBox"></span>));
	}

	if (diceUsed) {
		descriptionText = reactStringReplace(descriptionText, '{dice}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{dice}', () => (<span class="a-emptyBox"></span>));
	}

	// start button

	console.log(`task ${task.id} difficulty ${difficulty} staminaCost ${staminaCost}`);

	const characterStamina = character?.stats.stamina || 0;
	let startDisabled = diceValue > 0 || staminaCost > characterStamina;

	if (task.id === 'rest') {
		startDisabled = task.dice === null || task.outcome !== '';
	}

	let eleStartButton = null;
	if (task.id !== 'rest') {
		eleStartButton = (
			<button
				className="o-task__start"
				onClick={() => onTaskStart(character, task)}
				disabled={startDisabled}
			>
				Start Task
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