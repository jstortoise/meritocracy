import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Input } from 'antd';
import * as openpgp from 'openpgp';

import { REDUCER, getUserDetail, editUser } from 'ducks/user';

const FormItem = Form.Item;
const { TextArea } = Input;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
	user_id: state.app.userState._id,
});

@connect(mapStateToProps)
@Form.create()
class UserProfileForm extends React.Component {
	state = {
		firstname: '',
		lastname: '',
		username: '',
		email: '',
		publickey: '',
		mid: '',
		rating: 0,
	};

	componentDidMount() {
		this.refreshData();
	}

	refreshData = () => {
		var self = this;
		const _id = window.localStorage.getItem('app._id');
		getUserDetail(_id, res => {
			if (res.success) {
				var state = self.state;
				state.firstname = res.data.firstname;
				state.lastname = res.data.lastname;
				state.username = res.data.username;
				state.email = res.data.email;
				state.mid = res.data.mid;
				state.publickey = res.data.publickey;
				let rating = 0;
				res.data.clients.forEach(obj => {
					if (obj.rating > 0) {
						rating += obj.rating;
					}
				});
				state.rating = rating;
				self.setState(state);
			}
		});
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		const _id = window.localStorage.getItem('app._id');
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(editUser(_id, values));
				}
			});
		}
	};

	onPublicKeyChange = event => {
		let publickey = event.target.value;
		openpgp.key.readArmored(publickey).then(res => {
			let mid = '';
			if (res.keys.length > 0) {
				mid = res.keys[0].primaryKey.getKeyId().toHex();
			}
			this.setState(() => ({
				mid: mid,
			}));
		});
	};

	render() {
		const { form, isSubmitForm } = this.props;

		return (
			<div>
				<div className="row">
					<div className="col-lg-12 card">
						<Form
							layout="vertical"
							onSubmit={this.onSubmit(isSubmitForm)}
							style={{ marginTop: 20, padding: 5 }}
						>
							<FormItem label="Username">
								{form.getFieldDecorator('username', {
									initialValue: `${this.state.username}`,
									rules: [
										{ required: true, message: 'Please input your username' },
									],
								})(<Input size="default" placeholder="User name" disabled />)}
							</FormItem>
							<FormItem label="First Name">
								{form.getFieldDecorator('firstname', {
									initialValue: `${this.state.firstname}`,
									rules: [
										{ required: true, message: 'Please input your firstname' },
									],
								})(<Input size="default" placeholder="First name" />)}
							</FormItem>
							<FormItem label="Last Name">
								{form.getFieldDecorator('lastname', {
									initialValue: `${this.state.lastname}`,
									rules: [
										{ required: true, message: 'Please input your lastname' },
									],
								})(<Input size="default" placeholder="Last name" />)}
							</FormItem>
							<FormItem label="Email">
								{form.getFieldDecorator('email', {
									initialValue: `${this.state.email}`,
									rules: [{ required: true, message: 'Please input your email' }],
								})(<Input size="default" type="email" placeholder="User email" />)}
							</FormItem>
							<FormItem label={'Merit Points: ' + this.state.rating} />
							<FormItem label="Mid">
								{form.getFieldDecorator('mid', {
									initialValue: `${this.state.mid}`,
								})(<Input size="default" disabled />)}
							</FormItem>
							<FormItem label="Public Key">
								{form.getFieldDecorator('publickey', {
									initialValue: `${this.state.publickey}`,
								})(
									<TextArea
										rows={4}
										placeholder="Please input your GnuPGP public key"
										onChange={this.onPublicKeyChange}
									/>,
								)}
							</FormItem>
							<FormItem>
								<Button
									type="primary"
									htmlType="submit"
									loading={isSubmitForm}
									icon="save"
								>
									Save
								</Button>
							</FormItem>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

export default UserProfileForm;
