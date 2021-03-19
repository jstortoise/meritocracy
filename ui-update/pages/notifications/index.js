import { connect } from 'react-redux';
import { Card, List, Button } from 'antd';
import { setUserState } from '../../redux/ducks/app';
import { deleteNotification } from '../../redux/ducks/notification';

@connect(state => state)
class NotificationList extends React.Component {
    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    updateUserState = id => {
        const { dispatch } = this.props;
        let { user } = this.props.app;
        let index = -1;
        for (let i = 0; i < user.notifications.length; i++) {
            if (user.notifications[i].id === id) {
                index = i;
            }
        }
        if (index > -1) {
            user.notifications.splice(index, 1);
        }
        dispatch(setUserState({ user }));
    }

    onDelete = id => {
        deleteNotification(id, res => {
            if (res.success) {
                this.updateUserState(id);
            }
        });
    };

    render() {
        const { user } = this.props.app;
        return (
            <Card title="Notifications">
                <List
                    dataSource={user.notifications}
                    renderItem={item => (
                        <List.Item actions={[<span>Just ago</span>, <Button type="primary" icon="delete" onClick={() => this.onDelete(item.id)}/>]}>
                            {item.description}
                        </List.Item>
                    )}
                />
            </Card>
        );
    }
}

export default NotificationList;