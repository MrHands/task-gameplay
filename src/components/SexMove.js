import React from 'react';

import DroppableCard from './DroppableCard';

import './SexMove.scss';

export default class SexMove extends React.Component {
	effectText(effect) {
		const {
			type,
			value
		} = effect;

		const valueText = value > 0 ? `+${value}` : value;

		switch (type) {
			case 'lust':
			case 'pleasure': {
				return `${valueText}%`;
			}
			default: {
				return `${valueText}`;
			}
		}
	}

	render() {
		const {
			id,
			title,
			lustMinimum,
			effects,
			canSexMoveBePlayed,
			playSexMove,
		} = this.props;

		if (id === -1) {
			return (
				<DroppableCard className="m-sexMove -empty" {...this.props}>
					<h2 className="m-sexMove__title">Select next move</h2>
				</DroppableCard>
			)
		}

		return (
			<div
				className={['m-sexMove', this.props.className].join(' ')}
				onClick={() => playSexMove(id)}
				disabled={canSexMoveBePlayed(id) ? '' : 'disabled'}
			>
				<h2 className="m-sexMove__title">{title}</h2>
				<h3 className="m-sexMove__requirements">{`Lust >= ${lustMinimum}`}</h3>
				<ul className="m-sexMove__effects">
					{effects.map((effect, index) => {
						return (
							<li key={`sex-move-effect-${index}`}>
								<h3>{effect.type}</h3>
								<h3>{this.effectText(effect)}</h3>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}