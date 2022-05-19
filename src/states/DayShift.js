import React from 'react';

import CharacterList from '../components/CharacterList';
import LocationList from '../components/LocationList';
import TasksList from '../components/TasksList';

import './DayShift.scss';

export default class DayShift extends React.Component {
	render() {
		const {
			handCards,
			locations,
			charactersUnplaced,
			getCharacter,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
			onStaminaChange,
			onTaskStart,
		} = this.props;

		return (
			<article className="o-dayShift">
				<LocationList
					className="o-dayShift__locations"
					locations={locations}
					clampCharacterStat={clampCharacterStat}
				/>
				<TasksList 
					className="o-dayShift__tasks"
					handCards={handCards}
					getCharacter={getCharacter}
					clampCharacterStat={clampCharacterStat}
					canBePlaced={canBePlaced}
					onCharacterDropped={onCharacterDropped}
					onStaminaChange={onStaminaChange}
					onTaskStart={onTaskStart}
				/>
				<CharacterList
					className="o-dayShift__characters"
					characters={charactersUnplaced}
					clampCharacterStat={clampCharacterStat}
					canBePlaced={canBePlaced}
				/>
			</article>
		);
	}
}