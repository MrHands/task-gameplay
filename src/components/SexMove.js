import React from 'react';

import DroppableCard from './DroppableCard';

import './SexMove.scss';

export default class SexMove extends React.Component {
	get classes() {
		const {
			className,
			mood,
			id,
			type,
		} = this.props;

		const classes = ['m-sexMove'];

		if (id === -1) {
			classes.push('-empty');
		}

		if (mood === type) {
			classes.push('-match');
		}

		classes.push(className);

		return classes;
	}

	effectText(effect, match) {
		const {
			type,
			value
		} = effect;

		const valueBonus = (match && type === 'lust') ? (value * 2) : value;
		const valueText = (valueBonus > 0) ? `+${valueBonus}` : valueBonus;

		switch (type) {
			case 'lust':
			case 'crew':
			case 'captain':
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
			mood,
			id,
			title,
			type,
			lustMinimum,
			effects,
			canSexMoveBePlayed,
			playSexMove,
		} = this.props;

		if (id === -1) {
			return (
				<DroppableCard
					{...this.props}
					className={this.classes.join(' ')}
				>
					<h2 className="m-sexMove__title">Select next move</h2>
				</DroppableCard>
			)
		}

		return (
			<div
				className={this.classes.join(' ')}
				onClick={(event) => {
					event.stopPropagation();
					playSexMove(id);
				}}
				disabled={canSexMoveBePlayed(id) ? '' : 'disabled'}
			>
				<h2 className="m-sexMove__title">{title}</h2>
				<div className="m-sexMove__type">{type}</div>
				<h3 className="m-sexMove__requirements">{`Lust >= ${lustMinimum}`}</h3>
				<ul className="m-sexMove__effects">
					{effects.map((effect, index) => {
						return (
							<li
								key={`sex-move-effect-${index}`}
								className="m-sexMove__effects__item"
								data-type={effect.type}
							>
								<p className="m-sexMove__effects__item__title">
									{effect.type}
								</p>
								<p className="m-sexMove__effects__item__value">
									{this.effectText(effect, mood === type)}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}