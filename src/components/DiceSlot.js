import React from 'react';
import { useDrop } from 'react-dnd';

import Dice from './Dice';

export default function DiceSlot(props) {
	const {
		type,
		value,
		task,
		character,
		canDiceBeDropped,
		onDiceDropped,
	} = props;

	const {
		dice,
		outcome
	} = task;

	let diceUsed = dice;

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
		console.log(result);
		if (result[0]) {
			diceUsed = result[1];
		}
	}

	// difficulty

	let difficulty = value;
	if (diceUsed !== null) {
		switch (type) {
			case 'gate': {
				difficulty = Math.max(0, difficulty - diceUsed.value);
				break;
			}
			case 'tool': {
				difficulty = diceUsed.value;
				break;
			}
			default:
				break;
		}
	}

	// active

	let isActive = diceUsed !== null;
	if (isActive) {
		switch (type) {
			case 'gate': {
				isActive = isActive && difficulty <= 0;
				break;
			}
			default:
				break;
		}
	}

	let eleDrop = null;

	if (diceUsed !== null) {
		const diceClasses = [ '-drop' ];
		if (type === 'tool' && !isActive) {
			diceClasses.push('-empty');
		} else {
			diceClasses.push('-task');
		}

		if (isActive) {
			diceClasses.push('-active');
		}

		eleDrop = (
			<Dice
				className={diceClasses.join(' ')}
				id={diceUsed.id}
				value={difficulty}
				isSpent={outcome !== ''}
			/>
		);
	} else {
		const diceClasses = [ 'a-dice', '-drop' ];
		if (type === 'gate') {
			diceClasses.push('-task');
		} else {
			diceClasses.push('-empty');
		}

		eleDrop = (
			<div className={diceClasses.join(' ')}>
				{(difficulty > 0) ? difficulty : ''}
			</div>
		);
	}

	return <div ref={drop}>{eleDrop}</div>;
}