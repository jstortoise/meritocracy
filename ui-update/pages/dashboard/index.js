import './style.scss';

class Dashboard extends React.Component {
    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    render() {
        return (
            <div className="dashboard-page">
                {/* <Row gutter={8} type="flex">
                    <Col span={7}>
                        <Row>
                            <Col>
                                <Card className="avatar-card">
                                    <Row type="flex" justify="center">
                                        <Avatar size={120}/>
                                    </Row>
                                    <Row type="flex" justify="center">
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="my-organisations-card">
                                    <h3>MY ORGANISATIONS</h3>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={17}>
                        <Row gutter={8}>
                            <Col span={6}>
                                <Card className="verified-accounts-card">
                                    <h3>VERIFIED ADMIN ACCOUNTS</h3>
                                </Card>
                            </Col>
                            <Col span={15}>
                                <Card className="revenue-card">
                                    <h3>REVENUE & TRAFFIC</h3>
                                </Card>
                            </Col>
                            <Col span={3}>
                                <Card className="blank-card"></Card>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Card className="admin-accounts-card">
                                    <h3>ADMIN ACCOUNTS</h3>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col>
                                        <Card className="monthly-card">
                                            <h3>MONTHLY ACTIVITY</h3>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card className="all-organisations-card">
                                            <h3>ALL ORGANISATIONS</h3>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row> */}
                Dashboard
            </div>
        );
    }
}

export default Dashboard;
