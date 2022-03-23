import React from 'react';
import DraggableCard from './DraggableCard';
import StatsItem from './StatsItem';

import './Character.scss';

export default class Character extends React.Component {
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
				className={['o-character', this.props.className].join(' ')}
				id={id}
				children={children}
			>
				<h2 className="o-character__name">{name}</h2>
				<div className="m-stats o-character__stats">
					{['stamina', 'pleasure', 'passionate', 'intimate', 'dominant'].map((type, index) => {
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