import Link from 'next/link';
import { Card, Row, Col, Avatar, Tooltip } from 'antd';
import Hexagon from '../../Hexagon';
import './style.scss';

class UserList extends React.Component {
    componentDidUpdate() {
        var div = document.getElementById('user_list');
        div.scrollTop = 0;
    }
    
    render() {
        const { data, style } = this.props;
        const profileLayout1 = {
            style: { width: 230 }
        };
        const profileLayout2 = {
            style: { width: 150, textAlign: 'center' }
        };
        const profileLayout3 = {
            style: { width: 250, minWidth: 150 }
        };
        const clientColors = ['#f56a00', '#7265e6', '#ffbf00', '#00ff00'];

        const clientItems = clients => {
            var items = [];
            if (clients && clients.length > 0) {
                clients.forEach((client, i) => {
                    items.push(
                        <Col key={i}>
                            <Link href={`/organisations/${client.id}/detail`}>
                                <Tooltip title={client.name}>
                                    <Avatar
                                        style={{ backgroundColor: clientColors[i], verticalAlign: 'middle', cursor: 'pointer' }}
                                        size={40}
                                    />
                                </Tooltip>
                            </Link>
                        </Col>
                    );
                });
            }
            return items;
        };

        return (
            <Row type="flex" className="members-list">
                <Col xxl={{ span: 12 }} xl={{ span: 24 }}>
                    <Row style={{ marginBottom: '10px', fontSize: 13 }} gutter={10} type="flex">
                        <Col {...profileLayout1}>Profile</Col>
                        <Col {...profileLayout2}>Master Rating</Col>
                        <Col {...profileLayout3}>Organisations</Col>
                    </Row>
                    <div style={style} id="user_list">
                        {data.map((obj, index) => (index % 2 == 0 && (
                            <Row style={{ paddingTop: 10 }} align="middle" type="flex" key={obj.id} gutter={10}>
                                <Col {...profileLayout1}>
                                    <Link href={`/members/${obj.id}/ratings`}>
                                        <Row type="flex" gutter={10} align="middle">
                                            <Col>
                                                <Avatar size={40} icon="user"/>
                                            </Col>
                                            <Col style={{ cursor: "pointer" }}>{obj.firstName + ' ' + obj.lastName}</Col>
                                        </Row>
                                    </Link>
                                </Col>
                                <Col {...profileLayout2}>
                                    <Hexagon text={obj.mpRating ? parseInt(obj.mpRating).toFixed(0) : 0} style={{ marginLeft: 'auto', marginRight: 'auto' }}/>
                                </Col>
                                <Col {...profileLayout3}>
                                    <Row type="flex" gutter={5}>
                                        {clientItems(obj.clients)}
                                    </Row>
                                </Col>
                            </Row>
                        )))}
                    </div>
                </Col>
                {data.length > 1 && (
                    <Col xxl={{ span: 12 }} xl={{ span: 24 }} className="hide-header-xl">
                        <Row style={{ marginBottom: '10px', fontSize: 13 }} gutter={10} type="flex" className="header">
                            <Col {...profileLayout1}>Profile</Col>
                            <Col {...profileLayout2}>Master Rating</Col>
                            <Col {...profileLayout3}>Organisations</Col>
                        </Row>
                        <div style={style} id="user_list">
                            {data.map((obj, index) => (index % 2 == 1 && (
                                <Row style={{ paddingTop: 10 }} align="middle" type="flex" key={obj.id} gutter={10}>
                                    <Col {...profileLayout1}>
                                        <Link href={`/members/${obj.id}/ratings`}>
                                            <Row type="flex" gutter={10} align="middle">
                                                <Col style={{ cursor: "pointer" }}>
                                                    <Avatar size={40} icon="user"/>
                                                </Col>
                                                <Col>{obj.firstName + ' ' + obj.lastName}</Col>
                                            </Row>
                                        </Link>
                                    </Col>
                                    <Col {...profileLayout2}>
                                        <Hexagon text={obj.mpRating ? parseInt(obj.mpRating).toFixed(0) : 0} style={{ marginLeft: 'auto', marginRight: 'auto' }}/>
                                    </Col>
                                    <Col {...profileLayout3}>
                                        <Row type="flex" gutter={5}>
                                            {clientItems(obj.clients)}
                                        </Row>
                                    </Col>
                                </Row>
                            )))}
                        </div>
                    </Col>
                )}
            </Row>
        );
    };
}

export default UserList;