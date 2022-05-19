import React from 'react';

import LocationList from '../components/LocationList';

import './DayShift.scss';

export default class DayShift extends React.Component {
	render() {
		const {
			locations,
			getCharacter,
			clampCharacterStat,
			canBePlaced,
			onDiceDropped,
			onCharacterDropped,
			onStaminaChange,
			onTaskStart,
		} = this.props;

		return (
			<article className="o-dayShift">
				<LocationList
					className="o-dayShift__locations"
					locations={locations}
					getCharacter={getCharacter}
					clampCharacterStat={clampCharacterStat}
					canBePlaced={canBePlaced}
					onDiceDropped={onDiceDropped}
					onCharacterDropped={onCharacterDropped}
					onStaminaChange={onStaminaChange}
					onTaskStart={onTaskStart}
				/>
			</article>
		);
	}
}