import { Typography, Row, Col, Spin, Button, Input, Icon, Tag, Tooltip } from 'antd';
import Pagination from '../../components/Pagination';
import MemberList from '../../components/PageComponents/members/list';
import { searchUsers } from '../../redux/ducks/user';
import './style.scss';

class MembersPage extends React.Component {
    state = {
        keyword: '',
        pageNum: 1,
        pageSize: 20,
        users: [],
        totalCount: 0,
        sortBy: 'mpRating',
        ascDesc: 'asc',
        inputTagValue: '',
        tags: [], //['Tag1', 'LongerTag2', 'EventLongerTag2'],
        loading: false
    };

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    componentDidMount() {
        this.searchUsers();
    }

    searchUsers = () => {
        const { keyword, pageNum, pageSize, sortBy, ascDesc, tags } = this.state;
        this.setState({ loading: true }, () => {
            searchUsers({ keyword, pageNum, pageSize, sortBy, ascDesc, tags }, res => {
                var state = this.state;
                state.loading = false;
                if (res.success) {
                    state.users = res.data;
                    state.totalCount = res.totalCount;
                }
                this.setState(state);
            });
        });
    };

    onSearch = val => {
        this.setState({ keyword: val }, this.searchUsers);
    };

    sortByReputation = () => {
        const { ascDesc } = this.state;
        this.setState({ ascDesc: ascDesc === 'asc' ? 'desc' : 'asc' }, this.searchUsers);
    };

    onPageChange = pageNum => {
        this.setState({ pageNum }, this.searchUsers);
    };

    onInputTagChange = e => {
        this.setState({ inputTagValue: e.target.value });
    };

    onAddTag = e => {
        let { tags, inputTagValue } = this.state;
        if (inputTagValue && tags.indexOf(inputTagValue) === -1) {
            tags = [...tags, inputTagValue];
        }
        this.setState({ tags, inputTagValue: '' }, this.searchUsers);
    };

    onRemoveTag = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags }, this.searchUsers);
    }

    render() {
        const { pageNum, pageSize, users, totalCount, loading, ascDesc, inputTagValue, tags } = this.state;
        
        return (
            <div className="members">
                <Row className="header" type="flex" gutter={20} justify="space-between">
                    <Col xl={{ span: 12 }} md={{ span: 24 }} style={{ minWidth: 580 }}>
                        <Row type="flex" gutter={20}>
                            <Col xl={{ span: 12 }} style={{ marginTop: 10 }}>
                                <Row type="flex" gutter={20}>
                                    <Col style={{ width: 110 }}>
                                        <Typography.Title level={4} style={{ marginBottom: 0 }}>MEMBERS</Typography.Title>
                                        <Typography.Text type="secondary">GLOBAL LIST</Typography.Text>
                                    </Col>
                                    <Col style={{ flex: 1 }}><Input.Search onSearch={this.onSearch} /></Col>
                                </Row>
                            </Col>
                            <Col xl={{ span: 12 }} style={{ marginTop: 10, paddingTop: 5, paddingBottom: 5, minWidth: 290 }}>
                                <Pagination size="small" showLessItems={true} current={pageNum} pageSize={pageSize} total={totalCount} onChange={this.onPageChange} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={{ span: 12 }} md={{ span: 24 }} style={{ width: 500 }}>
                        <Row type="flex" gutter={10} align="middle">
                            <Col style={{ marginTop: 10 }}>
                                <Input
                                    placeholder="Add Tag"
                                    style={{ textAlign: 'center', width: 100 }}
                                    value={inputTagValue}
                                    onChange={this.onInputTagChange}
                                    onPressEnter={this.onAddTag}
                                />
                            </Col>
                            <Col style={{ marginTop: 10 }}>3500</Col>
                            <Col style={{ marginTop: 10 }}>|</Col>
                            <Col style={{ marginTop: 10 }}>Filter</Col>
                            <Col style={{ marginTop: 10 }}><Button icon="filter" shape="round" onClick={this.sortByReputation}>Reputation<Icon type={ascDesc === "asc" ? "down" : "up"} /></Button></Col>
                            <Col style={{ marginTop: 10 }}><Button icon="setting" shape="round" onClick={this.sortByReputation}>Search Tools</Button></Col>
                        </Row>
                    </Col>
                </Row>
                <Row type="flex" justify="end">
                    {tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;
                        const tagElem = (
                            <Tag key={tag} closable={true} onClose={() => this.onRemoveTag(tag)}>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </Tag>
                        );
                        return (
                            <Col style={{ marginTop: 10 }} key={tag}>
                                {isLongTag ? (
                                    <Tooltip title={tag}>
                                        {tagElem}
                                    </Tooltip>
                                ) : (
                                    tagElem
                                )}
                            </Col>
                        );
                    })}
                </Row>
                <div style={{ marginTop: 20 }}>
                    <Spin spinning={loading}>
                        <MemberList data={users} />
                    </Spin>
                </div>
            </div>
        );
    }
}

export default MembersPage;