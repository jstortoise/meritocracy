import Router from 'next/router';
import { Row, Col } from 'antd';
import OrganisationPanel from './panel';
import './style.scss';

class ListPage extends React.Component {
    state = {
        currentPage: 1
    };

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    onClick = clientId => {
        Router.push(`/organisations/${clientId}/secret`);
    };

    render() {
        const { data, clickable } = this.props;
        
        return (
            <div className="organisations-list" style={this.props.style}>
                <Row type="flex" gutter={20}>
                    {data.map(d => (
                        clickable ? (
                            <Col key={d.secret}><OrganisationPanel data={d} onClick={() => this.onClick(d.id)} style={{ cursor: 'pointer' }}/></Col>
                        ) : (
                            <Col key={d.secret}><OrganisationPanel data={d}/></Col>
                        )
                    ))}
                </Row>
            </div>
        );
    }
}

export default ListPage;