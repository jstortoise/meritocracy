import React from 'react';
import { connect } from 'react-redux';

import { Form, Icon, Row, Col, Input, InputNumber, Button, Select } from 'antd';

import { REDUCER, editRange, getRangeDetail } from 'ducks/range';

import '../../style.scss';

const FormItem = Form.Item;
const { TextArea } = Input;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class EditForm extends React.Component {
	state = {
		count: 0,
		description: '',
		unit: '',
		fields: [
			{
				from: '',
				to: '',
			},
		],
	};

	constructor(props) {
		super(props);

		this.getDetail();
	}

	getDetail = () => {
		const type = this.props.params.type;
		var self = this;
		getRangeDetail(type, result => {
			if (result.success) {
				var state = self.state;
				if (result.data) {
					if (result.data.fields.length > 0) {
						state.count = result.data.fields.length - 1;
						state.fields = result.data.fields;
					}
					if (result.data.description) {
						state.description = result.data.description;
					}
					if (result.data.unit) {
						state.unit = result.data.unit;
					}
					self.setState(state);
				}
			}
		});
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		const type = this.props.params.type;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(editRange(type, values));
				}
			});
		}
	};

	onAdd = () => {
		let count = this.state.count + 1;
		var fields = this.state.fields;
		if (fields.length - 1 <= count) {
			fields.push({
				from: '',
				to: '',
			});
		}
		this.setState({
			count: count,
		});
	};

	onRemove = () => {
		let count = this.state.count - 1;
		if (count < 0) {
			count = 0;
		}
		this.setState({
			count: count,
		});
	};

	render() {
		const { form, isSubmitForm } = this.props;
		const type = this.props.params.type;

		const getFormItems = () => {
			let items = [];
			for (let i = 0; i < this.state.count; i++) {
				let id = i + 1;
				items.push(
					<Row span={24} key={'row' + i}>
						<Col span={10}>
							<FormItem key={'from' + id} label={'Range' + id + '(From)'}>
								{form.getFieldDecorator(`range[${id}]`, {
									validateTrigger: ['onChange'],
									initialValue: `${this.state.fields[id].from}`,
									rules: [
										{
											required: true,
											message: "Please input value 'from'",
										},
									],
								})(<InputNumber placeholder="Please input value 'from'" />)}
							</FormItem>
						</Col>
						<Col span={10}>
							<FormItem key={'to' + id} label={'Range' + id + '(To)'}>
								{form.getFieldDecorator(`range[${id + 1}]`, {
									validateTrigger: ['onChange'],
									initialValue: `${this.state.fields[id].to}`,
									rules: [
										{
											required: id === this.state.count ? false : true,
											message: "Please input value 'to'",
										},
									],
								})(<InputNumber placeholder="Please input value 'to'" />)}
							</FormItem>
						</Col>
						{id < this.state.count ? (
							''
						) : (
							<Col span={4}>
								<FormItem key={'minus' + id}>
									<Icon
										className="dynamic-delete-button"
										type="minus-circle-o"
										onClick={this.onRemove}
									/>
								</FormItem>
							</Col>
						)}
					</Row>,
				);
			}
			return items;
		};

		return (
			<div>
				<div className="row">
					<div className="col-lg-12 card">
						<Form className="range-add-form" onSubmit={this.onSubmit(isSubmitForm)}>
							<FormItem label="Type">
								{form.getFieldDecorator('type', {
									initialValue: `${type}`,
									rules: [{ required: true, message: 'Type required' }],
								})(
									<Select size="default" onChange={this.onTypeChange}>
										<Select.Option value="0">
											Organization Merit Points Range
										</Select.Option>
										<Select.Option value="1">
											Member Total Score Range
										</Select.Option>
										<Select.Option value="2">
											Member Merit Points Range
										</Select.Option>
										<Select.Option value="3">
											Organization Total Score Range
										</Select.Option>
										<Select.Option value="4">
											M2M Member Merit Points Range
										</Select.Option>
										<Select.Option value="5">M2M Rating Range</Select.Option>
									</Select>,
								)}
							</FormItem>
							<FormItem label="Unit">
								{form.getFieldDecorator('unit', {
									initialValue: `${this.state.unit}`,
								})(<Input />)}
							</FormItem>
							<FormItem label="Description">
								{form.getFieldDecorator('description', {
									initialValue: `${this.state.description}`,
								})(
									<TextArea
										rows={2}
										placeholder="Please describe for this type"
									/>,
								)}
							</FormItem>
							<Row span={24}>
								<Col span={10}>
									<FormItem label="Range0(From)" key="from0">
										{form.getFieldDecorator('range[0]', {
											validateTrigger: ['onChange'],
											initialValue: `${this.state.fields[0].from}`,
											rules: [{ required: false }],
										})(<InputNumber placeholder="Please input value 'from'" />)}
									</FormItem>
								</Col>
								<Col span={10}>
									<FormItem label="Range0(To)" key="to0">
										{form.getFieldDecorator('range[1]', {
											validateTrigger: ['onChange'],
											initialValue: `${this.state.fields[0].to}`,
											rules: [
												{
													required: true,
													message: "Please input value 'to'",
												},
											],
										})(<InputNumber placeholder="Please input value 'to'" />)}
									</FormItem>
								</Col>
							</Row>
							{getFormItems()}
							<FormItem className="no-label">
								<Button
									type="dashed"
									onClick={this.onAdd}
									style={{ width: '200px' }}
								>
									<Icon type="plus" /> Add field
								</Button>
							</FormItem>
							<FormItem className="no-label">
								<Button type="primary" icon="save" htmlType="submit">
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
