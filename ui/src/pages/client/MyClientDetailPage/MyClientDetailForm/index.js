import React from 'react';

import { getOrgDetail } from 'ducks/comment';

class MyClientDetailForm extends React.Component {
	state = {
		one: 0,
		two: 0,
		three: 0,
		four: 0,
		five: 0,
		total: 0,
		users: [],
	};

	constructor(props) {
		super(props);

		var self = this;
		const clientId = props.params.clientId;
		getOrgDetail(clientId, result => {
			if (result.success) {
				var state = self.state;
				state.one = result.data.one;
				state.two = result.data.two;
				state.three = result.data.three;
				state.four = result.data.four;
				state.five = result.data.five;
				state.total = result.data.total;
				state.users = result.data.users;
				self.setState(state);
			}
		});
	}

	render() {
		return (
			<section className="card">
				<div className="card-header">
					<div className="utils__title">
						<strong>Organization Detail Page</strong>
					</div>
				</div>
				<div className="card-body">
					<p>
						Active members: <strong>{this.state.users.length}</strong>
					</p>
					<p>
						Total rating: <strong>{this.state.total}</strong>
					</p>
					<p>
						Number of 1 stars: <strong>{this.state.one}</strong>
					</p>
					<p>
						Number of 2 stars: <strong>{this.state.two}</strong>
					</p>
					<p>
						Number of 3 stars: <strong>{this.state.three}</strong>
					</p>
					<p>
						Number of 4 stars: <strong>{this.state.four}</strong>
					</p>
					<p>
						Number of 5 stars: <strong>{this.state.five}</strong>
					</p>
				</div>
			</section>
		);
	}
}

export default MyClientDetailForm;
