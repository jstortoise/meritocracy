import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button, Input, Modal, notification } from 'antd';

import { REDUCER, getRangeList, deleteRange } from 'ducks/range';

const ButtonGroup = Button.Group;
const Search = Input.Search;
const confirm = Modal.confirm;

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class ListForm extends React.Component {
	state = {
		data: [],
	};

	constructor(props) {
		super(props);

		this.refreshList();
	}

	refreshList = () => {
		var self = this;
		getRangeList(result => {
			if (result.success) {
				var state = self.state;
				state.data = result.data;
				self.setState(state);
			}
		});
	};

	onAdd = () => {
		const { dispatch } = this.props;
		dispatch(push('/range/add'));
	};

	onView = type => {
		const { dispatch } = this.props;
		dispatch(push(`/range/detail/${type}`));
	};

	onEdit = type => {
		const { dispatch } = this.props;
		dispatch(push(`/range/edit/${type}`));
	};

	onDelete = clientId => {
		var self = this;
		confirm({
			title: 'Do you want to delete this record?',
			content: '',
			centered: true,
			onOk() {
				deleteRange(clientId, result => {
					if (result.success) {
						notification.open({
							type: 'success',
							message: 'Removed successfully',
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
				title: 'Type',
				dataIndex: 'type',
				key: 'type',
				render: val => {
					if (val === 0) {
						return 'Organization Merit Points Range';
					} else if (val === 1) {
						return 'Member Total Score Range';
					} else if (val === 2) {
						return 'Member Merit Points Range';
					} else if (val === 3) {
						return 'Organization Total Score Range';
					} else if (val === 4) {
						return 'M2M Member Merit Points Range';
					} else if (val === 5) {
						return 'M2M Rating Range';
					}
				},
			},
			{
				title: 'Description',
				dataIndex: 'description',
				key: 'description',
			},
			{
				title: 'Actions',
				key: 'actions',
				render: record => (
					<ButtonGroup>
						<Button icon="search" onClick={() => this.onView(record.type)}>
							View
						</Button>
						<Button icon="edit" onClick={() => this.onEdit(record.type)}>
							Edit
						</Button>
					</ButtonGroup>
				),
			},
		];

		return (
			<Card title="Ranges">
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
						onClick={this.onAdd}
					>
						Add
					</Button>
					<br />
				</div>
				<Table
					columns={tableColumns}
					dataSource={this.state.data}
					pagination={true}
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default ListForm;
