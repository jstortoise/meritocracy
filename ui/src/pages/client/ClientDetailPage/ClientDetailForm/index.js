import React from 'react';
import { Card } from 'antd';

import { getClientDetail } from 'ducks/client';

class ClientDetailForm extends React.Component {
	state = {
		client: {
			clientId: '',
			protocol: '',
			rootUrl: '',
			appkey: '',
			users: [],
		},
		users: '',
	};

	constructor(props) {
		super(props);

		var self = this;
		const clientId = props.params.clientId;
		getClientDetail(clientId, function(result) {
			var state = self.state;
			if (result.success) {
				if (result.data) {
					state.client = result.data;
					let users: string = result.data.users.length;
					if (result.data.users.length > 0) {
						users += ' (';
						for (let i = 0; i < result.data.users.length; i++) {
							if (i > 0) {
								users += ', ';
							}
							users += result.data.users[i];
						}
						users += ')';
					}
					state.users = users;
					self.setState(state);
				}
			}
		});
	}

	render() {
		return (
			<Card title="Organization Stats">
				<p>
					Client ID: <strong>{this.state.client.clientId}</strong>
				</p>
				<p>
					Protocol: <strong>{this.state.client.protocol}</strong>
				</p>
				<p>
					Root URL: <strong>{this.state.client.rootUrl}</strong>
				</p>
				<p>
					App Key: <strong>{this.state.client.appkey}</strong>
				</p>
				<p>
					Active Users: <strong>{this.state.users}</strong>
				</p>
			</Card>
		);
	}
}

export default ClientDetailForm;
