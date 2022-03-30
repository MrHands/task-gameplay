import React from 'react';

import CharacterStats from './CharacterStats';
import DraggableCard from './DraggableCard';

import './Character.scss';

export default class Character extends React.Component {
	get classes() {
		const {
			className,
			task
		} = this.props;

		const classes = ['o-character'];

		if (task === '') {
			classes.push('-draggable');
		}

		classes.push(className);

		return classes;
	}

	render() {
		const {
			id,
			name,
			stats,
			task,
			taskEffects,
			clampCharacterStat,
			children,
		} = this.props;

		const guts = (
			<>
				<h2 className="o-character__name">{name}</h2>
				<CharacterStats
					className="o-character__stats"
					stats={stats}
					taskEffects={taskEffects}
					clampCharacterStat={clampCharacterStat}
				/>
			</>
		);

		if (task === '') {
			return (
				<DraggableCard
					className={this.classes.join(' ')}
					id={id}
					children={children}
				>
					{guts}
				</DraggableCard>
			);
		} else {
			return (
				<div className={this.classes.join(' ')}>
					{guts}
				</div>
			);
		}
	}
}