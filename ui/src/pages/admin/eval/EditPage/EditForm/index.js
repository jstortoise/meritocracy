import React from 'react';
import { connect } from 'react-redux';

import { Form, Row, Col, InputNumber, Button } from 'antd';

import { REDUCER, getEvalDetail, addEval, editEval } from 'ducks/evaluation';
import { getRangeDetail } from 'ducks/range';

import '../../style.scss';

const FormItem = Form.Item;
const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class EditForm extends React.Component {
	state = {
		fields: [],
		data: {},
		isAdd: false,
	};

	componentDidMount() {
		this.getDetail();
	}

	getDetail = () => {
		var self = this;
		var state = self.state;
		const type = this.props.params.type;

		getRangeDetail(type * 2 + 1, result => {
			if (result.success) {
				if (result.data.fields.length > 0) {
					state.fields = result.data.fields;
					getEvalDetail(type, result => {
						var state = self.state;
						state.isAdd = true;
						if (result.success) {
							state.data = result.data;
							state.isAdd = false;
						}
						self.setState(state);
					});
				}
			}
		});
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		const type = this.props.params.type;
		const isAdd = this.state.isAdd;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					if (isAdd) {
						values['type'] = type;
						dispatch(addEval(values));
					} else {
						dispatch(editEval(type, values));
					}
				}
			});
		}
	};

	render() {
		const { form, isSubmitForm } = this.props;

		var state = this.state;

		const formFields = () => {
			let list = [];
			for (let i = 0; i < state.fields.length; i += 2) {
				let obj = state.fields[i];
				let item = '';
				if (i + 1 < state.fields.length) {
					let obj1 = state.fields[i + 1];
					item = (
						<Col span={12} style={{ display: 'block' }}>
							<FormItem label={obj1.displayname}>
								{form.getFieldDecorator(`fields.${obj1.name}`, {
									initialValue: `${
										this.state.isAdd ? '' : this.state.data[obj1.name]
									}`,
									rules: [{ required: true, message: 'Required' }],
								})(<InputNumber size="default" />)}
							</FormItem>
						</Col>
					);
				}
				list.push(
					<Row gutter={24} key={i}>
						<Col span={12} style={{ display: 'block' }}>
							<FormItem label={obj.displayname}>
								{form.getFieldDecorator(`fields.${obj.name}`, {
									initialValue: `${
										this.state.isAdd ? '' : this.state.data[obj.name]
									}`,
									rules: [{ required: true, message: 'Required' }],
								})(<InputNumber size="default" />)}
							</FormItem>
						</Col>
						{item}
					</Row>,
				);
			}
			return list;
		};

		return (
			<div>
				<div className="utils__title utils__title--flat mb-3">
					<span className="text-uppercase font-size-16">
						Add Organization Merit Points Range
					</span>
				</div>
				<div className="row">
					<div className="col-lg-12 card">
						<Form
							className="mprange-add-form"
							onSubmit={this.onSubmit(isSubmitForm)}
							style={{ marginTop: 20, padding: 5 }}
						>
							{formFields()}
							<Row>
								<Col span={24} style={{ textAlign: 'right' }}>
									<Button type="primary" icon="save" htmlType="submit">
										Save
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
				</div>
			</div>
		);
	}
}

export default EditForm;
