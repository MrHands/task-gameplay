import React from 'react';
import { useDrop } from 'react-dnd';
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
		effects,
		staminaCost,
		requirements,
	} = task;

	// check if task is active

	let isActive = requirements.reduce((previous, req) => {
		const diceValue = req.dice?.value || 0;

		switch (req.type) {
			case 'gate': {
				return previous && diceValue <= 0;
			}
			case 'tool': {
				return previous && req.dice !== null;
			}
			default:
				return previous;
		}
	}, true);

	let diceUsed = null;

	const [ { isOver, canDrop, diceDropped }, drop ] = useDrop(() => ({
		accept: 'dice',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			diceDropped: monitor.getItem(),
		}),
		drop: () => {},
	}), [task]);

	if (isOver && canDrop) {
		diceUsed = canDiceBeDropped(diceDropped.id, task, character)[1];
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

	if (diceUsed) {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{stamina}', () => (<span key="icon" className="a-emptyBox" />));
	}

	if (diceUsed) {
		descriptionText = reactStringReplace(descriptionText, '{dice}', () => diceUsed.value);
	} else {
		descriptionText = reactStringReplace(descriptionText, '{dice}', () => (<span key="icon" className="a-emptyBox" />));
	}

	return (
		<div className={classes.join(' ')} ref={drop}>
			<h2 className="o-task__title">{title}</h2>
			<div className="o-task__description">
				{descriptionText}
			</div>
			<div className="o-task__container">
				{task.requirements.map((req, index) => {
					return (
						<DiceSlot
							key={`req-${index}`}
							slotIndex={index}
							requirement={req}
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