import React from 'react';

import SexMove from './SexMove';

import './SexMoveCategory.scss';

export default class SexMoveCategory extends React.Component {
	constructor() {
		super();

		this.state = {
			expanded: false
		};
	}

	toggleExpand() {
		this.setState(state => {
			return {
				expanded: !state.expanded
			};
		})
	}
	
	render() {
		const {
			category,
			sexMoves,
			canSexMoveBePlayed,
			playSexMove,
		} = this.props;

		const classes = ['m-sexMoveCategory'];
		if (this.state.expanded) {
			classes.push('-expanded');
		}

		return (
			<div
				className={classes.join(' ')}
				onClick={() => this.toggleExpand()}
			>
				<h3 className="m-sexMoveCategory__title">{category}</h3>
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