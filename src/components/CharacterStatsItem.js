import React from 'react';

import './CharacterStatsItem.scss';

export default class CharacterStatsItem extends React.Component {
	get classes() {
		const {
			className,
			type,
			stats,
			effects,
			clampCharacterStat,
		} = this.props;

		const classes = ['m-characterStatsItem'];

		classes.push(`-${type}`);

		if (effects) {
			const found = effects.find(effect => effect.type === type);
			if (found) {
				const value = stats[type];
				const newValue = clampCharacterStat(type, value + found.value);

				if (newValue > value) {
					classes.push('-up');
				} else if (newValue < value) {
					classes.push('-down');
				} else {
					classes.push('-same');
				}
			}
		}

		classes.push(className);

		return classes;
	}

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
			clampCharacterStat,
		} = this.props;

		const value = stats[type];

		let result = this.effectText(type, value);
		if (effects) {
			const found = effects.find(effect => effect.type === type);
			if (found) {
				const newValue = clampCharacterStat(type, value + found.value);

				if (newValue > value) {
					result = `${this.effectText(type, newValue)} ▲`;
				} else if (newValue < value) {
					result = `${this.effectText(type, newValue)} ▼`;
				} else {
					result = `${this.effectText(type, newValue)} −`;
				}
			}
		}

		return (
			<div className={this.classes.join(' ')}>
				<div className="m-characterStatsItem__header">{type}</div>
				<div className="m-characterStatsItem__value">{result}</div>
			</div>
		)
	}
}