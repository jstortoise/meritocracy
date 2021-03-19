import React from 'react';
import { connect } from 'react-redux';

import { Card, Form, Button, Input, Select } from 'antd';

import { REDUCER, getUserDetail, editUser } from 'ducks/user';

const FormItem = Form.Item;
const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class EditForm extends React.Component {
	state = {
		firstname: '',
		lastname: '',
		username: '',
		password: '',
		email: '',
		role: 3,
	};

	getDetail = () => {
		const _id = this.props.params._id;
		var self = this;
		getUserDetail(_id, res => {
			if (res.success) {
				var state = self.state;
				state.username = res.data.username;
				state.password = res.data.password;
				state.firstname = res.data.firstname;
				state.lastname = res.data.lastname;
				state.email = res.data.email;
				state.role = res.data.role;
				self.setState(state);
			}
		});
	};

	componentDidMount() {
		this.getDetail();
	}

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		const _id = this.props.params._id;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(editUser(_id, values));
				}
			});
		}
	};

	render() {
		const { form, isSubmitForm } = this.props;

		return (
			<Card title="Edit User">
				<Form onSubmit={this.onSubmit(isSubmitForm)}>
					<FormItem label="First name">
						{form.getFieldDecorator('firstname', {
							initialValue: `${this.state.firstname}`,
							rules: [{ required: true, message: 'Please input your firstname' }],
						})(<Input size="default" />)}
					</FormItem>

					<FormItem label="Last name">
						{form.getFieldDecorator('lastname', {
							initialValue: `${this.state.lastname}`,
							rules: [{ required: true, message: 'Please input your lastname' }],
						})(<Input size="default" />)}
					</FormItem>

					<FormItem label="Username">
						{form.getFieldDecorator('username', {
							initialValue: `${this.state.username}`,
							rules: [{ required: true, message: 'Please input your username' }],
						})(<Input size="default" />)}
					</FormItem>
					<FormItem label="Password">
						{form.getFieldDecorator('password', {
							initialValue: `${this.state.password}`,
							rules: [{ required: true, message: 'Please input your password' }],
						})(<Input size="default" type="password" autoComplete="new-password" />)}
					</FormItem>
					<FormItem label="Email">
						{form.getFieldDecorator('email', {
							initialValue: `${this.state.email}`,
							rules: [{ required: true, message: 'Please input your password' }],
						})(<Input size="default" type="email" />)}
					</FormItem>
					<FormItem label="Role">
						{form.getFieldDecorator('role', {
							initialValue: `${this.state.role}`,
						})(
							<Select size="default" style={{ width: '100%' }}>
								<Select.Option value="1">Administrator</Select.Option>
								<Select.Option value="2">Member</Select.Option>
								<Select.Option value="3">User</Select.Option>
							</Select>,
						)}
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit" loading={isSubmitForm} icon="save">
							Save
						</Button>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default EditForm;
