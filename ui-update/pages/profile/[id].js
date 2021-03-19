import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Row, Col, Form, Avatar, Divider, Button, Icon, Input, Typography } from 'antd';
import Hexagon from '../../components/Hexagon';
import { REDUCER, getUserDetailById } from '../../redux/ducks/user';
import { getBadgeList } from '../../redux/ducks/badge';
import './style.scss';

const { Text } = Typography;

const ProfilePageWithRouter = props => {
    const router = useRouter();
    return (<ProfilePage {...props} router={router}/>);
};

ProfilePageWithRouter.getInitialProps = async () => {
    return { roles: [0, 1, 2, 3] };
};

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER],
    user: state.app.user
});

@Form.create()
@connect(mapStateToProps)
class ProfilePage extends React.Component {
    state = {
        user: {
            id: '',
            username: '',
            emails: [],
            primaryEmail: '',
            secondEmails: [],
            socialEmails: [],
            firstName: '',
            lastName: '',
            mid: '',
            privateKey: '',
            publicKey: '',
            emailIndex: 0,
        },
        badgeLoading: false,
        badges: [],
    };

    componentDidMount() {
        const { router } = this.props;
        const { id } = router.query;
        this.onGetUserDetail(id);
        this.onGetBadgeList();
    }

    onGetBadgeList = () => {
        var self = this;
        this.setState({ badgeLoading: true }, () => {
            getBadgeList(res => {
                var state = self.state;
                state.badgeLoading = false;
                if (res.success) {
                    state.badges = res.data;
                }
                self.setState(state);
            });
        });
    };

    onGetUserDetail = userId => {
        var state = this.state;
        getUserDetailById(userId, result => {
            if (result.success) {
                let user = result.data;
                user.secondEmails = [];
                user.emailIndex = 0;
                user.emails.forEach(obj => {
                    obj.socialEmails = [];
                    const socialEmail = user.socialEmails.find(se => se.email === obj.email);
                    if (socialEmail) {
                        obj.socialEmails.push(socialEmail);
                    }
                    if (obj.isPrimary) {
                        user.primaryEmail = obj;
                    } else {
                        user.secondEmails.push(obj);
                        if (obj.id > user.emailIndex) {
                            user.emailIndex = obj.id
                        }
                    }
                });
                state.user = user;
                this.setState(state);
            } else {
                // Router.push('/error');
            }
        });
    };

    render() {
        const { form, isSubmitForm } = this.props;
        const { user } = this.state;
        const { primaryEmail, secondEmails, socialEmails } = this.state.user;

        const google = socialEmails.find(obj => obj.socialType === 1);
        const facebook = socialEmails.find(obj => obj.socialType === 2);
        const twitter = socialEmails.find(obj => obj.socialType === 3);
        const instagram = socialEmails.find(obj => obj.socialType === 4);

        const additionalEmailFields = () => {
            let fields = [], index = 0;
            // get secondary email fields
            secondEmails.forEach(obj => {
                fields.push(
                    <Row gutter={20} type="flex" key={obj.id}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}></Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator(`secondEmails[${obj.id}]`, {
                                            initialValue: `${obj.email}`,
                                        })(<Input disabled/>)}
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                );
                index++;
            });
            if (secondEmails.length === 0) {
                fields.push(
                    <Row gutter={20} type="flex" key="blank">
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}></Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input disabled/>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                );
            }
            return fields;
        }

        const { badges } = this.state;
        const showBadgeList = () => {
            var list = [];
            badges.forEach(obj => {
                list.push(
                    <Row type="flex" align="middle" key={obj.id}>
                        <Form.Item>
                            <div className="show-medal">
                                <Text>{obj.description}</Text>
                            </div>
                        </Form.Item>
                    </Row>
                );
            });
            return list;
        };

        return (
            <div className="profile-edit-page">
                <Row>
                    <h2>Profile</h2>
                </Row>
                <Form hideRequiredMark>
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row>
                                <h3>Public Avatar</h3>
                                <p>You can change your avatar here or remove the current avatar to revert to avatar.com</p>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Row gutter={20}>
                                <Col md={{ span: 24 }} lg={{ span: 8 }}>
                                    <Avatar size={120} icon="user" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row>
                                <h3>Meritocracy Details</h3>
                                <Text>This information will appear on your profile</Text>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row type="flex" justify="start" align="middle" gutter={20}>
                                    <Col>Master Rating</Col>
                                    <Col><Hexagon text="65"/></Col>
                                </Row>
                            </Form.Item>
                            <Row>Primary MID Public Key</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('mid', {
                                            initialValue: `${user && user.mid}`
                                        })(<Input size="default" disabled />)}
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>GnuPG 1</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input disabled/>
                                    </Col>
                                    <Col span={8}>
                                        <Row type="flex" align="middle" gutter={8} style={{ fontSize: 12 }}>
                                            <Col style={{ lineHeight: 'initial' }}>
                                                <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '20px' }} />
                                            </Col>
                                            <Col>Unverified</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row>
                                <h3>Profile Details</h3>
                                <Text>This information will appear on your profile</Text>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Row>First Name</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('firstName', {
                                            initialValue: `${user && user.firstName}`,
                                            rules: [{ required: true, message: 'Please input your first name' }],
                                        })(<Input size="default" readOnly />)}
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Last Name</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('lastName', {
                                            initialValue: `${user && user.lastName}`,
                                            rules: [{ required: true, message: 'Please input your last name' }],
                                        })(<Input size="default" readOnly />)}
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>User Name</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('username', {
                                            initialValue: `${user && user.username}`,
                                            rules: [{ required: true, message: 'Please input your username' }],
                                        })(<Input size="default" disabled />)}
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Primary Email</Row>
                        </Col>
                    </Row>
                    <Row gutter={20} type="flex">
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}></Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('primaryEmail', {
                                            initialValue: `${user && primaryEmail.email}`
                                        })(<Input disabled />)}
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}></Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Row>Additional Email</Row>
                        </Col>
                    </Row>
                    {additionalEmailFields()}
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}></Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Row>Address 1</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="678 Maple Lane Rd" readOnly/>
                                    </Col>
                                    <Col span={8}>
                                        <div className="show-medal">
                                            <Text>+10 Merit Points</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Address 2</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="APT 3" readOnly/>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Zipcode</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="12345" readOnly/>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>City</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="Hyrule" readOnly/>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Country</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="Holodrum" readOnly/>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Phone</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input.Group>
                                            <Row gutter={8}>
                                                <Col span={6}>
                                                    <Input style={{ textAlign: 'right' }} defaultValue="+1" readOnly/>
                                                </Col>
                                                <Col span={18}>
                                                    <Input defaultValue="(801)-867-7183" readOnly/>
                                                </Col>
                                            </Row>
                                        </Input.Group>
                                    </Col>
                                    <Col span={8}>
                                        <div className="show-medal">
                                            <Text>+10 Merit Points</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row>
                                <h3>Social Network Settings</h3>
                                <Text>Add or Remove Social Networks</Text>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={20} type="flex">
                                    <Col>
                                        <Button className="btn-social btn-google">
                                            Google
                                        </Button>
                                    </Col>
                                    <Col>
                                        {google ? (
                                            <Button shape="round" type="danger">Remove</Button>
                                        ) : (
                                            <Button shape="round">Add</Button>
                                        )}
                                    </Col>
                                    {!google && (
                                        <Col>
                                            <div className="show-medal">
                                                <Text>+10 Merit Points</Text>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Row gutter={20} type="flex">
                                    <Col>
                                        <Button className="btn-social btn-facebook">
                                            Facebook
                                        </Button>
                                    </Col>
                                    <Col>
                                        { facebook ? (
                                            <Button shape="round" type="danger">Remove</Button>
                                        ) : (
                                            <Button shape="round">Add</Button>
                                        )}
                                    </Col>
                                    {!facebook && (
                                        <Col>
                                            <div className="show-medal">
                                                <Text>+10 Merit Points</Text>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Row gutter={20} type="flex" align="middle">
                                    <Col>
                                        <Button className="btn-social btn-twitter">
                                            Twitter
                                        </Button>
                                    </Col>
                                    <Col>
                                        {twitter ? (
                                            <Button shape="round" type="danger">Remove</Button>
                                        ) : (
                                            <Button shape="round">Add</Button>
                                        )}
                                    </Col>
                                    {!twitter && (
                                        <Col>
                                            <div className="show-medal">
                                                <Text>+10 Merit Points</Text>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                            <Form.Item>
                                <Row gutter={20} type="flex" align="middle">
                                    <Col>
                                        <Button className="btn-social btn-instagram">
                                            Instagram
                                        </Button>
                                    </Col>
                                    <Col>
                                        {instagram ? (
                                            <Button shape="round" type="danger">Remove</Button>
                                        ) : (
                                            <Button shape="round">Add</Button>
                                        )}
                                    </Col>
                                    {!instagram && (
                                        <Col>
                                            <div className="show-medal">
                                                <Text>+10 Merit Points</Text>
                                            </div>
                                        </Col>
                                    )}
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row>
                                <h3>Badge List</h3>
                                <Text>Badge list you earned</Text>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Spin spinning={this.state.badgeLoading}>
                                {showBadgeList()}
                            </Spin>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default ProfilePageWithRouter;