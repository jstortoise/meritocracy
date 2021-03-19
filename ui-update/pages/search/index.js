import { Row, Col, Form, Radio, Button, Collapse, Icon, DatePicker, InputNumber, Select, Spin, Pagination } from 'antd';
import EmptyResult from '../../components/PageComponents/search/empty';
import UserResult from '../../components/PageComponents/search/user';
import ClientResult from '../../components/PageComponents/search/client';
import { getParamsFromQuery } from '../../redux/ducks/app';
import { searchAll } from '../../redux/ducks/auth';
import { getClientList } from '../../redux/ducks/client';
import moment from 'moment';
import './style.scss';

@Form.create()
class SearchPage extends React.Component {
    state = {
        searchFilters: {
            keyword: '',
            filter: -1, // -1: any, 0: people profiles, 1: organisations
            clientFilter: -1, // -1: all, 0: legacy, 1: certified, 2: my organisations
            userFilter: -1, // -1: all, 3: users, 2: moderators, 1: admins
            source: -1, // -1: all, 0: you, 1: your friends, 2: admins
            date: -1, // -1: any
            dateFrom: null,
            dateTo: null,
            joinDateFrom: null,
            joinDateTo: null,
            mpFrom: null,
            mpTo: null,
            client: null,
            userPageSize: 10,
            userPageNum: 1,
            clientPageSize: 12,
            clientPageNum: 1
        },
        loading: false,
        fetching: false,
        clientSearchList: [],
        users: [],
        clients: [],
        userTotal: 0,
        clientTotal: 0
    };

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    };

    componentDidMount() {
        var state = this.state;
        const params = getParamsFromQuery(window.location.href);

        state.searchFilters.keyword = params['keyword'] || '';
        state.searchFilters.filter = isNaN(params['filter']) ? -1 : params['filter'] * 1;
        state.searchFilters.clientFilter = isNaN(params['clientFilter']) ? -1 : params['clientFilter'] * 1;
        state.searchFilters.userFilter = isNaN(params['userFilter']) ? -1 : params['userFilter'] * 1;
        state.searchFilters.source = isNaN(params['source']) ? -1 : params['source'] * 1;
        state.searchFilters.date = isNaN(params['date']) ? -1 : params['date'] * 1;

        state.searchFilters.dateFrom = params['dateFrom'] || null;
        state.searchFilters.dateTo = params['dateTo'] || null;
        state.searchFilters.joinDateFrom = params['joinDateFrom'] || null;
        state.searchFilters.joinDateTo = params['joinDateTo'] || null;
        state.searchFilters.mpFrom = params['mpFrom'] || null;
        state.searchFilters.mpTo = params['mpTo'] || null;
        state.searchFilters.client = params['client'] || null;

        this.setState(state, this.onSearchAll);
    }

    componentDidUpdate() {
        var state = this.state;
        const params = getParamsFromQuery(window.location.href);
        if (params['keyword'] !== state.searchFilters.keyword) {
            state.searchFilters.keyword = params['keyword'];
            this.setState(state, () => {
                this.onSearchAll();
            });
        }
    }

    onSearchAll = () => {
        var state = this.state;
        state.loading = true;
        state.searchFilters.userPageNum = 1;
        state.searchFilters.clientPageNum = 1;
        this.setState(state, () => {
            searchAll(state.searchFilters, res => {
                if (res.data && this.checkSearchFilters(res.data.searchFilters)) {
                    state = this.state;
                    state.loading = false;
                    if (res.success) {
                        state.users = res.data.users || [];
                        state.userTotal = res.data.userTotal;
                        state.clients = res.data.clients || [];
                        state.clientTotal = res.data.clientTotal;
                    }
                    this.setState(state);
                }
            });
        });
    };

    checkSearchFilters = resFilters => {
        var { searchFilters } = this.state;
        var isSame = true;
        Object.keys(searchFilters).forEach(field => {
            if (searchFilters[field] !== resFilters[field]) {
                isSame = false;
            }
        });
        return isSame;
    };
    
    onSearchUser = () => {
        var state = this.state;
        state.loading = true;
        this.setState(state, () => {
            var searchFilters = state.searchFilters;
            searchAll({ ...searchFilters, filter: 0 }, res => {
                if (res.success) {
                    state = this.state;
                    state.users = res.data.users || [];
                    state.userTotal = res.data.userTotal;
                    state.loading = false;
                    this.setState(state);
                }
            });
        });
    };
    
    onSearchClient = () => {
        var state = this.state;
        state.loading = true;
        this.setState(state, () => {
            var searchFilters = state.searchFilters;
            searchAll({ ...searchFilters, filter: 1 }, res => {
                if (res.success) {
                    state = this.state;
                    state.clients = res.data.clients || [];
                    state.clientTotal = res.data.clientTotal;
                    state.loading = false;
                    this.setState(state);
                }
            });
        });
    };

    disabledStartDate = startValue => {
        const endValue = this.state.searchFilters.dateTo;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > moment(endValue).valueOf();
    };
    
    disabledEndDate = endValue => {
        const startValue = this.state.searchFilters.dateFrom;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= moment(startValue).valueOf();
    };

    disabledJoinStartDate = startValue => {
        const endValue = this.state.searchFilters.joinDateTo;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > moment(endValue).valueOf();
    };
    
    disabledJoinEndDate = endValue => {
        const startValue = this.state.searchFilters.joinDateFrom;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= moment(startValue).valueOf();
    };

    updateQuery = () => {
        var state = this.state;
        var query = `keyword=${state.searchFilters.keyword || ''}`;
        if (state.searchFilters.filter !== -1) {
            query += `&filter=${state.searchFilters.filter}`;
        }
        if (state.searchFilters.clientFilter !== -1) {
            query += `&clientFilter=${state.searchFilters.clientFilter}`;
        }
        if (state.searchFilters.userFilter !== -1) {
            query += `&userFilter=${state.searchFilters.userFilter}`;
        }
        if (state.searchFilters.source !== -1) {
            query += `&source=${state.searchFilters.source}`;
        }
        if (state.searchFilters.date !== -1) {
            query += `&date=${state.searchFilters.date}`;
        }
        if (state.searchFilters.dateFrom) {
            query += `&dateFrom=${state.searchFilters.dateFrom}`;
        }
        if (state.searchFilters.dateTo) {
            query += `&dateTo=${state.searchFilters.dateTo}`;
        }
        if (state.searchFilters.joinDateFrom) {
            query += `&joinDateFrom=${state.searchFilters.joinDateFrom}`;
        }
        if (state.searchFilters.joinDateTo) {
            query += `&joinDateTo=${state.searchFilters.joinDateTo}`;
        }
        if (state.searchFilters.mpFrom) {
            query += `&mpFrom=${state.searchFilters.mpFrom}`;
        }
        if (state.searchFilters.mpTo) {
            query += `&mpTo=${state.searchFilters.mpTo}`;
        }
        if (state.searchFilters.client) {
            query += `&client=${state.searchFilters.client}`;
        }
        const href = `/search?${query}`;
        window.history.pushState({}, '', href);

        this.onSearchAll();
    };

    onChangeFilter = (field, e) => {
        var state = this.state;
        state.searchFilters[field] = e.target.value;
        this.setState(state, this.updateQuery);
    };

    onChangeInputFilter = (field, value) => {
        var state = this.state;
        state.searchFilters[field] = value;
        this.setState(state, this.updateQuery);
    };

    onChangeDateFilter = (field, value) => {
        var state = this.state;
        var dateValue = value;
        if (value) {
            dateValue = moment(value).format('YYYY-MM-DD')
        }
        state.searchFilters[field] = dateValue;
        this.setState(state, this.updateQuery);
    };

    fetchClient = value => {
        var state = this.state;
        state.clientSearchList = [];
        state.fetching = true;
        this.setState(state, () => {
            getClientList({ keyField: 'name', keyValue: value }, res => {
                state = this.state;
                if (res.success) {
                    if (res.data.length > 0) {
                        state.clientSearchList = res.data.map(client => ({
                            text: `${client.name}`,
                            value: `${client.id}`,
                        }));
                    }
                }
                state.fetching = false;
                this.setState(state);
            });
        });
    };

    handleClientChange = value => {
        var state = this.state;
        state.searchFilters.client = value;
        state.clientSearchList = [];
        state.fetching = false;
        this.setState(state, this.updateQuery);
    };

    onRemoveClient = () => {
        var state = this.state;
        state.searchFilters.client = null;
        this.setState(state, this.updateQuery);
    };

    onUserPageChange = (page, pageSize) => {
        var state = this.state;
        state.searchFilters.userPageNum = page;
        state.searchFilters.userPageSize = pageSize;
        this.setState(state, this.onSearchUser);
    };

    onClientPageChange = (page, pageSize) => {
        var state = this.state;
        state.searchFilters.clientPageNum = page;
        state.searchFilters.clientPageSize = pageSize;
        this.setState(state, this.onSearchClient);
    };

    render() {
        const year = (new Date()).getFullYear();

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        };
        const customPanelStyle = {
            background: 'none',
            borderRadius: 4,
            border: 0,
            overflow: 'hidden',
        };

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        let { keyword, dateFrom, dateTo, joinDateFrom, joinDateTo, mpFrom, mpTo, client } = this.state.searchFilters;
        const { fetching, clientSearchList, users, clients } = this.state;

        if (dateFrom) {
            dateFrom = moment(dateFrom);
        }
        if (dateTo) {
            dateTo = moment(dateTo);
        }
        if (joinDateFrom) {
            joinDateFrom = moment(joinDateFrom);
        }
        if (joinDateTo) {
            joinDateTo = moment(joinDateTo);
        }
 
        return (
            <Row className="search-page">
                <Col
                    xxl={{ span: 6 }}
                    xl={{ span: 8 }}
                    lg={{ span: 10 }}
                    md={{ span: 12 }}
                    xs={{ span: 24 }}
                    style={{ maxWidth: '350px' }}
                >
                    <Form>
                        <h3>Filter Results<br/>Looking for...</h3>
                        <Form.Item>
                            <Radio.Group value={this.state.searchFilters.filter} onChange={e => this.onChangeFilter('filter', e)}>
                                <Radio value={-1} style={radioStyle}>Any</Radio>
                                <Radio value={0} style={radioStyle}>People Profiles</Radio>
                                <Radio value={1} style={radioStyle}>Organisations</Radio>
                            </Radio.Group>
                        </Form.Item>
                        
                        { this.state.searchFilters.filter !== 0 && (
                            <div>
                                <h3>Organisation Filter</h3>
                                <Form.Item>
                                    <Radio.Group value={this.state.searchFilters.clientFilter} onChange={e => this.onChangeFilter('clientFilter', e)}>
                                        <Radio value={-1} style={radioStyle}>All</Radio>
                                        <Radio value={0} style={radioStyle}>Legacy</Radio>
                                        <Radio value={1} style={radioStyle}>Certified</Radio>
                                        <Radio value={2} style={radioStyle}>My Organisations</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        )}

                        { this.state.searchFilters.filter !== 1 && (
                            <div>
                                <h3>Profile by Status</h3>
                                <Form.Item>
                                    <Radio.Group value={this.state.searchFilters.userFilter} onChange={e => this.onChangeFilter('userFilter', e)}>
                                        <Radio value={-1} style={radioStyle}>All</Radio>
                                        <Radio value={3} style={radioStyle}>Users</Radio>
                                        <Radio value={2} style={radioStyle}>Moderators</Radio>
                                        <Radio value={1} style={radioStyle}>Admins</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </div>
                        )}

                        <h3>Source</h3>
                        <Form.Item>
                            <Radio.Group value={this.state.searchFilters.source} onChange={e => this.onChangeFilter('source', e)}>
                                <Radio value={-1} style={radioStyle}>All</Radio>
                                <Radio value={0} style={radioStyle}>You</Radio>
                                <Radio value={1} style={radioStyle}>Your Friends</Radio>
                                <Radio value={2} style={radioStyle}>Admins</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <h3>Date</h3>
                        <Form.Item>
                            <Radio.Group value={this.state.searchFilters.date} onChange={e => this.onChangeFilter('date', e)}>
                                <Radio value={-1} style={radioStyle}>Any Date</Radio>
                                <Radio value={year} style={radioStyle}>{year}</Radio>
                                <Radio value={year - 1} style={radioStyle}>{year - 1}</Radio>
                            </Radio.Group>

                            <Collapse
                                bordered={false}
                                expandIcon={({ isActive }) => <Icon style={{ fontSize: 18 }} type={isActive ? "minus-circle" : "plus-circle"}/>}
                                style={{ background: 'none', border: 'none' }}
                            >
                                <Collapse.Panel header="Choose a Date" style={customPanelStyle} key="1">
                                    <Form.Item label="From" {...formItemLayout}>
                                        <DatePicker
                                            mode="date"
                                            placeholder="DD MMM YYYY"
                                            format="DD MMM YYYY"
                                            value={dateFrom}
                                            disabledDate={this.disabledStartDate}
                                            onChange={e => this.onChangeDateFilter('dateFrom', e)}
                                        />
                                    </Form.Item>
                                    <Form.Item label="To" {...formItemLayout}>
                                        <DatePicker
                                            placeholder="DD MMM YYYY"
                                            format="DD MMM YYYY"
                                            value={dateTo}
                                            disabledDate={this.disabledEndDate}
                                            onChange={e => this.onChangeDateFilter('dateTo', e)}
                                        />
                                    </Form.Item>
                                </Collapse.Panel>
                            </Collapse>
                        </Form.Item>
                        
                        <h3>Advanced Filter</h3>
                        <Collapse
                            bordered={false}
                            expandIcon={({ isActive }) => <Icon style={{ fontSize: 18 }} type={isActive ? "minus-circle" : "plus-circle"}/>}
                            style={{ background: 'none', border: 'none' }}
                        >
                        { this.state.searchFilters.filter !== 0 && (
                            <Collapse.Panel header="Join Date" style={customPanelStyle} key="2">
                                <Form.Item label="From" {...formItemLayout}>
                                    <DatePicker
                                        placeholder="DD MMM YYYY"
                                        format="DD MMM YYYY"
                                        value={joinDateFrom}
                                        disabledDate={this.disabledJoinStartDate}
                                        onChange={e => this.onChangeDateFilter('joinDateFrom', e)}
                                    />
                                </Form.Item>
                                <Form.Item label="To" {...formItemLayout}>
                                    <DatePicker
                                        placeholder="DD MMM YYYY"
                                        format="DD MMM YYYY"
                                        value={joinDateTo}
                                        disabledDate={this.disabledJoinEndDate}
                                        onChange={e => this.onChangeDateFilter('joinDateTo', e)}
                                    />
                                </Form.Item>
                            </Collapse.Panel>
                        )}
                            <Collapse.Panel header="Set Merit Score Range" style={customPanelStyle} key="3">
                                <Row gutter={20}>
                                    <Col span={12}>
                                        <Form.Item label="More than" {...formItemLayout1}>
                                            <InputNumber
                                                defaultValue={mpFrom}
                                                min={0}
                                                max={mpTo || undefined}
                                                onChange={e => this.onChangeInputFilter('mpFrom', e)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Less than" {...formItemLayout1}>
                                            <InputNumber
                                                defaultValue={mpTo}
                                                min={mpFrom || 0}
                                                onChange={e => this.onChangeInputFilter('mpTo', e)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Collapse.Panel>
                            <Collapse.Panel header="Choose an Organisation" style={customPanelStyle} key="4">
                                <Row type="flex">
                                    <Col>
                                        <Select
                                            showSearch
                                            placeholder="Choose an Organisation"
                                            value={client}
                                            notFoundContent={fetching ? <Spin size="small"/> : null}
                                            filterOption={false}
                                            showArrow={false}
                                            onSearch={this.fetchClient}
                                            onChange={this.handleClientChange}
                                            removeIcon={<Icon type="close"/>}
                                            clearIcon={<Icon type="close"/>}
                                            style={{ minWidth: '150px' }}
                                        >
                                            {clientSearchList.map(d => (
                                                <Select.Option key={d.value}>{d.text}</Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col><Button icon="close" onClick={this.onRemoveClient}/></Col>
                                </Row>
                            </Collapse.Panel>
                        </Collapse>
                    </Form>
                </Col>

                <Col
                    xxl={{ span: 18 }}
                    xl={{ span: 16 }}
                    lg={{ span: 14 }}
                    md={{ span: 12 }}
                    xs={{ span: 24 }}
                >
                    <h2>Results for: {keyword}</h2>
                    <Spin spinning={this.state.loading}>
                        {users.length === 0 && clients.length === 0 && (
                            <EmptyResult keyword={keyword}/>
                        )}
                        {users.length > 0 && (
                            <UserResult
                                data={users}
                                pagination={
                                    <Pagination
                                        defaultCurrent={this.state.searchFilters.userPageNum}
                                        current={this.state.searchFilters.userPageNum}
                                        total={this.state.userTotal}
                                        pageSize={this.state.searchFilters.userPageSize}
                                        onChange={this.onUserPageChange}
                                    />
                                }
                            />
                        )}
                        {clients.length > 0 && (
                            <ClientResult
                                data={clients}
                                pagination={
                                    <Pagination
                                        defaultCurrent={this.state.searchFilters.clientPageNum}
                                        current={this.state.searchFilters.clientPageNum}
                                        total={this.state.clientTotal}
                                        pageSize={this.state.searchFilters.clientPageSize}
                                        onChange={this.onClientPageChange}
                                    />
                                }
                            />
                        )}
                    </Spin>
                </Col>
            </Row>
        );
    }
}

export default SearchPage;