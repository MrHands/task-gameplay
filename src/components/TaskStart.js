import React from 'react';

import Carousel from './Carousel';

import './TaskStart.css';

export default class TaskStart extends React.Component {
	render() {
		const {
			handId,
			character,
			difficulty,
			outcome,
			onTaskStart
		} = this.props;

		let start = null;
		if (outcome === '') {
			start = <button onClick={() => onTaskStart(handId)}>Start Task</button>;
		} else {
			start = <h2>{outcome}</h2>;
		}

		if (character !== null) {
			return (
				<>
					<Carousel difficulty={difficulty}></Carousel>
					{start}
				</>
			);
		} else {
			return (
				<div className="o-task__difficulty">Difficulty {difficulty}</div>
			);
		}
	}
}