import { Card, Row, Col } from 'antd';
import OrganisationPanel from '../organisations/panel';

class ClientResult extends React.Component {
    componentDidUpdate() {
        var div = document.getElementById('clientSearchResults');
        div.scrollTop = 0;
    }
    
    render() {
        const { data, pagination } = this.props;
        return (
            <Card title="Organisations">
                <div style={{ maxHeight: '486px', overflow: 'auto', overflowX: 'hidden' }} id="clientSearchResults">
                    <Row type="flex" gutter={20}>
                        {data.map(d => (
                            <Col key={d.id}><OrganisationPanel data={d} /></Col>
                        ))}
                    </Row>
                </div>
                <div style={{ marginTop: '10px' }}>
                    {pagination}
                </div>
            </Card>
        );
    };
}

export default ClientResult;