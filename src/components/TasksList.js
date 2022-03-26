import React from 'react';

import Task from '../components/Task';

import './TasksList.scss';

export default class TasksList extends React.Component {
	render() {
		const {
			handCards,
			getCharacter,
			clampCharacterStat,
			canBePlaced,
			onCharacterDropped,
			onStaminaChange,
			onTaskStart,
		} = this.props;

		return (
			<div className={['m-tasksList', this.props.className].join(' ')}>
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
		);
	}
}