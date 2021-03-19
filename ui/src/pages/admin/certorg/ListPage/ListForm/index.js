import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button, Input, Modal, notification } from 'antd';

import { REDUCER, getClientList, deleteClient } from 'ducks/client';

const ButtonGroup = Button.Group;
const Search = Input.Search;
const confirm = Modal.confirm;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class ListForm extends React.Component {
	state = {
		clients: [],
	};

	componentDidMount() {
		this.refreshList();
	}

	refreshList = () => {
		var self = this;
		// get cert organization list
		getClientList(1, result => {
			if (result.success) {
				var state = self.state;
				state.clients = result.data;
				self.setState(state);
			}
		});
	};

	goToAddPage = () => {
		const { dispatch } = this.props;
		dispatch(push('/certorg/add'));
	};

	goToEditPage = clientId => {
		const { dispatch } = this.props;
		dispatch(push(`/certorg/edit/${clientId}`));
	};

	goToDetailPage = clientId => {
		const { dispatch } = this.props;
		dispatch(push(`/certorg/detail/${clientId}`));
	};

	onDelete = appkey => {
		var self = this;
		confirm({
			title: 'Do you want to delete this organization?',
			content: '',
			centered: true,
			onOk() {
				deleteClient(appkey, result => {
					if (result.success) {
						notification.open({
							type: 'success',
							message: 'Organization removed successfully',
						});
						self.refreshList();
					} else {
						notification.open({
							type: 'error',
							message: result.message,
						});
					}
				});
			},
			onCancel() {},
		});
	};

	render() {
		const tableColumns = [
			{
				title: 'ClientId',
				dataIndex: 'clientId',
				key: 'clientId',
			},
			{
				title: 'Protocol',
				dataIndex: 'protocol',
				key: 'protocol',
			},
			{
				title: 'Root Url',
				dataIndex: 'rootUrl',
				key: 'rootUrl',
			},
			{
				title: 'Created',
				dataIndex: 'created',
				key: 'created',
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => (
					<ButtonGroup>
						<Button icon="search" onClick={() => this.goToDetailPage(record.clientId)}>
							View
						</Button>
						<Button icon="edit" onClick={() => this.goToEditPage(record.clientId)}>
							Edit
						</Button>
						<Button icon="delete" onClick={() => this.onDelete(record.appkey)}>
							Delete
						</Button>
					</ButtonGroup>
				),
			},
		];

		return (
			<Card title="Certified Organization List">
				<div>
					<Search
						placeholder="Search..."
						style={{ width: 200, float: 'left' }}
						onSearch={value => console.log(value)}
					/>
					<Button
						type="primary"
						icon="plus"
						style={{ float: 'right' }}
						onClick={this.goToAddPage}
					>
						Add Client
					</Button>
					<br />
				</div>
				<Table
					columns={tableColumns}
					dataSource={this.state.clients}
					pagination={true}
					rowKey="clientId"
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default ListForm;
