import React from 'react';

import Task from '../components/Task';

import './TasksList.scss';

export default class TasksList extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-tasksList'];

		classes.push(className);

		return classes;
	}

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
			<div className={this.classes.join(' ')}>
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