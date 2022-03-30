import React from 'react';

import StatsItem from './StatsItem';

import './CharacterStats.scss';

export default class CharacterStats extends React.Component {
	get classes() {
		const {
			className,
		} = this.props;

		const classes = ['m-characterStats'];

		classes.push(className);

		return classes;
	}

	render() {
		const {
			stats,
			taskEffects,
			clampCharacterStat
		} = this.props;

		return (
			<div className={this.classes.join(' ')}>
				{['stamina', 'pleasure', 'passionate', 'intimate', 'submissive'].map((type, index) => {
					return (
						<StatsItem
							key={`character-stats-${index}`}
							type={type}
							stats={stats}
							effects={taskEffects}
							clampCharacterStat={clampCharacterStat} />
					);
				})}
			</div>
		);
	}
}