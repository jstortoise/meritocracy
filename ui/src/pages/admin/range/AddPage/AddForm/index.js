import React from 'react';
import { connect } from 'react-redux';

import { Form, Icon, Row, Col, InputNumber, Input, Button, Select } from 'antd';

import { REDUCER, addRange } from 'ducks/range';

import '../../style.scss';

const FormItem = Form.Item;
const { TextArea } = Input;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class AddForm extends React.Component {
	state = {
		count: 0,
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					dispatch(addRange(values));
				}
			});
		}
	};

	onAdd = () => {
		let count = this.state.count + 1;
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
									initialValue: '',
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
									initialValue: '',
								})(<Input />)}
							</FormItem>
							<FormItem label="Description">
								{form.getFieldDecorator('description', {
									initialValue: '',
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
											rules: [
												{
													required: false,
												},
											],
										})(<InputNumber placeholder="Please input value 'from'" />)}
									</FormItem>
								</Col>
								<Col span={10}>
									<FormItem label="Range0(To)" key="to0">
										{form.getFieldDecorator('range[1]', {
											validateTrigger: ['onChange'],
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

export default AddForm;
