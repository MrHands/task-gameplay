import React from 'react';

import CharacterList from '../components/CharacterList';
import Task from '../components/Task';

import './DayShift.scss';

export default class DayShift extends React.Component {
	render() {
		const {
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