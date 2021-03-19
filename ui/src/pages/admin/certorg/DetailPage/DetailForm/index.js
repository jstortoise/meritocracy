import React from 'react';
import { Card } from 'antd';
import { getClientDetail } from 'ducks/client';

class DetailForm extends React.Component {
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

	getDetail() {
		const clientId = this.props.params.clientId;
		var self = this;
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

	componentDidMount() {
		this.getDetail();
	}

	render() {
		return (
			<Card title="Certified Organization Stats">
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

export default DetailForm;
