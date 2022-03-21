import React from 'react';

import './StatsItem.css';

export default class StatsItem extends React.Component {
	effectText(type, value) {
		switch (type) {
			case 'stamina': {
				return `${value} / 5`
			}
			case 'pleasure': {
				return `${value}%`;
			}
			default: {
				return `${value}`;
			}
		}
	}

	clampedValue(type, value) {
		let maxValue = Infinity;

		switch (type) {
			case 'stamina': {
				maxValue = 5;
				break;
			}
			case 'pleasure': {
				maxValue = 100;
				break;
			}
			default: {
				break;
			}
		}

		return Math.max(0, Math.min(value, maxValue));
	}

	render() {
		const {
			type,
			stats,
			effects,
		} = this.props;

		const classes = [ 'm-statsItem' ];
		const value = stats[type];

		let result = this.effectText(type, value);
		if (effects) {
			const found = effects.find(effect => effect.type === type);
			if (found) {
				const newValue = this.clampedValue(type, value + found.value);

				if (newValue > value) {
					result = `${this.effectText(type, newValue)} ▲`;
					classes.push('-up');
				} else if (newValue < value) {
					result = `${this.effectText(type, newValue)} ▼`;
					classes.push('-down');
				} else {
					result = `${this.effectText(type, newValue)} −`;
					classes.push('-same');
				}
			}
		}

		return (
			<div className={classes.join(' ')}>
				<div className="m-statsItem__header">{type}</div>
				<div className="m-statsItem__value">{result}</div>
			</div>
		)
	}
}