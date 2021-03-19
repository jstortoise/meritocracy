import React from 'react';
import { connect } from 'react-redux';
import { Form, InputNumber, Button, notification } from 'antd';

import { REDUCER, setValue, getValue } from 'ducks/base';
import '../../style.scss';

const FormItem = Form.Item;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class EditForm extends React.Component {
	state = {
		weight: '',
	};

	constructor(props) {
		super(props);

		this.getDetail();
	}

	getDetail = () => {
		var self = this;
		getValue(0, result => {
			if (result.success) {
				var state = self.state;
				state.weight = result.data.value;
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
					setValue(0, values, result => {
						if (result.success) {
							notification.open({
								type: 'success',
								message: 'Weight updated successfully',
							});
						} else {
							notification.open({
								type: 'error',
								message: 'Failed to updated weight',
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
							<FormItem label="Weight">
								{form.getFieldDecorator('value', {
									initialValue: `${this.state.weight}`,
									rules: [{ required: true, message: 'Weight required' }],
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
