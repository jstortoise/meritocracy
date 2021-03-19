import { connect } from 'react-redux';
import { Row, Col, Input, Icon, Spin } from 'antd';
import Pagination from '../../components/Pagination';
import { dateFormat } from '../../redux/ducks/app';
import { getAllTransactions, getMyTransactions, REDUCER } from '../../redux/ducks/transaction';
import './style.scss';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER]
});

@connect(mapStateToProps)
class BlockchainPage extends React.Component {
    state = {
        transactions: [],
        totalCount: 0,
        keyword: '',
        pageNum: 1,
        pageSize: 10,
        loading: false,
    };
    
    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    componentDidMount() {
        this.searchTransactions();
    }

    onSearch = keyword => {
        this.setState({ keyword, pageNum: 1 }, this.searchTransactions);
    };

    searchTransactions = () => {
        const { keyword, pageNum, pageSize } = this.state;
        var self = this;
        var state = this.state;
        
        self.setState({ loading: true }, () => {
            getAllTransactions({ keyword, pageNum, pageSize }, res => {
                state.loading = false;
                if (res.success) {
                    state.transactions = res.data.transactions;
                    state.totalCount = res.data.totalCount;
                }
                self.setState(state);
            });
        });
    };
    
    onPageChange = pageNum => {
        this.setState({ pageNum }, this.searchTransactions);
    };

    render() {
        const { transactions, totalCount, pageNum, pageSize, loading } = this.state;

        const getCoinType = coinType => {
            if (coinType == 1) {
                return 'ETH';
            } else if (coinType == 2) {
                return 'BTC';
            } else if (coinType == 3) {
                return 'BCH';
            }
            return 'GLX';
        };
        
        return (
            <div className="transactions">
                <Row type="flex" align="middle" gutter={20}>
                    <Col style={{ marginTop: 10 }}>
                        <Input.Search onSearch={this.onSearch} style={{ width: 250, marginRight: 30 }} />
                    </Col>
                    <Col style={{ marginTop: 10 }}>
                        <Pagination size="small" showLessItems={true} current={pageNum} pageSize={pageSize} total={totalCount} onChange={this.onPageChange} />
                    </Col>
                </Row>

                {/* Show transaction list */}
                <Row type="flex" align="bottom" style={{ marginTop: 20 }} gutter={10} className="list">
                    <Col xl={{ span: 1 }} span={2} className="text-center">Coin</Col>
                    <Col xl={{ span: 4 }} span={6}>From</Col>
                    <Col xl={{ span: 4 }} span={6}>To</Col>
                    <Col xl={{ span: 2 }} span={3}>Tx type</Col>
                    <Col xl={{ span: 2 }} span={3} className="text-right">Amount</Col>
                    <Col xl={{ span: 3 }} span={4}>
                        Time <Icon type="exclamation-circle" theme="filled" />
                        <br/>
                        (UTC + 00:00)
                    </Col>
                </Row>

                <Spin spinning={loading}>
                    {transactions.map((data, index) => (
                        <Row type="flex" align="bottom" style={{ marginTop: 10 }} key={index} gutter={10} className="list">
                            <Col xl={{ span: 1 }} span={2} className="text-center">
                                {getCoinType(data.coinType)}
                            </Col>
                            <Col xl={{ span: 4 }} span={6}>
                                {data.from}
                            </Col>
                            <Col xl={{ span: 4 }} span={6}>
                                {data.to}
                            </Col>
                            <Col xl={{ span: 2 }} span={3}>
                                {data.description}
                            </Col>
                            <Col xl={{ span: 2 }} span={3} className="text-right">
                                {data.value}
                            </Col>
                            <Col xl={{ span: 3 }} span={4}>
                                {dateFormat(new Date(data.createdAt))}
                            </Col>
                        </Row>
                    ))}
                </Spin>
            </div>
        );
    }
}

export default BlockchainPage;