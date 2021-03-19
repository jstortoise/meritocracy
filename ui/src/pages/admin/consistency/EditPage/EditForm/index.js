import React from 'react';
import { connect } from 'react-redux';
import { Form, InputNumber, Button, notification } from 'antd';

import { REDUCER, setValue, getValueList } from 'ducks/base';
import '../../style.scss';

const FormItem = Form.Item;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class EditForm extends React.Component {
	state = {
		increase: '',
		decrease: '',
	};

	constructor(props) {
		super(props);

		this.getDetail();
	}

	getDetail = () => {
		var self = this;
		getValueList(result => {
			if (result.success) {
				var state = self.state;
				result.data.forEach(obj => {
					if (obj.type === 1) {
						state.increase = obj.value;
					} else if (obj.type === 2) {
						state.decrease = obj.value;
					}
				});
				self.setState(state);
			}
		});
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					values['value'] = values['increase'];
					setValue(1, values, result => {
						if (result.success) {
							values['value'] = values['decrease'];
							setValue(2, values, result => {
								if (result.success) {
									notification.open({
										type: 'success',
										message: 'Values updated successfully',
									});
								} else {
									notification.open({
										type: 'error',
										message: 'Failed to updated values',
									});
								}
							});
						} else {
							notification.open({
								type: 'error',
								message: 'Failed to updated values',
							});
						}
					});
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
						<Form className="weight-add-form" onSubmit={this.onSubmit(isSubmitForm)}>
							<FormItem label="Increase">
								{form.getFieldDecorator('increase', {
									initialValue: `${this.state.increase}`,
									rules: [{ required: true, message: 'Increase point required' }],
								})(<InputNumber size="default" />)}
							</FormItem>
							<FormItem label="Decrease">
								{form.getFieldDecorator('decrease', {
									initialValue: `${this.state.decrease}`,
									rules: [{ required: true, message: 'Decrease point required' }],
								})(<InputNumber size="default" />)}
							</FormItem>
							<FormItem className="no-label">
								<Button type="primary" htmlType="submit">
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

export default EditForm;
