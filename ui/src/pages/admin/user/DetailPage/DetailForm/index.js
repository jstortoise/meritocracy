import React from 'react';
import { Card } from 'antd';
import { getUserDetail } from 'ducks/user';

class DetailForm extends React.Component {
	state = {
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		role: '',
		mid: '',
		publickey: '',
	};

	getDetail = () => {
		const _id = this.props.params._id;
		var self = this;
		getUserDetail(_id, res => {
			if (res.success) {
				var state = self.state;
				state.username = res.data.username;
				state.firstname = res.data.firstname;
				state.lastname = res.data.lastname;
				state.email = res.data.email;
				if (res.data.role === 0) {
					state.role = 'Root Admin';
				} else if (res.data.role === 1) {
					state.role = 'Administrator';
				} else if (res.data.role === 2) {
					state.role = 'Member';
				} else {
					state.role = 'User';
				}
				state.mid = res.data.mid;
				state.publickey = res.data.publickey;
				self.setState(state);
			}
		});
	};

	componentDidMount() {
		this.getDetail();
	}

	render() {
		return (
			<Card title="User details">
				<p>
					User name: <strong>{this.state.username}</strong>
				</p>
				<p>
					First name: <strong>{this.state.firstname}</strong>
				</p>
				<p>
					Last name: <strong>{this.state.lastname}</strong>
				</p>
				<p>
					Email: <strong>{this.state.email}</strong>
				</p>
				<p>
					Role: <strong>{this.state.role}</strong>
				</p>
				<p>
					MID: <strong>{this.state.mid}</strong>
				</p>
				<p>
					Public Key: <strong>{this.state.publickey}</strong>
				</p>
			</Card>
		);
	}
}

export default DetailForm;
