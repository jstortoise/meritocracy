import React from 'react';
import { connect } from 'react-redux';

import { Form, Button, Input, Select } from 'antd';

import { REDUCER, addUser } from 'ducks/user';

const FormItem = Form.Item;
const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class AddForm extends React.Component {
	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(addUser(values));
				}
			});
		}
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
							<FormItem label="First Name">
								{form.getFieldDecorator('firstname', {
									initialValue: '',
									rules: [
										{ required: true, message: 'Please input your firstname' },
									],
								})(<Input size="default" />)}
							</FormItem>

							<FormItem label="Last Name">
								{form.getFieldDecorator('lastname', {
									initialValue: '',
									rules: [
										{ required: true, message: 'Please input your lastname' },
									],
								})(<Input size="default" />)}
							</FormItem>

							<FormItem label="Username">
								{form.getFieldDecorator('username', {
									initialValue: '',
									rules: [
										{ required: true, message: 'Please input your username' },
									],
								})(<Input size="default" />)}
							</FormItem>
							<FormItem label="Password">
								{form.getFieldDecorator('password', {
									initialValue: '',
									rules: [
										{ required: true, message: 'Please input your password' },
									],
								})(<Input size="default" type="password" />)}
							</FormItem>
							<FormItem label="Email">
								{form.getFieldDecorator('email', {
									initialValue: '',
									rules: [
										{ required: true, message: 'Please input your password' },
									],
								})(<Input size="default" type="email" />)}
							</FormItem>
							<FormItem label="Role">
								{form.getFieldDecorator('role', {
									initialValue: '2',
								})(
									<Select size="default" style={{ width: '100%' }}>
										<option value="1">Administrator</option>
										<option value="2">Member</option>
									</Select>,
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

export default AddForm;
