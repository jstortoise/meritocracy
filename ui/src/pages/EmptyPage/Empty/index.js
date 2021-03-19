import React from 'react';
import { Collapse } from 'antd';
import './style.scss';

const Panel = Collapse.Panel;

class Empty extends React.Component {
	render() {
		return (
			<section className="card">
				<div className="card-header">
					<div className="utils__title">
						<strong>Empty Page</strong>
					</div>
				</div>
				<div className="card-body">
					<p>Access denied!</p>
				</div>
			</section>
		);
	}
}

export default Empty;
