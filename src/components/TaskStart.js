import React from 'react';

import Carousel from './Carousel';

import './TaskStart.css';

export default class TaskStart extends React.Component {
	render() {
		const {
			handId,
			character,
			difficulty,
			onTaskStart
		} = this.props;

		if (character !== null) {
			return (
				<>
					<Carousel difficulty={difficulty}></Carousel>
					<button onClick={() => onTaskStart(handId)}>Start Task</button>
				</>
			);
		} else {
			return (
				<div className="o-task__difficulty">Difficulty {difficulty}</div>
			);
		}
	}
}