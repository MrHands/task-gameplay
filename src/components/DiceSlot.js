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
		const result = canDiceBeDropped(diceDropped.id, task, character, slotIndex);
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

	// active and denied

	let isActive = false;
	let isDenied = false;

	switch (type) {
		case 'gate': {
			isActive = diceUsed !== null && difficulty <= 0;
			break;
		}
		case 'tool': {
			isActive = diceUsed !== null;
			break;
		}
		case 'min': {
			isActive = diceUsed !== null && diceUsed.value >= value;
			isDenied = isOver && !isActive;
			break;
		}
		case 'max': {
			isActive = diceUsed !== null && diceUsed.value <= value;
			isDenied = isOver && !isActive;
			break;
		}
		default:
			break;
	}

	let eleDrop = null;

	let diceClasses = [ '-drop' ];

	switch (type) {
		case 'tool': {
			diceClasses.push('-empty');
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

	if (isDenied) {
		diceClasses.push('-denied');
	} else if (isActive) {
		diceClasses.push('-active');
	}

	diceClasses = [ 'a-dice' ].concat(diceClasses);

	let eleValue = <span>{difficulty}</span>;
	if (type === 'tool' && difficulty === 0) {
		eleValue = null;
	}

	let eleTitle = null;
	if (type === 'min' || type === 'max') {
		eleTitle = <span className="a-dice__title">{type}</span>
	}

	eleDrop = (
		<div className={diceClasses.join(' ')}>
			{eleTitle}
			{eleValue}
		</div>
	);

	return <div ref={drop}>{eleDrop}</div>;
}