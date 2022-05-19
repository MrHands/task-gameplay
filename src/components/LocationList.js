import React from 'react';

import Location from './Location';

import './LocationList.scss';

export default class LocationList extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-locationList'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			locations,
			getCharacter,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
			canDiceBeDropped,
			onDiceDropped,
			onStaminaChange,
			onTaskStart,
		} = this.props;

		return (
			<div className={this.classes.join(' ')}>
				{ locations.map((location, index) => {
					return <Location
						key={`task-${index}`}
						location={location}
						getCharacter={getCharacter}
						clampCharacterStat={clampCharacterStat}
						canBePlaced={canBePlaced}
						canDiceBeDropped={canDiceBeDropped}
						onDiceDropped={onDiceDropped}
						onCharacterDropped={onCharacterDropped}
						onStaminaChange={onStaminaChange}
						onTaskStart={onTaskStart}
					/>;
				})}
			</div>
		);
	}
}