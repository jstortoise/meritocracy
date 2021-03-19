import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button } from 'antd';

import { REDUCER, getEvalList } from 'ducks/evaluation';
import { getRangeList } from 'ducks/range';

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class ListForm extends React.Component {
	state = {
		memColumns: [],
		memData: [], // Member score ratings
		orgColumns: [],
		orgData: [], // Organization score ratings
		m2mColumns: [],
		m2mData: [], // M2M ratings
	};

	tableColumns = [];

	componentDidMount() {
		this.refreshList();
	}

	initMemTableColumns = () => {
		let memColumns = [
			{
				title: 'Member Total score in Organisation',
				key: 'title',
				render: () => 'Organisation Rating to the Member',
			},
		];
		this.setState({
			memColumns: memColumns,
		});
		return memColumns;
	};

	initOrgTableColumns = () => {
		let orgColumns = [
			{
				title: 'Organisation Total score given by a Member',
				key: 'title',
				render: () => 'Member Rating to the Organisation',
			},
		];
		this.setState({
			orgColumns: orgColumns,
		});
		return orgColumns;
	};

	initM2MTableColumns = () => {
		let m2mColumns = [
			{
				title: 'Member rating given by a Member',
				key: 'title',
				render: () => 'Rate Evaluation',
			},
		];
		this.setState({
			m2mColumns: m2mColumns,
		});
		return m2mColumns;
	};

	refreshList = () => {
		var self = this;
		var state = self.state;
		var memColumns = this.initMemTableColumns();
		var orgColumns = this.initOrgTableColumns();
		var m2mColumns = this.initM2MTableColumns();
		getRangeList(result => {
			if (result.success) {
				result.data.forEach(range => {
					let fields = range.fields;
					if (range.type === 1) {
						// Member score ratings
						state.memData.push({});
						for (let i = 0; i < fields.length; i++) {
							memColumns.push({
								title: fields[i].displayname,
								dataIndex: `${fields[i].name}`,
								key: fields[i].name,
							});
							state.memData[0][fields[i].name] = '';
						}
						memColumns.push({
							title: 'Actions',
							key: 'actions',
							render: () => (
								<Button icon="edit" onClick={() => this.onEdit(0)}>
									Edit
								</Button>
							),
						});
						state.memColumns = memColumns;
					} else if (range.type === 3) {
						// Organization score ratings
						state.orgData.push({});
						for (let i = 0; i < fields.length; i++) {
							orgColumns.push({
								title: fields[i].displayname,
								dataIndex: `${fields[i].name}`,
								key: fields[i].name,
							});
							state.orgData[0][fields[i].name] = '';
						}
						orgColumns.push({
							title: 'Actions',
							key: 'actions',
							render: () => (
								<Button icon="edit" onClick={() => this.onEdit(1)}>
									Edit
								</Button>
							),
						});
						state.orgColumns = orgColumns;
					} else if (range.type === 5) {
						// M2M ratings
						state.m2mData.push({});
						for (let i = 0; i < fields.length; i++) {
							m2mColumns.push({
								title: fields[i].displayname,
								dataIndex: `${fields[i].name}`,
								key: fields[i].name,
							});
							state.m2mData[0][fields[i].name] = '';
						}
						m2mColumns.push({
							title: 'Actions',
							key: 'actions',
							render: () => (
								<Button icon="edit" onClick={() => this.onEdit(2)}>
									Edit
								</Button>
							),
						});
						state.m2mColumns = m2mColumns;
					}
				});
				self.setState(state);
				getEvalList(result => {
					if (result.success) {
						result.data.forEach(data => {
							if (data.type === 0) {
								// Member score ratings
								state.memData = [data.fields];
							} else if (data.type === 1) {
								// Organization score ratings
								state.orgData = [data.fields];
							} else if (data.type === 2) {
								// M2M ratings
								state.m2mData = [data.fields];
							}
						});
						self.setState(state);
					}
				});
			}
		});
	};

	onEdit = type => {
		const { dispatch } = this.props;
		dispatch(push(`/eval/edit/${type}`));
	};

	render() {
		return (
			<Card title="Score Ratings">
				<Table
					columns={this.state.memColumns}
					dataSource={this.state.memData}
					rowKey="field0"
					pagination={false}
				/>
				<Table
					columns={this.state.orgColumns}
					dataSource={this.state.orgData}
					rowKey="field0"
					pagination={false}
					style={{ marginTop: '20px' }}
				/>
				<Table
					columns={this.state.m2mColumns}
					dataSource={this.state.m2mData}
					rowKey="field0"
					pagination={false}
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default ListForm;
