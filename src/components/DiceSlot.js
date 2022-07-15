import React from 'react';
import { useDrop } from 'react-dnd';

export default function DiceSlot(props) {
	const {
		slotIndex,
		requirement,
		task,
		character,
		canDiceBeDropped,
		onDiceDropped,
	} = props;

	const {
		type,
		value,
		dice
	} = requirement;

	let diceUsed = dice;

	const [ { isOver, canDrop, diceDropped }, drop ] = useDrop(() => ({
		accept: 'dice',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			diceDropped: monitor.getItem(),
		}),
		drop: dice => onDiceDropped(dice.id, task, character, slotIndex),
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
			case 'min': {
				isActive = diceUsed.value >= value;
				break;
			}
			case 'max': {
				isActive = diceUsed.value <= value;
				break;
			}
			default:
				break;
		}
	}

	let eleDrop = null;

	let diceClasses = [ '-drop' ];

	switch (type) {
		case 'tool': {
			diceClasses.push(isActive ? '-task' : '-empty');
			break;
		}
		case 'min':
		case 'max': {
			diceClasses.push('-minmax');
			break;
		}
		default: {
			diceClasses.push('-task');
			break;
		}
	}

	if (isActive) {
		diceClasses.push('-active');
	}

	diceClasses = [ 'a-dice' ].concat(diceClasses);

	let eleTitle = null;
	if (type === 'min' || type === 'max') {
		eleTitle = <span className="a-dice__title">{type}</span>
	}

	eleDrop = (
		<div className={diceClasses.join(' ')}>
			{eleTitle}
			<span>{(difficulty > 0) ? difficulty : ''}</span>
		</div>
	);

	return <div ref={drop}>{eleDrop}</div>;
}