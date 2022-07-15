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

	// active and denied

	let isActive = false;
	let isDenied = false;

	if (diceUsed !== null) {
		switch (type) {
			case 'gate': {
				isActive = difficulty <= 0;
				break;
			}
			case 'min': {
				isActive = diceUsed.value >= value;
				isDenied = !isActive;
				break;
			}
			case 'max': {
				isActive = diceUsed.value <= value;
				isDenied = !isActive;
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

	if (isDenied) {
		diceClasses.push('-denied');
	} else if (isActive) {
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
			<span>{difficulty}</span>
		</div>
	);

	return <div ref={drop}>{eleDrop}</div>;
}