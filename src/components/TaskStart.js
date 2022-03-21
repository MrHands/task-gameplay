import React from 'react';

import Carousel from './Carousel';

import './TaskStart.css';

export default class TaskStart extends React.Component {
	render() {
		const {
			assigned,
			difficulty
		} = this.props;

		if (assigned !== null) {
			return (
				<>
					<Carousel difficulty={difficulty}></Carousel>
					<button>Start Task</button>
				</>
			);
		} else {
			return (
				<div className="o-task__difficulty">Difficulty {difficulty}</div>
			);
		}
	}
}