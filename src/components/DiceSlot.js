import React from 'react';

import Dice from './Dice';

export default function DiceSlot(props) {
	const {
		type,
		value,
		diceUsed,
		outcome,
	} = props;

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

		return (
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

		return (
			<div className={diceClasses.join(' ')}>
				{(difficulty > 0) ? difficulty : ''}
			</div>
		);
	}
}