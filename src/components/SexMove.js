import React from 'react';
import ReactMarkdown from 'react-markdown';

import DroppableCard from './DroppableCard';

import './SexMove.scss';

export default class SexMove extends React.Component {
	get classes() {
		const {
			className,
			mood,
			id,
			type,
			canSexMoveBePlayed,
		} = this.props;

		const classes = ['m-sexMove'];

		if (id === -1) {
			classes.push('-empty');
		}

		if (mood === type) {
			classes.push('-match');
		}

		if (!canSexMoveBePlayed(id)) {
			classes.push('m-sexMove--disabled');
		}

		classes.push(className);

		return classes;
	}

	get descriptionText() {
		const {
			description,
		} = this.props;

		/** @type {string} */
		let modified = description;
		modified = modified.replace(/\$captain/g, `**${this.getEffectText('captain')}**`);
		modified = modified.replace(/\$crew/g, `**${this.getEffectText('crew')}**`);
		modified = modified.replace(/\$sexergy/g, `**${this.getEffectText('sexergy')}**`);
		modified = modified.replace(/\$mood/g, `**${this.getEffectText('mood')}**`);

		return modified;
	}

	getEffect(type) {
		const {
			effects
		} = this.props;

		return effects.find((effect) => effect.type === type) ?? null;
	}

	getEffectText(effect) {
		if (typeof effect === 'string') {
			return this.getEffectText(this.getEffect(effect));
		} else if (!effect) {
			return '';
		}

		const {
			mood,
		} = this.props;

		const {
			type,
			value,
		} = effect;

		if (type === 'mood') {
			return value.toUpperCase();
		}

		const valueBonus = (mood === type && type === 'crew') ? (value * 2) : value;
		const valueText = (valueBonus > 0) ? `+${valueBonus}` : valueBonus;

		switch (type) {
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
				disabled={canSexMoveBePlayed(id)}
			>
				<h2 className="m-sexMove__title">{title}</h2>
				<div className="m-sexMove__type">{type}</div>
				<h3 className="m-sexMove__requirements">{`Lust >= ${lustMinimum}`}</h3>
				<div className="m-sexMove__description">
					<ReactMarkdown>
						{this.descriptionText}
					</ReactMarkdown>
				</div>
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
									{this.getEffectText(effect)}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}