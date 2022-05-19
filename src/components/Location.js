import React from 'react';

import Character from './Character';
import DroppableCard from './DroppableCard';

import './Location.scss';

export default class Location extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-location'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			location,
			clampCharacterStat,
		} = this.props;

		const {
			title,
			character,
		} = location;

		let characterDropped = null;

		if (character !== null) {
			// const outcomeEffects = task.outcome !== '' ? task.effects : null;

			characterDropped = (
				<Character
					// taskEffects={outcomeEffects}
					clampCharacterStat={clampCharacterStat}
					{...character}
				/>
			);
		} else {
			characterDropped = (
				<DroppableCard className="o-character -empty" {...this.props}>
					<h3 className="o-character__title">Drag character here</h3>
				</DroppableCard>
			);
		}

		return (
			<div className={this.classes.join(' ')}>
				<h2 className="m-location__title">{title}</h2>
				<div className="m-location__character">
					{characterDropped}
				</div>
			</div>
		);
	}
}