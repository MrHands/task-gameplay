import React from 'react';

import CharacterStatsItem from './CharacterStatsItem';

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
						<CharacterStatsItem
							className="m-characterStats__item"
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