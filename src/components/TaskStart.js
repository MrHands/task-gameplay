import React from 'react';

import Carousel from './Carousel';

import './TaskStart.css';

export default class TaskStart extends React.Component {
	render() {
		const {
			handId,
			character,
			difficulty,
			roll,
			outcome,
			onTaskStart
		} = this.props;

		let start = null;
		if (outcome === '') {
			start = <button onClick={() => onTaskStart(handId)}>Start Task</button>;
		} else {
			start = <h2>{outcome.replace('_', ' ')}</h2>;
		}

		if (character !== null) {
			let carousel = null;
			if (difficulty > 0) {
				carousel = <Carousel difficulty={difficulty} roll={roll}/>;
			}

			return (
				<>
					{carousel}
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