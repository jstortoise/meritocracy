import Link from 'next/link';
import { Row, Col, Typography, Spin, Button, Input, Icon } from 'antd';
import Pagination from '../../components/Pagination';
import OrganisationList from '../../components/PageComponents/organisations/list';
import { getClientList } from '../../redux/ducks/client';
import './style.scss';

class OrganisationsPage extends React.Component {
    state = {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        organisations: [],
        totalCount: 0,
        sortBy: 'meritPoint',
        ascDesc: 'asc',
        loading: false
    };

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    componentDidMount() {
        this.getClientList();
    }

    getClientList = () => {
        const { keyword, pageNum, pageSize, sortBy, ascDesc } = this.state;
        this.setState({ loading: true }, () => {
            getClientList({ keyword, pageNum, pageSize, sortBy, ascDesc }, res => {
                var state = this.state;
                state.loading = false;
                if (res.success) {
                    state.organisations = res.data;
                    state.totalCount = res.totalCount;
                }
                this.setState(state);
            });
        });
    };

    onSearch = val => {
        this.setState({ keyword: val }, () => {
            this.getClientList();
        });
    };

    sortByReputation = () => {
        const { ascDesc } = this.state;
        this.setState({ ascDesc: ascDesc === 'asc' ? 'desc' : 'asc' }, () => {
            this.getClientList();
        });
    };

    onPageChange = pageNum => {
        this.setState({ pageNum }, () => {
            this.getClientList();
        });
    };

    render() {
        const { pageNum, pageSize, organisations, totalCount, loading, ascDesc } = this.state;
        
        return (
            <div className="organisations">
                <Row type="flex" gutter={20} className="header">
                    <Col xl={{ span: 8 }} style={{ marginTop: 10 }}>
                        <Row type="flex" gutter={20}>
                            <Col style={{ width: 140 }}>
                                <Typography.Title level={4} style={{ fontSize: 13, marginBottom: 0 }}>ORGANISATIONS</Typography.Title>
                                <Typography.Text type="secondary" style={{ fontSize: 13 }}>GLOBAL LIST</Typography.Text>
                            </Col>
                            <Col style={{ flex: 1 }}><Input.Search onSearch={this.onSearch} /></Col>
                        </Row>
                    </Col>
                    <Col xl={{ span: 8 }} style={{ marginTop: 10, paddingTop: 5, paddingBottom: 5 }}>
                        <Pagination size="small" showLessItems={true} current={pageNum} total={totalCount} onChange={this.onPageChange}/>
                    </Col>
                    <Col xl={{ span: 8 }} style={{ marginTop: 10 }}>
                        <Row type="flex" gutter={10} align="middle">
                            <Col>|</Col>
                            <Col>Filter</Col>
                            <Col><Button icon="filter" onClick={this.sortByReputation}>Reputation<Icon type={ascDesc === "asc" ? "down" : "up"} /></Button></Col>
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginTop: 20 }}>
                    <Spin spinning={loading}>
                        <OrganisationList data={organisations}/>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default OrganisationsPage;