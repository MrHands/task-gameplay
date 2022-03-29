import React from 'react';
import DraggableCard from './DraggableCard';
import StatsItem from './StatsItem';

import './Character.scss';

export default class Character extends React.Component {
	get classes() {
		const {
			className
		} = this.props;

		const classes = ['o-character'];
		classes.push(className);

		return classes;
	}

	render() {
		const {
			id,
			name,
			stats,
			taskEffects,
			clampCharacterStat,
			children,
		} = this.props;

		return (
			<DraggableCard
				className={this.classes.join(' ')}
				id={id}
				children={children}
			>
				<h2 className="o-character__name">{name}</h2>
				<div className="m-stats o-character__stats">
					{['stamina', 'pleasure', 'passionate', 'intimate', 'submissive'].map((type, index) => {
						return (
							<StatsItem
								key={`task-${index}`}
								type={type}
								stats={stats}
								effects={taskEffects}
								clampCharacterStat={clampCharacterStat} />
						);
					})}
				</div>
			</DraggableCard>
		);
	}
}