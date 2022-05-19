import React from 'react';
import { useDrop } from 'react-dnd';

import Dice from './Dice';

import './Task.scss';

function effectText(effect) {
	const { type, value } = effect;

	switch (type) {
		case 'pleasure': {
			if (value > 0) {
				return `+${value}%`;
			} else {
				return `${value}%`;
			}
		}
		default: {
			if (value > 0) {
				return `+${value}`;
			} else {
				return `${value}`;
			}
		}
	}
}

export default function Task(props) {
	const {
		className,
		task,
		character,
		canDiceBeDropped,
		onDiceDropped,
	} = props;

	const classes = ['o-task'];

	classes.push(className);

	const {
		title,
		difficulty,
		effects,
	} = task;

	const [ { isOver, canDrop, diceDropped }, drop ] = useDrop(() => ({
		accept: 'dice',
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
			diceDropped: monitor.getItem(),
		}),
		drop: dice => onDiceDropped(dice.id, task),
	}), [task]);

	let diceUsed = task.dice;

	if (isOver && canDrop) {
		const result = canDiceBeDropped(diceDropped.id, task);
		if (result[0]) {
			diceUsed = result[1];
			console.log(diceDropped);
			classes.push('-active');
		} else {
			classes.push('-denied');
		}
	}

	let staminaUsed = Math.min(character?.stats.stamina || 0, difficulty);

	let eleDice = null;

	if (task.dice !== null) {
		eleDice = (
			<Dice
				id={diceUsed.id}
				value={diceUsed.value}
			/>
		);
	} else {
		eleDice = (
			<div className="a-dice -empty" />
		);
	}

	let textStamina = staminaUsed;
	if (diceUsed !== null) {
		staminaUsed = Math.max(0, Math.min(staminaUsed, difficulty - diceUsed.value));
		textStamina = `${staminaUsed} ▼`;
	}

	let guts = null;
	if (task.id !== 'rest') {
		guts = (<>
			<h3 className="o-task__container__stamina-title">
				Stamina
			</h3>
			<p className="o-task__container__stamina-value">
				{textStamina}
			</p>
			<h3 className="o-task__container__dice-title">
				Dice
			</h3>
			<div className="o-task__container__dice-value">
				{eleDice}
			</div>
			<h3 className="o-task__container__required-title">
				Required
			</h3>
			<p className="o-task__container__required-value">
				{difficulty}
			</p>
		</>);
	} else {
		guts = (<>
			<h3 className="o-task__container__dice-title">
				Dice
			</h3>
			<div className="o-task__container__dice-value">
				{eleDice}
			</div>
		</>)
	}

	return (
		<div className={classes.join(' ')} ref={drop}>
			<h2 className="o-task__title">{title}</h2>
			<div className="o-task__effects">
				<h3>Rewards</h3>
				<ul className="o-task__rewards">
				{ effects.map((effect, index) => {
					return <li key={`effect-${index}`}>{effect.type} {effectText(effect)}</li>;
				})}
				</ul>
			</div>
			<div className="o-task__container">
				{guts}
			</div>
			{/* 
			<div className="o-task__carousel">
				<TaskStart
					onStaminaChange={onStaminaChange}
					onTaskStart={onTaskStart}
					character={character}
					{...task}
				/>
			</div> */}
		</div>
	);
}