import React from 'react';

import CharacterList from '../components/CharacterList';
import ShiftHud from '../components/ShiftHud';
import Task from '../components/Task';

import './DayShift.scss';

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