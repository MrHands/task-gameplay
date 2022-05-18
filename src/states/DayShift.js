import React from 'react';

import CharacterList from '../components/CharacterList';
import Dice from '../components/Dice';
import TasksList from '../components/TasksList';

import './DayShift.scss';

export default class DayShift extends React.Component {
	render() {
		const {
			dice,
			handCards,
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
				<div className="o-dayShift__dice">
					{dice.map((value, index) => {
						return <Dice
							key={`dice-${index}`}
							value={value}
						/>;
					})}
				</div>
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