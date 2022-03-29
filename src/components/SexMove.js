import React from 'react';

import DroppableCard from './DroppableCard';

import './SexMove.scss';

export default class SexMove extends React.Component {
	get classes() {
		const {
			className,
			id,
		} = this.props;

		const classes = ['m-sexMove'];
		if (id === -1) {
			classes.push('-empty');
		}
		classes.push(className);

		return classes;
	}

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
							<li key={`sex-move-effect-${index}`}>
								<p>{effect.type}</p>
								<p>{this.effectText(effect)}</p>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}