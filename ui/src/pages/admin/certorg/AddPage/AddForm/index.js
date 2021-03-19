import React from 'react';
import { connect } from 'react-redux';

import { Card, Form, Button, Input, Select } from 'antd';

import { REDUCER, addClient } from 'ducks/client';

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
					values['type'] = 1;
					dispatch(addClient(values));
				}
			});
		}
	};

	render() {
		const { form, isSubmitForm } = this.props;

		return (
			<Card>
				<Form onSubmit={this.onSubmit(isSubmitForm)}>
					<FormItem label="Client ID">
						{form.getFieldDecorator('clientId', {
							initialValue: '',
							rules: [{ required: true, message: 'Please input your clientid' }],
						})(<Input size="default" />)}
					</FormItem>
					<FormItem label="Protocol">
						{form.getFieldDecorator('protocol', {
							initialValue: 'openid-connect',
						})(
							<Select size="default" style={{ width: '100%' }}>
								<option value="openid-connect">openid-connect</option>
								<option value="saml">saml</option>
							</Select>,
						)}
					</FormItem>
					<FormItem label="Root URL (Domain name)">
						{form.getFieldDecorator('rootUrl', {
							initialValue: '',
							rules: [{ required: true, message: 'Please input root url' }],
						})(<Input size="default" />)}
					</FormItem>

					<FormItem>
						<Button type="primary" icon="save" htmlType="submit" loading={isSubmitForm}>
							Save
						</Button>
					</FormItem>
				</Form>
			</Card>
		);
	}
}

export default AddForm;
