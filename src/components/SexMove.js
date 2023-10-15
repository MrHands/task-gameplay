import React from 'react';

import DroppableCard from './DroppableCard';

import './SexMove.scss';

export default class SexMove extends React.Component {
	get classes() {
		const {
			className,
			id,
			canSexMoveBePlayed,
			shiftHeld,
		} = this.props;

		const classes = ['m-sexMove'];

		if (id === -1) {
			classes.push('m-sexMove--empty');
		} else {
			if (this.isMatch) {
				classes.push('m-sexMove--match');
			}

			if (shiftHeld) {
				classes.push('m-sexMove--redraw');
			} else if (!canSexMoveBePlayed(id)) {
				classes.push('m-sexMove--disabled');
			}
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

	get isMatch() {
		const {
			mood,
			type,
		} = this.props;

		return mood === type;
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
			type: effectType,
			value,
		} = effect;

		if (effectType === 'mood') {
			return value.toUpperCase();
		}

		let valueBonus = this.isMatch && effectType === 'crew'
			? (value * 2)
			: value;

		if (effectType === 'crew') {
			valueBonus /= 10;
		}

		const valueText = (valueBonus > 0) ? `+${valueBonus}` : valueBonus;

		switch (effectType) {
			case 'crew':
				return `${valueText}`;

			case 'captain':
			case 'pleasure': {
				return `${valueText}%`;
			}
			default: {
				return `${valueText}`;
			}
		}
	}

	getRequirementsText(lustMinimum) {
		return lustMinimum >= 4 ? 'Hardcore': 'Foreplay';
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
				<h3 className="m-sexMove__requirements">{this.getRequirementsText(lustMinimum)}</h3>
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
				<div className="m-sexMove__overlay">Redraw?</div>
			</div>
		);
	}
}