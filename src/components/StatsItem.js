import React from 'react';

import './StatsItem.css';

export default class StatsItem extends React.Component {
	render() {
		const {
			type,
			stats,
			effects,
		} = this.props;

		const classes = [ 'm-statsItem' ];
		const value = stats[type];

		let result = `${value}%`;
		if (type === 'stamina') {
			result = `${value} / 5`;
		} else if (effects) {
			const found = effects.find(effect => effect.type === type);
			if (found) {
				const newValue = Math.max(0, Math.min(value + found.value, 100));
				result += ` ➔ ${newValue}%`;

				if (newValue > value) {
					result = `${newValue}% ▲`;
					classes.push('-up');
				} else if (newValue < value) {
					result = `${newValue}% ▼`;
					classes.push('-down');
				} else {
					result = `${newValue}% −`;
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