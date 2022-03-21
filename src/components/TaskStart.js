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
			onStaminaChange,
			onTaskStart,
		} = this.props;

		let start = null;
		if (outcome === '') {
			start = <button onClick={() => onTaskStart(handId)}>Start Task</button>;
		} else {
			start = <h2>{outcome.replace('_', ' ')}</h2>;
		}

		if (character !== null) {
			let stamina = null;
			let carousel = null;
			
			if (difficulty > 0) {
				stamina = (
					<div className="o-task__stamina">
						<button onClick={() => onStaminaChange(character, -1)}>-</button>
						<div>{character.staminaCost}</div>
						<button onClick={() => onStaminaChange(character, 1)}>+</button>
					</div>
				);

				carousel = <Carousel difficulty={difficulty} roll={roll}/>;
			}

			return (
				<>
					{stamina}
					{carousel}
					{start}
				</>
			);
		} else {
			return (
				<div className={['o-task__difficulty', this.props.className].join(' ')}>
					<span>Difficulty</span>
					<span>{difficulty} / 20</span>
				</div>
			);
		}
	}
}