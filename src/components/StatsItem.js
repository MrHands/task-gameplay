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
				const newValue = Math.max(0, Math.min(value + found.value, 100));

				if (newValue > value) {
					result = `${this.effectText(type, newValue)} ▲`;
					classes.push('-up');
				} else if (newValue < value) {
					result = `${this.effectText(type, newValue)} ▼`;
					classes.push('-down');
				} else {
					result = `${this.effectText(type, newValue)}} −`;
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