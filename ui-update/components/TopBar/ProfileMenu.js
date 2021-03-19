import Link from 'next/link';
import { Badge, Avatar, Dropdown, Menu, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { setUserState } from '../../redux/ducks/app';
import { logout } from '../../redux/ducks/auth';
import { updateNotification } from '../../redux/ducks/notification';

@connect(state => state)
class ProfileMenu extends React.Component {
	state = {
		loading: false
	};

    onLogout = () => {
		const { dispatch } = this.props;
		dispatch(logout());
	};


    readNotificationFromCookie = id => {
        const { dispatch } = this.props;
        let { user } = this.props.app;
        const index = user.notifications.findIndex(obj => obj.id === id);
        if (index > -1) {
			user.notifications[index].isRead = 1;
			dispatch(setUserState({ user }));
        }
    }
    
    onReadNotification = id => {
		this.setState({ loading: true });
        updateNotification(id, { isRead: 1 }, res => {
            if (res.success) {
				this.readNotificationFromCookie(id);
				this.setState({ loading: false });
            }
        });
    };

	render() {
        const menu = (
			<Menu selectable={false}>
				<Menu.Item>
					<Link href="/profile/edit">
						<a>Profile</a>
					</Link>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item>
					<a href="javascript:void(0);" onClick={this.onLogout}>Logout</a>
				</Menu.Item>
			</Menu>
		);

		const { user } = this.props.app;
		const { notifications } = user;
		const { showProfile } = this.props;

		const nfList = () => {
			let menus = [];
			let unread_count = 0, read_count = 0, i = 0;
			
			if (notifications) {
				notifications.forEach(obj => {
					if (!obj.isRead) {
						if (unread_count < 5) {
							menus.push(
								<Menu.Item key={i} onClick={() => this.onReadNotification(obj.id)}>
									<div className="notification-item">
										<span>{obj.description}</span>
										{/* <Icon type={this.state.loading ? "loading" : "close"} onClick={() => this.onDeleteNotification(obj.id)}/> */}
									</div>
								</Menu.Item>
							);
						}
						unread_count++;
					}
					i++;
				});
				
				i = 0;
				notifications.forEach(obj => {
					if (obj.isRead) {
						if (unread_count + read_count < 5) {
							menus.push(
								<Menu.Item key={i} disabled>
									<div className="notification-item">
										<span>{obj.description}</span>
										{/* <Icon type={this.state.loading ? "loading" : "close"} onClick={() => this.onDeleteNotification(obj.id)}/> */}
									</div>
								</Menu.Item>
							);
						}
						read_count++;
					}
					i++;
				});
			}

			return { content: (
				<Menu selectable={false} className="top-notifications">
					{menus}
					<Menu.Divider/>
					<Menu.Item>
						<Link href="/notifications">
							<a>See all notifications</a>
						</Link>
					</Menu.Item>
				</Menu>
			), count: unread_count };
		}

		return (
            <div className="topbar__dropdown d-inline-block">
				{user.username && showProfile ? (
					<div>
						<Dropdown overlay={nfList().content} trigger={['click']} placement="bottomRight" className="mr-2">
							<Button className="btn-topbar">
								<Badge count={nfList().count} style={{ cursor: 'pointer' }}>
									<Icon type="bell"/>
								</Badge>
							</Button>
						</Dropdown>
						<div className="d-inline-block mr-1 user-label">
							<strong>{ user.username }</strong>
						</div>
						<Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
							<a className="ant-dropdown-link" href="/">
								<Avatar
									className="topbar__avatar"
									shape="circle"
									size="large"
									icon="user"
									style={{ cursor: 'pointer' }}
								/>
							</a>
						</Dropdown>
					</div>
				) : (
					<div className="d-inline-block mr-4">
						<Link href="/login">
							<a style={{ color: '#000', fontWeight: 500 }}>LOGIN</a>
						</Link>
					</div>
				)}
			</div>
        );
    }
}

export default ProfileMenu;
