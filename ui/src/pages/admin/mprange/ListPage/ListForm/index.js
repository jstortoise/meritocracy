import React from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Card, Table, Button } from 'antd';

import { REDUCER, getPointsList } from 'ducks/mprange';
import { getRangeList } from 'ducks/range';

const mapStateToProps = (state, props) => ({
	isSubmitForm: state.app.submitForms[REDUCER],
});

@connect(mapStateToProps)
class ListForm extends React.Component {
	state = {
		orgColumns: [],
		mporg: [], // Org Merit Points
		memColumns: [],
		mpmem: [], // Member Merit Points
		m2mColumns: [],
		memweight: [], // Member Weight
	};

	componentDidMount() {
		this.refreshList();
	}

	initOrgTableColumns = () => {
		let orgColumns = [
			{
				title: 'Organization Merit Points',
				key: 'title',
				render: () => 'Points Range assigned to a Member',
			},
		];
		this.setState({
			orgColumns: orgColumns,
		});
		return orgColumns;
	};

	initMemTableColumns = () => {
		let memColumns = [
			{
				title: 'Member Merit Points',
				key: 'title',
				render: () => 'Points Range assigned to the organisation',
			},
		];
		this.setState({
			memColumns: memColumns,
		});
		return memColumns;
	};

	initM2MTableColumns = () => {
		let m2mColumns = [
			{
				title: 'Member Merit Points',
				key: 'title',
				render: () => 'Member Weight',
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
		var orgColumns = this.initOrgTableColumns();
		var memColumns = this.initMemTableColumns();
		var m2mColumns = this.initM2MTableColumns();

		// get all range detail
		getRangeList(result => {
			if (result.success) {
				result.data.forEach(range => {
					let fields = range.fields;
					if (range.type === 0) {
						// Organization Merit Points Range
						state.mporg.push({});
						for (let i = 0; i < fields.length; i++) {
							orgColumns.push({
								title: fields[i].displayname,
								dataIndex: `${fields[i].name}`,
								key: fields[i].name,
							});
							state.mporg[0][fields[i].name] = '';
						}
						orgColumns.push({
							title: 'Actions',
							key: 'actions',
							render: () => (
								<Button icon="edit" onClick={() => this.onEdit(0)}>
									Edit
								</Button>
							),
						});
						state.orgColumns = orgColumns;
					} else if (range.type === 2) {
						// Member Merit Points Range
						state.mpmem.push({});
						for (let i = 0; i < fields.length; i++) {
							memColumns.push({
								title: fields[i].displayname,
								dataIndex: `${fields[i].name}`,
								key: fields[i].name,
							});
							state.mpmem[0][fields[i].name] = '';
						}
						memColumns.push({
							title: 'Actions',
							key: 'actions',
							render: () => (
								<Button icon="edit" onClick={() => this.onEdit(1)}>
									Edit
								</Button>
							),
						});
						state.memColumns = memColumns;
					} else if (range.type === 4) {
						// M2M Member Weight
						state.memweight.push({});
						for (let i = 0; i < fields.length; i++) {
							m2mColumns.push({
								title: fields[i].displayname,
								dataIndex: `${fields[i].name}`,
								key: fields[i].name,
								align: 'center',
							});
							state.memweight[0][fields[i].name] = '';
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
				getPointsList(result => {
					if (result.success) {
						result.data.forEach(data => {
							if (data.type === 0) {
								// Org Merit Points
								state.mporg = [data.fields];
							} else if (data.type === 1) {
								// Member Merit Points
								state.mpmem = [data.fields];
							} else if (data.type === 2) {
								// Member Weight
								state.memweight = [data.fields];
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
		dispatch(push(`/mprange/edit/${type}`));
	};

	render() {
		return (
			<Card title="Merit Points">
				<Table
					columns={this.state.orgColumns}
					dataSource={this.state.mporg}
					rowKey="field0"
					pagination={false}
				/>
				<Table
					columns={this.state.memColumns}
					dataSource={this.state.mpmem}
					rowKey="field0"
					pagination={false}
					style={{ marginTop: '20px' }}
				/>
				<Table
					columns={this.state.m2mColumns}
					dataSource={this.state.memweight}
					rowKey="field0"
					pagination={false}
					style={{ marginTop: '20px' }}
				/>
			</Card>
		);
	}
}

export default ListForm;
