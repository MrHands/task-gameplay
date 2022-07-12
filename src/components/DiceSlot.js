import React from 'react';

import Dice from './Dice';

export default function DiceSlot(props) {
	const {
		type,
		value,
		diceUsed,
		outcome,
	} = props;

	let difficulty = value;
	if (diceUsed !== null) {
		difficulty = Math.max(0, difficulty - diceUsed.value);
	}

	if (diceUsed !== null) {
		return (
			<Dice
				className="-drop"
				id={diceUsed.id}
				value={difficulty}
				isSpent={outcome !== ''}
			/>
		);
	} else {
		const diceClasses = [ 'a-dice', '-drop' ];
		if (type === 'tool') {
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