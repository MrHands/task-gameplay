import React from 'react';

import Character from './Character';

import './Location.scss';
import TasksList from './TasksList';

export default function Location(props) {
	const {
		location,
		clampCharacterStat,
		canBePlaced,
		onCharacterDropped,
		canDiceBeDropped,
		onDiceDropped,
		onStaminaChange,
		onTaskStart,
	} = props;

	const {
		title,
		character,
		tasks,
	} = location;

 	const getClasses = () => {
		const {
			className,
		} = props;

		const classes = ['m-location'];

		classes.push(className);

		return classes;
	};

	let characterDropped = null;

	if (character !== null) {
		characterDropped = (
			<Character
				clampCharacterStat={clampCharacterStat}
				{...character}
			/>
		);
	} else {
		characterDropped = (
			<div className="o-character -empty" disabled>
				<h3 className="o-character__title">No character on location</h3>
			</div>
		);
	}

	return (
		<div className={getClasses().join(' ')} disabled={character === null}>
			<h2 className="m-location__title">{title}</h2>
			<div className="m-location__character">
				{characterDropped}
			</div>
			<TasksList
				className="m-location__tasks"
				handCards={tasks}
				character={character}
				location={location}
				clampCharacterStat={clampCharacterStat}
				canBePlaced={canBePlaced}
				onCharacterDropped={onCharacterDropped}
				canDiceBeDropped={canDiceBeDropped}
				onDiceDropped={onDiceDropped}
				onStaminaChange={onStaminaChange}
				onTaskStart={onTaskStart}
			/>
		</div>
	);
}