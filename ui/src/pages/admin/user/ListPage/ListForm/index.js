import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button, Input, Modal, notification } from 'antd';

import { REDUCER, getUserList, deleteUser } from 'ducks/user';

const ButtonGroup = Button.Group;
const Search = Input.Search;
const confirm = Modal.confirm;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class ListForm extends React.Component {
	state = {
		users: [],
	};

	componentDidMount() {
		this.refreshList();
	}

	refreshList = () => {
		var self = this;
		getUserList(result => {
			if (result.success) {
				var state = self.state;
				state.users = result.data;
				self.setState(state);
			}
		});
	};

	goToAddPage = () => {
		const { dispatch } = this.props;
		dispatch(push('/user/add'));
	};

	goToEditPage = _id => {
		const { dispatch } = this.props;
		dispatch(push(`/user/edit/${_id}`));
	};

	goToDetailPage = _id => {
		const { dispatch } = this.props;
		dispatch(push(`/user/detail/${_id}`));
	};

	onDelete = _id => {
		var self = this;
		confirm({
			title: 'Do you want to delete this user?',
			content: '',
			centered: true,
			onOk() {
				deleteUser(_id, result => {
					if (result.success) {
						notification.open({
							type: 'success',
							message: 'User removed successfully',
						});
						self.refreshList();
					}
				});
			},
			onCancel() {},
		});
	};

	render() {
		const tableColumns = [
			{
				title: 'Username',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
			},
			{
				title: 'First Name',
				dataIndex: 'firstname',
				key: 'firstname',
			},
			{
				title: 'Last Name',
				dataIndex: 'lastname',
				key: 'lastname',
			},
			{
				title: 'Role',
				dataIndex: 'role',
				key: 'role',
				render: text => {
					let role = '';
					if (text === 0) {
						role = 'Root Admin';
					} else if (text === 1) {
						role = 'Administrator';
					} else if (text === 2) {
						role = 'Member';
					} else if (text === 3) {
						role = 'Org Member';
					}
					return role;
				},
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => (
					<ButtonGroup>
						<Button icon="search" onClick={() => this.goToDetailPage(record._id)}>
							View
						</Button>
						<Button icon="edit" onClick={() => this.goToEditPage(record._id)}>
							Edit
						</Button>
						<Button icon="delete" onClick={() => this.onDelete(record._id)}>
							Delete
						</Button>
					</ButtonGroup>
				),
			},
		];

		return (
			<Card title="User List">
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
						Add User
					</Button>
					<br />
				</div>
				<Table
					columns={tableColumns}
					dataSource={this.state.users}
					pagination={true}
					rowKey="username"
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default ListForm;
