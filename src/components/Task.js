import React from 'react';

import './Task.css';

export default class Task extends React.Component {
	effectText(effect) {
		const { type, value } = effect;

		switch (type) {
			case 'pleasure': {
				if (value > 0) {
					return `+${value}%`;
				} else {
					return `${value}%`;
				}
			}
			default: {
				if (value > 0) {
					return `+${value}`;
				} else {
					return `${value}`;
				}
			}
		}
	}

	render() {
		const {
			task,
		} = this.props;

		return (
			<div className="o-task">
				<h2 className="o-task__title">{task.title}</h2>
				<ul className="o-task__effects">
					{ task.effects.map((effect, index) => {
						return <li key={`effect-${index}`}>{effect.type} {this.effectText(effect)}</li>;
					})}
				</ul>
			</div>
		);
	}
}