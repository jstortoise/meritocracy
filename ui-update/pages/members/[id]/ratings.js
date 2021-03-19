import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Breadcrumb, Row, Col, Typography, Input, Icon, Button, Checkbox, Spin } from 'antd';
import Pagination from '../../../components/Pagination';
import { timeFormat } from '../../../redux/ducks/app';
import { REDUCER, getUserDetailById } from '../../../redux/ducks/user';
import { getClientListByUserId } from '../../../redux/ducks/client';
import { searchBy } from '../../../redux/ducks/rating';
import Hexagon from '../../../components/Hexagon';
import SliderComponent from '../../../components/PageComponents/organisations/slider';
import '../style.scss';

const RatingsPageWithRouter = props => {
    const router = useRouter();
    return (<RatingsPage {...props} router={router}/>);
};

RatingsPageWithRouter.getInitialProps = async () => {
    return { roles: [0, 1, 2, 3] };
};

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
class RatingsPage extends React.Component {
    state = {
        user: {},
        clients: [],
        currentClientIndex: 0,
        ratings: [],
        totalCount: 0,
        inputTagValue: '',
        loading: false,
        loadingUser: false,
        // search filters
        showGlobal: false,
        filterClient: false,
        clientName: '',
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        sortBy: 'rating',
        ascDesc: 'asc',
        tags: ['Tag1', 'LongerTag2', 'EventLongerTag2'],
    };

    componentDidMount() {
        const { router } = this.props;
        const { id: userId } = router.query;
        this.setState({ loadingUser: true }, () => {
            getUserDetailById(userId, res => {
                var state = this.state;
                state.loadingUser = false;
                if (res.success) {
                    state.user = res.data;
                }
                this.setState(state);
                getClientListByUserId(userId, res => {
                    if (res.success) {
                        this.setState({ clients: res.data });
                    }
                    this.searchHistory();
                });
            });
        });
    }

    onToggleGlobal = () => {
        const { showGlobal } = this.state;
        this.setState({ showGlobal: !showGlobal }, this.searchHistory);
    };

    onToggleClient = () => {
        var state = this.state;
        state.filterClient = !state.filterClient;
        if (state.clients.length > 0) {
            state.clientName = state.clients[state.currentClientIndex].clientName;
        }
        this.setState(state, this.searchHistory);
    };

    onClientChange = index => {
        var state = this.state;
        if (state.clients.length > 0) {
            state.clientName = state.clients[index].clientName;
        }
        state.currentClientIndex = index;
        this.setState(state, this.searchHistory);
    };

    onPageChange = pageNum => {
        this.setState({ pageNum }, this.searchHistory);
    };

    sortByReputation = () => {
        const { ascDesc } = this.state;
        this.setState({ ascDesc: ascDesc === 'asc' ? 'desc' : 'asc' }, this.searchHistory);
    };

    onSearch = keyword => {
        this.setState({ keyword, pageNum: 1 }, this.searchHistory);
    };

    searchHistory = () => {
        const { router } = this.props;
        const { id: userId } = router.query;
        const { showGlobal, filterClient, clientName, keyword, pageNum, pageSize, sortBy, ascDesc, tags } = this.state;
        const searchFilters = { userId, showGlobal, filterClient, clientName, keyword, pageNum, pageSize, sortBy, ascDesc, tags };
        
        this.setState({ loading: true }, () => {
            searchBy(searchFilters, res => {
                var state = this.state;
                state.loading = false;
                if (res.success) {
                    state.ratings = res.data;
                    state.totalCount = parseInt(res.totalCount);
                }
                this.setState(state);
            });
        });
    };

    render() {
        const { ratings, totalCount, user, clients, currentClientIndex, filterClient, pageNum, pageSize, ascDesc, loading, loadingUser } = this.state;
        let userType = 'Member';
        
        if (user.role === 0) {
            userType = 'Super Admin';
        } else if (user.role === 1) {
            userType = 'Moderator';
        } else if (user.role === 2) {
            userType = 'Organisation Member';
        }
        
        return (
            <div className="rating-history">
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>RATINGS</Breadcrumb.Item>
                    <Breadcrumb.Item>MEMBERS</Breadcrumb.Item>
                </Breadcrumb>
                <Row type="flex" style={{ marginTop: 10 }} align="middle" gutter={30} className="header">
                    <Col>
                        <Row type="flex" align="middle" gutter={10}>
                            <Col><Hexagon text={user.mpRating ? parseInt(user.mpRating).toFixed(0) : 0}/></Col>
                            <Col>
                                { loadingUser ? (
                                    <Icon type="loading"/>
                                ) : (
                                    <Typography>
                                        <Typography.Title level={4}>
                                            {`${user.firstName} ${user.lastName}`}
                                            <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" style={{ marginLeft: 5 }} />
                                        </Typography.Title>
                                        <Typography.Text disabled style={{ cursor: "initial" }}>{userType}</Typography.Text>
                                    </Typography>
                                )}
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Button shape="round">
                            Export to Blockchain
                            <Icon type="arrow-down"/>
                        </Button>
                    </Col>
                    <Col>
                        <Checkbox onChange={this.onToggleGlobal}>Show Global Ratings</Checkbox>
                    </Col>
                    <Col>
                        <Checkbox onChange={this.onToggleClient}>Filter by Organisation</Checkbox>
                    </Col>
                    {filterClient && (
                        <Col>
                            <SliderComponent data={clients} current={currentClientIndex} onChange={this.onClientChange}/>
                        </Col>
                    )}
                </Row>
                <Row type="flex" align="middle" gutter={20}>
                    <Col style={{ marginTop: 10 }}>
                        <Input.Search onSearch={this.onSearch} style={{ width: 350, marginRight: 30 }} />
                    </Col>
                    <Col style={{ marginTop: 10 }}>
                        <Pagination size="small" showLessItems={true} current={pageNum} pageSize={pageSize} total={totalCount} onChange={this.onPageChange} />
                    </Col>
                    <Col style={{ marginTop: 10 }}>|</Col>
                    <Col style={{ marginTop: 10 }}>Filter</Col>
                    <Col style={{ marginTop: 10 }}><Button icon="filter" shape="round" onClick={this.sortByReputation}>Reputation<Icon type={ascDesc === "asc" ? "down" : "up"} /></Button></Col>
                    <Col style={{ marginTop: 10 }}><Button icon="setting" shape="round" onClick={this.sortByReputation}>Search Tools</Button></Col>
                </Row>

                {/* Show history list */}
                <Row type="flex" align="bottom" style={{ marginTop: 20 }}>
                    <Col xl={{ span: 2 }} span={4}>Activity</Col>
                    <Col xl={{ span: 3 }} span={6}>Organisation</Col>
                    <Col xl={{ span: 3 }} span={6}>Member</Col>
                    <Col xl={{ span: 2 }} span={4}>Status</Col>
                    <Col xl={{ span: 3 }} span={4}>
                        Time <Icon type="exclamation-circle" theme="filled" />
                        <br/>
                        (UTC + 00:00)
                    </Col>
                </Row>

                <Spin spinning={loading}>
                    {ratings.map((data, index) => (
                        <Row type="flex" align="bottom" style={{ marginTop: 10 }} key={index}>
                            <Col xl={{ span: 2 }} span={4}>
                                {data.activity}
                            </Col>
                            <Col xl={{ span: 3 }} span={6}>
                                {data.clientName}
                            </Col>
                            <Col xl={{ span: 3 }} span={6}>
                                {data.fullName}
                            </Col>
                            <Col xl={{ span: 2 }} span={4}>
                                {data.rating > 0 && '+'}
                                {data.rating}
                                {data.rating > 0 ? (
                                    <Icon type="caret-up" />
                                ) : (
                                    <Icon type="caret-down" />
                                )}
                            </Col>
                            <Col xl={{ span: 3 }} span={4}>
                                {timeFormat(new Date(data.updatedAt))}
                            </Col>
                        </Row>
                    ))}
                </Spin>
            </div>
        );
    }
}

export default RatingsPageWithRouter;