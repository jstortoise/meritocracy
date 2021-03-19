import React from 'react';
import { connect } from 'react-redux';
import { profile, logout } from 'ducks/app';
import { Menu, Dropdown, Avatar } from 'antd';

const mapDispatchToProps = dispatch => ({
	logout: event => {
		event.preventDefault();
		dispatch(logout());
	},
	profile: event => {
		event.preventDefault();
		dispatch(profile());
	},
});

const mapStateToProps = (state, props) => ({
	userState: state.app.userState,
});

@connect(
	mapStateToProps,
	mapDispatchToProps,
)
class ProfileMenu extends React.Component {
	state = {
		count: 7,
	};

	addCount = () => {
		this.setState({
			count: this.state.count + 1,
		});
	};

	render() {
		const { userState, logout, profile } = this.props;
		const menu = (
			<Menu selectable={false}>
				<Menu.Divider />
				<Menu.Item>
					<a href="javascript: void(0);" onClick={profile}>
						<i className="topbar__dropdownMenuIcon icmn-user" /> Profile
					</a>
				</Menu.Item>
				<Menu.Item>
					<a href="javascript: void(0);" onClick={logout}>
						<i className="topbar__dropdownMenuIcon icmn-exit" /> Logout
					</a>
				</Menu.Item>
			</Menu>
		);

		const { username, mid } = userState;
		return (
			<div className="topbar__dropdown d-inline-block">
				<div className="d-inline-block mr-4">
					<strong>{username + (mid ? '(' + mid + ')' : '')}</strong>
				</div>
				<Dropdown
					overlay={menu}
					trigger={['click']}
					placement="bottomRight"
					// onVisibleChange={this.addCount}
				>
					<a className="ant-dropdown-link" href="/">
						<Avatar
							className="topbar__avatar"
							shape="square"
							size="large"
							icon="user"
						/>
					</a>
				</Dropdown>
			</div>
		);
	}
}

export default ProfileMenu;
