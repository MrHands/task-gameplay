import React from 'react';
import CountUp from 'react-countup';

import './LustBar.scss';

export default class LustBar extends React.Component {
	render() {
		const {
			lust,
			max,
		} = this.props;

		const style = {
			width: `${(lust / max) * 100}%`
		}

		return (
			<div className={['o-lustBar', this.props.className].join(' ')}>
				<h2 className="o-lustBar__title">Lust</h2>
				<div className="o-lustBar__bar">
					<div className="o-lustBar__bar__foreground" style={style}></div>
				</div>
				<h2 className="o-nightShift__lust__amount">
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