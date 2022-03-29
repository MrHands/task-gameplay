import React from 'react';
import CountUp from 'react-countup';

import './LustBar.scss';

export default class LustBar extends React.Component {
	get classes() {
		const {
			className,
			lust
		} = this.props;

		const classes = ['o-lustBar'];

		if (lust > 100) {
			classes.push('-overload');
		}

		classes.push(className);

		return classes;
	}

	render() {
		const {
			name,
			lust,
		} = this.props;

		const style = {
			'--lust-width': `${Math.min(lust, 100)}%`,
			'--overload-width': `${Math.clamp(lust - 100, 0, 100)}%`,
		};

		return (
			<div
				className={this.classes.join(' ')}
				style={style}
			>
				<h2 className="o-lustBar__title">{name}</h2>
				<div className="o-lustBar__bar">
					<div className="o-lustBar__bar__foreground"></div>
					<div className="o-lustBar__bar__foreground -overload"></div>
				</div>
				<h2 className="o-lustBar__amount">
					<CountUp
						end={lust}
						duration={1}
						suffix="%"
					/>
				</h2>
			</div>
		);
	}
}