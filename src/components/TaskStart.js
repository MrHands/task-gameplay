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
				if (outcome === '') {
					stamina = (
						<>
							<h3>Stamina Cost</h3>
							<div className="o-task__stamina">
								<button onClick={() => onStaminaChange(character, -1)}>-</button>
								<div>{character.staminaCost}</div>
								<button onClick={() => onStaminaChange(character, 1)}>+</button>
							</div>
						</>
					);
				}

				carousel = (
					<Carousel
						difficulty={difficulty}
						bonus={character.staminaCost - 1}
						roll={roll}
					/>
				);
			}

			return (
				<div className={['m-taskStart', this.props.className].join(' ')}>
					{stamina}
					{carousel}
					{start}
				</div>
			);
		} else {
			return (
				<div className="o-task__difficulty">
					<span>Difficulty</span>
					<span>{difficulty} / 20</span>
				</div>
			);
		}
	}
}