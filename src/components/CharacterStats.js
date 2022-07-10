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
			id,
			stats,
			taskEffects,
			clampCharacterStat
		} = this.props;

		let statsList = ['pleasure', 'passionate', 'intimate', 'submissive'];
		if (id === 1000) {
			statsList = ['stamina'];
		}

		return (
			<div className={this.classes.join(' ')}>
				{statsList.map((type, index) => {
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