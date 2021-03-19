import Link from 'next/link';
import { Row, Col, Typography, Spin, Button, Input, Icon } from 'antd';
import Pagination from '../../../components/Pagination';
import EmptyPanel from '../../../components/PageComponents/organisations/empty';
import OrganisationList from '../../../components/PageComponents/organisations/list';
import { getMyClientList } from '../../../redux/ducks/client';
import '../style.scss';

class MyOrganisationsPage extends React.Component {
    state = {
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        organisations: [],
        totalCount: 0,
        sortBy: 'meritPoint',
        ascDesc: 'asc',
        loading: false,
        empty: true
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
            getMyClientList({ keyword, pageNum, pageSize, sortBy, ascDesc }, res => {
                var state = this.state;
                state.loading = false;
                if (res.success) {
                    state.organisations = res.data;
                    state.totalCount = res.totalCount;
                    if (state.organisations.length > 0) {
                        state.empty = false;
                    }
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
        const { pageNum, pageSize, organisations, totalCount, loading, ascDesc, empty } = this.state;
        const pageCount = Math.ceil(totalCount / pageSize);

        const addIcon = () => <img src="/static/images/org_add_sm.png"/>

        return (
            <div className="organisations">
                <Spin spinning={loading}>
                    {empty ? (
                        !loading && <EmptyPanel />
                    ) : (
                        <div>
                            <Row type="flex" gutter={20} className="header">
                                <Col xl={{ span: 8 }} style={{ marginTop: 10, minWidth: 435 }}>
                                    <Row type="flex" gutter={10} className="pagination">
                                        <Col style={{ width: 210 }}>
                                            <Typography.Title level={4} style={{ fontSize: 13, marginBottom: 0 }}>MY ORGANISATIONS</Typography.Title>
                                            <Typography.Text type="secondary" style={{ fontSize: 13 }}>ORGANISATIONS I'M PART OF</Typography.Text>
                                        </Col>
                                        <Col style={{ flex: 1 }}><Input.Search onSearch={this.onSearch} /></Col>
                                    </Row>
                                </Col>
                                <Col xl={{ span: 8 }} style={{ marginTop: 10, minWidth: 300, paddingTop: 5, paddingBottom: 5 }}>
                                    <Pagination size="small" showLessItems={true} current={pageNum} total={totalCount} onChange={this.onPageChange}/>
                                </Col>
                                <Col xl={{ span: 8 }} style={{ marginTop: 10, minWidth: 400 }}>
                                    <Row type="flex" gutter={10} align="middle">
                                        <Col>|</Col>
                                        <Col>Filter</Col>
                                        <Col><Button icon="filter" onClick={this.sortByReputation}>Reputation<Icon type={ascDesc === "asc" ? "down" : "up"} /></Button></Col>
                                        <Col>
                                            <Link href="/organisations/create">
                                                <Button style={{ paddingRight: 0 }}>
                                                    <Row type="flex" gutter={5} align="middle" style={{ marginTop: -7, marginRight: -5 }}>
                                                        <Col>Create an Organisation</Col>
                                                        <Col><Icon component={addIcon}/></Col>
                                                    </Row>
                                                </Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <OrganisationList data={organisations} style={{ marginTop: 20 }} clickable={true}/>
                        </div>
                    )}
                </Spin>
            </div>
        );
    }
}

export default MyOrganisationsPage;