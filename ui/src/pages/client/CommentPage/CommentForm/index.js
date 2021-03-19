import React from 'react';
import { connect } from 'react-redux';
import { Form, Button, Input, Rate, Modal, notification } from 'antd';

import { REDUCER, addComment, deleteComment, getComments } from 'ducks/comment';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
@Form.create()
class CommentForm extends React.Component {
	state = {
		comments: [],
	};

	componentDidMount() {
		this.refreshAll();
	}

	refreshAll = () => {
		const clientId = this.props.params.clientId;
		var self = this;
		var state = self.state;
		getComments(clientId, result => {
			if (result.success) {
				state.comments = result.data;
				self.setState(state);
			}
		});
	};

	deleteComment = _id => {
		var self = this;
		confirm({
			title: 'Do you want to delete this comment?',
			content: '',
			centered: true,
			onOk() {
				deleteComment(_id, result => {
					if (result.success) {
						notification.open({
							type: 'success',
							message: 'Comment removed successfully',
						});
						self.refreshAll();
					}
				});
			},
			onCancel() {},
		});
	};

	onSubmit = (isSubmitForm: ?boolean) => event => {
		event.preventDefault();
		const { form, dispatch } = this.props;
		const clientId = this.props.params.clientId;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
					values['clientId'] = clientId;
					addComment(values, result => {
						if (result.success) {
							notification.open({
								type: 'success',
								message: result.message,
							});
							this.refreshAll();
						} else {
							let msg = 'Failed to add comment and rating.';
							if (result.message) {
								msg = result.message;
							}
							notification.open({
								type: 'error',
								message: msg,
							});
						}
					});
				}
			});
		}
	};

	getFormList = () => {
		const { role } = this.props;
		var forms = [];
		const list = this.state.comments;

		for (let i = 0; i < list.length; i++) {
			var showButtons = () => {
				if (window.localStorage.getItem('app.role') <= 1) {
					return (
						<Button
							style={{ float: 'right' }}
							onClick={() => this.deleteComment(list[i]._id)}
						>
							Delete
						</Button>
					);
				}
			};

			forms.push(
				<Form key={i}>
					<span>
						<strong>{list[i].createdBy}</strong>({list[i].ago})
					</span>
					<span>
						<Rate disabled value={list[i].rating} />
					</span>
					{showButtons()}
					<p>{list[i].comment}</p>
				</Form>,
			);
		}
		return forms;
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
							style={{ marginTop: 20 }}
						>
							<FormItem label="Comment">
								{form.getFieldDecorator('comment', {
									initialValue: '',
								})(<TextArea rows={1} placeholder="Commenting publicly as ..." />)}
							</FormItem>
							<FormItem label="Rate">
								{form.getFieldDecorator('rating', {})(<Rate />)}
							</FormItem>
							<Button
								type="primary"
								htmlType="submit"
								loading={isSubmitForm}
								icon="save"
							>
								Save
							</Button>
						</Form>
						<div style={{ marginTop: 20 }}>{this.getFormList()}</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CommentForm;
