import React from 'react';

import Character from '../components/Character';
import ShiftHud from '../components/ShiftHud';
import Task from '../components/Task';

import './DayShift.css';

export default class DayShift extends React.Component {
	render() {
		const {
			day,
			shift,
			characters,
			handCards,
			charactersUnplaced,
			getCharacter,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
			onStaminaChange,
			onTaskStart,
			onShiftFinish,
		} = this.props;

		return (
			<article className="o-dayShift">
				<ShiftHud
					className="o-dayShift__hud"
					day={day}
					shift={shift}
					characters={characters}
					handleFinishShift={onShiftFinish} />
				<div className="m-tasksList o-dayShift__tasks">
					{ handCards.map((task, index) => {
						return <Task
							key={`task-${index}`}
							task={task}
							character={getCharacter(task.characterId)}
							clampCharacterStat={clampCharacterStat}
							canBePlaced={canBePlaced}
							onCharacterDropped={onCharacterDropped}
							onStaminaChange={onStaminaChange}
							onTaskStart={onTaskStart} />;
					})}
				</div>
				<div className="o-characterList o-dayShift__characters">
					{ charactersUnplaced.map(character => {
						return <Character
							key={`character-${character.id}`}
							clampCharacterStat={clampCharacterStat}
							canBePlaced={canBePlaced}
							{...character} />;
					}) }
				</div>
			</article>
		);
	}
}