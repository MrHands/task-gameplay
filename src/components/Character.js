import React from 'react';

import CharacterStats from './CharacterStats';
import DraggableCard from './DraggableCard';

import './Character.scss';

export default function Character(props) {
	const {
		id,
		name,
		stats,
		location,
		taskEffects,
		clampCharacterStat,
		children,
	} = props;

	const classes = (() => {
		const {
			className,
			task
		} = props;

		const classes = ['o-character'];

		if (task === '') {
			classes.push('-draggable');
		}

		classes.push(className);

		return classes;
	})();

	const guts = (
		<>
			<h2 className="o-character__name">{name}</h2>
			<CharacterStats
				className="o-character__stats"
				id={id}
				stats={stats}
				taskEffects={taskEffects}
				clampCharacterStat={clampCharacterStat}
			/>
		</>
	);

	if (location === '') {
		return (
			<DraggableCard
				className={classes.join(' ')}
				id={id}
				type="character"
				children={children}
			>
				{guts}
			</DraggableCard>
		);
	} else {
		return (
			<div className={classes.join(' ')}>
				{guts}
			</div>
		);
	}
}