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
class ClientListForm extends React.Component {
	state = {
		clients: [],
		allClients: [],
	};

	componentDidMount() {
		this.refreshList();
	}

	refreshList = () => {
		var self = this;
		getClientList(-1, result => {
			if (result.success) {
				var state = self.state;
				state.allClients = result.data;
				state.clients = result.data;
				self.setState(state);
			}
		});
	};

	goToAddPage = () => {
		const { dispatch } = this.props;
		dispatch(push('/client/add'));
	};

	goToStatsPage = clientId => {
		const { dispatch } = this.props;
		dispatch(push(`/client/detail/${clientId}`));
	};

	goToRatingPage = clientId => {
		const { dispatch } = this.props;
		dispatch(push(`/client/mylist/detail/${clientId}`));
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

	onSearch = val => {
		console.log(val);
	};

	render() {
		let username = window.localStorage.getItem('app.username');

		const tableColumns = [
			{
				title: 'ClientId',
				dataIndex: 'clientId',
				key: 'clientId',
			},
			{
				title: 'Root Url',
				dataIndex: 'rootUrl',
				key: 'rootUrl',
			},
			{
				title: 'Type',
				dataIndex: 'type',
				key: 'type',
				render: val => {
					if (val === 1) {
						return 'Certified';
					}
					return 'Legacy';
				},
			},
			{
				title: 'Merit Points',
				dataIndex: 'meritpoint',
				key: 'meritpoint',
				align: 'center',
			},
			{
				title: 'Created',
				dataIndex: 'created',
				key: 'created',
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => {
					let actions = '';

					if (record.created === username || window.localStorage.getItem('role') <= 1) {
						actions = (
							<ButtonGroup>
								<Button icon="edit">Edit</Button>
								<Button icon="delete" onClick={() => this.onDelete(record.appkey)}>
									Delete
								</Button>
								<Button onClick={() => this.goToStatsPage(record.clientId)}>
									View Stats
								</Button>
								<Button onClick={() => this.goToRatingPage(record.clientId)}>
									View Rating
								</Button>
							</ButtonGroup>
						);
					} else {
						actions = (
							<Button onClick={() => this.goToRatingPage(record.clientId)}>
								View Rating
							</Button>
						);
					}
					return actions;
				},
			},
		];

		return (
			<Card title="Organizations">
				<div>
					<Search
						placeholder="Search..."
						style={{ width: 200, float: 'left' }}
						onSearch={val => this.onSearch(val)}
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

export default ClientListForm;
