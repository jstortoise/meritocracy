import { Card, Row, Col, Avatar } from 'antd';
import Hexagon from '../../Hexagon';

class UserResult extends React.Component {
    componentDidUpdate() {
        const div = document.getElementById('userSearchResults');
        div.scrollTop = 0;
    }
    
    render() {
        const { data, pagination } = this.props;
        const profileLayout1 = {
            xxl: { span: 6 },
            lg: { span: 10 },
            xs: { span: 12 }
        };
        const profileLayout2 = {
            xxl: { span: 2 },
            lg: { span: 4 },
            xs: { span: 5 },
            style: { textAlign: 'center' }
        };
        const profileLayout3 = {
            xxl: { span: 4 },
            lg: { span: 6 },
            xs: { span: 7 }
        };
        const clientColors = ['#f56a00', '#7265e6', '#ffbf00', '#00ff00'];

        const clientItems = clientCount => {
            var items = [];
            for (let i = 0; i < clientCount; i++) {
                items.push(
                    <Col key={i}>
                        <Avatar style={{ backgroundColor: clientColors[i], verticalAlign: 'middle' }} size={40}/>
                    </Col>
                );
            }
            return items;
        };

        return (
            <Card title="Profiles" style={{ marginBottom: '10px' }}>
                <Row style={{ marginBottom: '10px' }}>
                    <Col {...profileLayout1}>Profile</Col>
                    <Col {...profileLayout2}>Master Rating</Col>
                    <Col {...profileLayout3}>Organisations</Col>
                </Row>
                <div style={{ maxHeight: '266px', overflow: 'auto', overflowX: 'hidden' }} id="userSearchResults">
                    {data.map(obj => (
                        <Row style={{ paddingTop: 10 }} align="middle" type="flex" key={obj.id}>
                            <Col {...profileLayout1}>
                                <Row type="flex" gutter={10} align="middle">
                                    <Col>
                                        <Avatar size={40} icon="user"/>
                                    </Col>
                                    <Col>{obj.firstName + ' ' + obj.lastName}</Col>
                                </Row>
                            </Col>
                            <Col {...profileLayout2}>
                                <Hexagon text={parseInt(obj.mpRating || 0).toFixed(1)} style={{ marginLeft: 'auto', marginRight: 'auto' }}/>
                            </Col>
                            <Col {...profileLayout3}>
                                <Row type="flex" gutter={10}>
                                    {clientItems(obj.clientCount)}
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                    {pagination}
                </div>
            </Card>
        );
    };
}

export default UserResult;