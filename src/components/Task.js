import React from 'react';
import reactStringReplace from 'react-string-replace';

import DiceSlot from './DiceSlot';

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

	/* const [ { isOver, canDrop, diceDropped }, drop ] = useDrop(() => ({
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
	} */

	// dice element

	let diceValue = difficulty;
	if (diceUsed !== null) {
		diceValue = Math.max(0, difficulty - diceUsed.value);
	}

	// check if task is active

	let isActive = diceUsed !== null;
	if (isActive) {
		task.requirements.forEach((req) => {
			switch (req.type) {
				case 'gate': {
					isActive = isActive && diceValue <= 0;
					break;
				}
				case 'tool': {
					isActive = isActive && diceUsed !== null;
					break;
				}
				default:
					break;
			}
		});
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

	if (isActive) {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => (<span class="a-emptyBox"></span>));
	}

	if (isActive) {
		descriptionText = reactStringReplace(descriptionText, '{dice}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{dice}', () => (<span class="a-emptyBox"></span>));
	}

	return (
		<div className={classes.join(' ')}>
			<h2 className="o-task__title">{title}</h2>
			<div className="o-task__description">
				{descriptionText}
			</div>
			<div className="o-task__container">
				{task.requirements.map((req, index) => {
					return (
						<DiceSlot
							key={`req-${index}`}
							type={req.type}
							value={req.value}
							task={task}
							character={character}
							canDiceBeDropped={canDiceBeDropped}
							onDiceDropped={onDiceDropped}
						/>
					);
				})}
			</div>
		</div>
	);
}