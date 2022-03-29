import React from 'react';

import SexMove from './SexMove';

import './SexMoveCategory.scss';

export default class SexMoveCategory extends React.Component {
	get sexMovesAvailable() {
		const {
			sexMoves,
			canSexMoveBePlayed,
		} = this.props;

		return sexMoves.filter(sexMove => canSexMoveBePlayed(sexMove));
	}

	get classes() {
		const {
			className,
			expanded,
		} = this.props;

		const classes = ['m-sexMoveCategory'];
		if (expanded) {
			classes.push('-expanded');
		}

		if (this.sexMovesAvailable.length > 0) {
			classes.push('-available');
		}

		classes.push(className);

		return classes;
	}

	render() {
		const {
			category,
			sexMoves,
			canSexMoveBePlayed,
			playSexMove,
			toggleExpand,
		} = this.props;

		sexMoves.sort((left, right) => {
			const leftPlayable = canSexMoveBePlayed(left);
			const rightPlayable = canSexMoveBePlayed(right);

			if (leftPlayable === rightPlayable) {
				return left.id < right.id ? -1 : 1;
			} else {
				return leftPlayable ? -1 : 1;
			}
		});

		return (
			<div
				className={this.classes.join(' ')}
				onClick={() => toggleExpand(category)}
			>
				<h3 className="m-sexMoveCategory__title">{`${category} (${this.sexMovesAvailable.length} / ${sexMoves.length})`}</h3>
				<div className="m-sexMoveCategory__moves">
					{sexMoves.map((sexMove, index) => {
						return (
							<SexMove
								key={`sex-move-${index}`}
								canSexMoveBePlayed={canSexMoveBePlayed}
								playSexMove={playSexMove}
								{...sexMove}
							/>
						);
					})}
				</div>
			</div>
		)
	}
}