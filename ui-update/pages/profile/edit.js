import { Container } from 'next/app';
import { connect } from 'react-redux';
import { Row, Col, Form, Avatar, Divider, Spin, Button, Upload, Icon, Input, Checkbox, Typography, message, Tooltip, notification, Modal } from 'antd';
import * as openpgp from 'openpgp';
import copy from 'copy-text-to-clipboard';
import io from 'socket.io-client';

import Hexagon from '../../components/Hexagon';
import { REDUCER, updateProfile, sendVerifyEmail } from '../../redux/ducks/auth';
import { getMe } from '../../redux/ducks/user';
import { getFacebookInfo } from '../../redux/ducks/social';
import { getBadgeList } from '../../redux/ducks/badge';
import { createWallet, withdrawCoin } from '../../redux/ducks/wallet';
import { API_URL } from '../../redux/api/common';
import './style.scss';

// const socket = io('https://api.keycloak.dev.galaxias.io');
// const socket = io('http://localhost:4000');

Number.prototype.countDecimals = function () {
    try {
        if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
        return this.toString().split(".")[1].length || 0;
    } catch(e) {
        return 0;
    }
}

const getCoinName = (coinType, isUpper = false) => {
    let name = 'glx';
    if (coinType == 1) {
        name = 'eth';
    } else if (coinType == 2) {
        name = 'btc';
    } else if (coinType == 3) {
        name = 'bch';
    }

    if (isUpper) return name.toUpperCase();

    return name;
};

const { Text } = Typography;
const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER],
    user: state.app.user
});

const subtractDecimals = (first, second) => {
    let len = parseFloat(first).countDecimals();
    if (parseFloat(second).countDecimals() > len) {
        len = parseFloat(second).countDecimals();
    }

    return (first - second).toFixed(len);
};

@Form.create()
@connect(mapStateToProps)
class ProfileEdit extends React.Component {
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
            glxAddress: '', glxBalance: 0, glxLoading: false, glxFee: 0,
            ethAddress: '', ethBalance: 0, ethLoading: false, ethFee: 0,
            btcAddress: '', btcBalance: 0, btcLoading: false, btcFee: 0,
            bchAddress: '', bchBalance: 0, bchLoading: false, bchFee: 0,
        },
        googleLoading: false,
        facebookLoading: false,
        twitterLoading: false,
        instagramLoading: false,
        avatarLoading: false,
        avatarURL: null,
        avatarFilename: 'No file chosen',
        publicKey1: '',
        mid1: '',
        isPrimaryEmailEnabled: false,
        badgeLoading: false,
        badges: [],
        withdrawModal: {
            title: 'Withdraw',
            coinType: 1,
            coinName: 'ETH',
            address: '',
            amount: 0,
            fee: 0,
            loading: false,
            isVisible: false
        },
        glx: {
            isDeposit: false,
            countDown: 0,
            countDownLabel: '00:00'
        },
        eth: {
            isDeposit: false,
            countDown: 0,
            countDownLabel: '00:00'
        },
        btc: {
            isDeposit: false,
            countDown: 0,
            countDownLabel: '00:00'
        },
        bch: {
            isDeposit: false,
            countDown: 0,
            countDownLabel: '00:00'
        },
        countDown: '00:00',
    };

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    constructor(props) {
        super(props);
        this.coinAddress = React.createRef();
        this.coinAmount = React.createRef();

        // Listen socket
        // socket.on('deposit', this.handleDepositResult);        
    }

    handleDepositResult = ret => {
        try {
            const { coinType, address, balance, amount, msg } = ret;
            const coinName = getCoinName(coinType);
            var state = this.state;
            state[coinName].isDeposit = false;
            state.user[`${coinName}Balance`] = balance;
            this.setState(state, () => message.success(msg));
        } catch(e) {
            console.log(e);
        }
    };

    componentDidMount() {
        this.onGetUserDetail();
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

    onGetUserDetail = () => {
        getMe().then(({ success, data: user }) => {
            if (success && user) {
                var state = this.state;
                state.user = user;
                state.user.secondEmails = [];
                state.user.emailIndex = 0;
                state.user.emails.forEach(obj => {
                    obj.socialEmails = [];
                    const socialEmail = user.socialEmails.find(se => se.email === obj.email);
                    if (socialEmail) {
                        obj.socialEmails.push(socialEmail);
                    }
                    if (obj.isPrimary) {
                        state.user.primaryEmail = obj;
                    } else {
                        state.user.secondEmails.push(obj);
                        if (obj.id > state.user.emailIndex) {
                            state.user.emailIndex = obj.id
                        }
                    }
                });
                this.setState(state);
            }
        });
    };

    onBeforeUpload = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 < 200;
        if (!isLt2M) {
            message.error('Image must smaller than 200KB!');
        }
        return isJpgOrPng && isLt2M;
    };

    onUploadAvatar = info => {
        if (info.file.status === 'uploading') {
            this.setState({
                avatarLoading: true,
                avatarFilename: 'Loading...'
            });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => {
                this.setState({
                    avatarURL: imageUrl,
                    avatarLoading: false,
                    avatarFilename: info.file.name
                });
            });
        } else {
            this.setState({
                avatarLoading: false,
                avatarFilename: 'No file chosen'
            });
        }
    };

    onRemoveAvatar = () => {
        this.setState({
            avatarURL: null,
            avatarLoading: false,
            avatarFilename: 'No file chosen'
        });
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };
    
    onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch } = this.props;
        const { user } = this.state;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    let emailList = [];
                    user.secondEmails.forEach(obj => {
                        emailList.push({ ...obj, email: values['secondEmails'][obj.id] });
                        // obj.email = values['secondEmails'][obj.id];
                    });
                    // values['secondEmails'] = user.secondEmails;
                    values['secondEmails'] = emailList;
                    values['secondEmails'].push(user.primaryEmail);
					dispatch(updateProfile(values));
				}
			});
		}
    };

    onPublicKeyChange = event => {
        this.setState({
            publicKey1: event.target.value
        });
    }

	onAddGnuPGKey = () => {
		openpgp.key.readArmored(this.state.publicKey1).then(res => {
			let mid = '';
			if (res.keys.length > 0) {
				mid = res.keys[0].primaryKey.getKeyId().toHex();
			}
			this.setState({ mid1: mid });
		});
    };
    
    onChangePrimaryEmail = () => {
        this.setState({
            isPrimaryEmailEnabled: true
        });
    };

    onAddEmail = () => {
        const { form } = this.props;
        var state = this.state;
        var { user } = state;
        user.emailIndex++;
        if (state.user.secondEmails.length === 0) {
            state.user.secondEmails.push({
                id: state.user.emailIndex,
                email: '',
                socialEmails: []
            });
        } else {
            user.secondEmails.push({
                id: user.emailIndex,
                email: '',
                socialEmails: []
            });
        }
        state.user = user;
        this.setState(state);
    };

    onRemoveEmail = id => {
        var state = this.state;
        var { user } = state;
        const index = user.secondEmails.findIndex(obj => obj.id === id);
        if (index >= 0) {
            const email = user.secondEmails[index].email;
            const index1 = user.socialEmails.findIndex(obj => obj.email === email);
            if (index1 >= 0) {
                user.socialEmails.splice(index1, 1);
            }
            user.secondEmails.splice(index, 1);
            state.user = user;
            this.setState(state);
        }
    }

    /**
     * type
     * 0: normal
     * 1: google
     * 2: facebook
     * 3: twitter
     * 4: instagram
     */
    onAddSocial = type => {
        var state = this.state;
        if (type === 2) {
            this.setState({ facebookLoading: true });
            this.showFbLogin(token => {
                getFacebookInfo(token, res => {
                    if (res.success) {
                        // data: { email, facebookId }
                        const index = state.user.secondEmails.findIndex(obj => obj.email == res.data.email);
                        if (index >= 0) {
                            state.user.secondEmails[index].socialEmails.push({
                                socialType: type,
                                socialId: res.data.facebookId
                            });
                        } else if (state.user.primaryEmail.email === res.data.email) {
                            state.user.primaryEmail.status = 1;
                            state.user.primaryEmail.socialEmails.push({
                                socialType: type,
                                socialId: res.data.facebookId
                            });
                        } else {
                            state.user.emailIndex++;
                            state.user.secondEmails.push({
                                id: state.user.emailIndex,
                                email: res.data.email,
                                socialEmails: [{
                                    socialType: type,
                                    socialId: res.data.facebookId
                                }]
                            });
                        }
                        state.user.socialEmails.push({
                            socialType: type,
                            socialId: res.data.facebookId
                        });
                    }
                    this.setState({ facebookLoading: false });
                });
            });
        }
    };

    onRemoveSocial = type => {
        var state = this.state;
        if (type === 1) {
            ;
        } else if (type === 2) {
            // remove facebook
            const index1 = state.user.primaryEmail.socialEmails.findIndex(obj => obj.socialType === 2);
            if (index1 >= 0) {
                state.user.primaryEmail.socialEmails.splice(index1, 1);
                state.user.socialEmails
            }
            const index2 = state.user.socialEmails.findIndex(obj => obj.socialType === 2);
            if (index2 >= 0) {
                state.user.socialEmails.splice(index2, 1);
            }
            state.user.secondEmails.forEach(obj => {
                const index3 = obj.socialEmails.findIndex(obj1 => obj1.email === obj.email && obj1.socialType === 2);
                if (index3 >= 0) {
                    obj.splice(index3, 1);
                }
            });
        } else if (type === 3) {
            ;
        } else if (type === 4) {
            ;
        }
        this.setState(state);
    };

    showFbLogin = callback => {
        var win = window.open(API_URL + '/social/facebook/login/null');
        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventer = window[eventMethod];
        var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
        // Listen to message from child window
    
        var fbToken = null;
        eventer(
            messageEvent,
            e => {
                fbToken = e.data;
            },
            false,
        );
    
        // check if child window is closed
        var timer = setInterval(() => {
            if (win.closed) {
                callback(fbToken);
                clearInterval(timer);
            }
        }, 500);
    };

    compareToOtherEmail = (rule, value, callback) => {
        const { form } = this.props;
        const { secondEmails } = this.state.user;

        if (value) {
            let sameCount = 0;
            for (let i = 0; i < secondEmails.length; i++) {
                var index = secondEmails[i].id;
                if (value === form.getFieldValue(`secondEmails[${index}]`)) {
                    sameCount++;
                }
            }
            if (sameCount > 1 || value === form.getFieldValue('primaryEmail')) {
                callback('Same email already exists!');
            }
        }
        callback();
    };

    onResendVerifyEmail = email => {
        sendVerifyEmail(email, res => {
            if (res.success) {
                notification.open({ type: 'success', message: 'Successfully resent email verification.' });
            } else {
                notification.open({ type: 'error', message: 'Failed to resend email verification.' });
            }
        });
    };

    copyText = text => {
        copy(text);
        message.success(`"${text}" copied to clipboard`);
    };

    generateWalletAddress = coinType => {
        var self = this;
        var state = this.state;
        if (coinType === 1) {
            // ETH
            state.user.ethLoading = true;
        } else if (coinType === 2) {
            // BTC
            state.user.btcLoading = true;
        } else if (coinType === 3) {
            // BCH
            state.user.bchLoading = true;
        } else {
            // GLX
            state.user.glxLoading = true;
        }
        self.setState(state, () => {
            createWallet(coinType, res => {
                if (res.success) {
                    if (coinType === 1) {
                        // ETH
                        state.user.ethAddress = res.data.address;
                    } else if (coinType === 2) {
                        // BTC
                        state.user.btcAddress = res.data.address;
                    } else if (coinType === 3) {
                        // ETH
                        state.user.bchAddress = res.data.address;
                    } else {
                        // GLX
                        state.user.glxAddress = res.data.address;
                    }
                    message.success(`${getCoinName(coinType, true)} address generated successfully!`);
                } else if (res.message) {
                    message.error(res.message);
                }
                if (coinType === 1) {
                    // ETH
                    state.user.ethLoading = false;
                } else if (coinType === 2) {
                    // BTC
                    state.user.btcLoading = false;
                } else if (coinType === 3) {
                    // ETH
                    state.user.bchLoading = false;
                } else {
                    // GLX
                    state.user.glxLoading = false;
                }
                self.setState(state);
            });
        });
    };

    startCountDown = (coinType, min, sec = 0) => {
        const setTime = () => {
            if (sec > 0) {
                sec--;
            } else {
                sec = 59;
                if (min > 0) {
                    min--;
                } else {
                    clearInterval(intervalId);
                }
            }
            const formatMin = `0${min}`.slice(-2);
            const formatSec = `0${sec}`.slice(-2);
            const countDownLabel = `${formatMin}:${formatSec}`;
            const countDown = min * 60 + sec;

            // Set state
            const coinName = getCoinName(coinType);
            var state = this.state;

            if (!state[coinName].isDeposit) {
                clearInterval(intervalId);
            }

            state[coinName].countDown = countDown;
            state[coinName].countDownLabel = countDownLabel;
            this.setState(state);
        };
        const intervalId = setInterval(setTime, 1000);
    };
    
    onDeposit = (coinType, address) => {
        const period = 15; // minute
        this.startCountDown(coinType, period);

        // Set state
        var state = this.state;
        const coinName = getCoinName(coinType);

        state[coinName].isDeposit = true;

        this.setState(state);
        
        // Emit event
        socket.emit('deposit', coinType, address, period);
    };

    onWithdraw = coinType => {
        var { withdrawModal } = this.state;
        const { glxFee, ethFee, btcFee, bchFee } = this.state.user;

        withdrawModal.coinType = coinType;
        withdrawModal.coinName = getCoinName(coinType, true);
        if (coinType == 1) {
            withdrawModal.fee = ethFee;
        } else if (coinType == 2) {
            withdrawModal.fee = btcFee;
        } else if (coinType == 3) {
            withdrawModal.fee = bchFee;
        } else {
            withdrawModal.fee = glxFee;
        }
        withdrawModal.title = `Withdraw ${withdrawModal.coinName}`;
        withdrawModal.amount = withdrawModal.fee;
        withdrawModal.address = '';
        withdrawModal.isVisible = true;
        withdrawModal.loading = false;
        if (this.coinAddress.current) {
            this.coinAddress.current.state.value = '';
        }
        if (this.coinAmount.current) {
            this.coinAmount.current.state.value = withdrawModal.amount;
        }
        this.setState({ withdrawModal });
    };

    setWithDrawAddress = e => {
        var { withdrawModal } = this.state;
        withdrawModal.address = e.target.value;
        this.setState({ withdrawModal });
    };

    setWithDrawAmount = e => {
        var { withdrawModal } = this.state;
        withdrawModal.amount = e.target.value;
        this.setState({ withdrawModal });
    };

    doWithdraw = () => {
        var self = this;
        var state = self.state;
        const { coinType, coinName, address, amount, fee } = state.withdrawModal;

        if (isNaN(fee) || fee >= amount) {
            message.error(`Amount must be bigger than ${coinName} fee (${fee})`);
            return;
        }

        state.withdrawModal.loading = true;

        self.setState(state, () => {
            withdrawCoin(coinType, address, amount, res => {
                if (res.success) {
                    state.withdrawModal.isVisible = false;
                    if (coinType == 1) {
                        state.user.ethBalance = res.data.balance;
                    } else if (coinType == 2) {
                        state.user.btcBalance = res.data.balance;
                    } else if (coinType == 3) {
                        state.user.bchBalance = res.data.balance;
                    } else {
                        state.user.glxBalance = res.data.balance;
                    }
                    notification.open({ type: 'success', message: res.message });
                } else {
                    notification.open({ type: 'error', message: res.message || 'Failed to withdraw' });
                }
                state.withdrawModal.loading = false;
                self.setState(state);
            });
        });
    };

    cancelWithdraw = () => {
        var { withdrawModal } = this.state;
        withdrawModal.isVisible = false;
        withdrawModal.loading = false;
        this.setState({ withdrawModal });
    };

    render() {
        const { form, isSubmitForm } = this.props;
        const { user, withdrawModal, glx, eth, btc, bch } = this.state;
        const {
            primaryEmail,
            secondEmails,
            socialEmails,
            glxAddress, glxBalance, glxLoading,
            ethAddress, ethBalance, ethLoading, ethFee,
            btcAddress, btcBalance, btcLoading,
            bchAddress, bchBalance, bchLoading,
        } = this.state.user;

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
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }} className="text-right-md">
                            {index === 0 && (
                                <Form.Item>
                                    <Button shape="round" type="default" onClick={this.onAddEmail}>Add an Email/Account</Button>
                                </Form.Item>
                            )}
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator(`secondEmails[${obj.id}]`, {
                                            initialValue: `${obj.email}`,
                                            rules: [{
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            }, {
                                                validator: this.compareToOtherEmail
                                            }, {
                                                required: true,
                                                message: 'Input email'
                                            }]
                                        })(obj.socialEmails.length > 0 ? <Input disabled/> : <Input />)}
                                    </Col>
                                    <Col span={8}>
                                        {obj.status === 0 ? (
                                            <Row type="flex" align="middle" gutter={8} style={{ fontSize: 14 }}>
                                                <Col>
                                                    <Button shape="round" className="btn-pink" onClick={() => this.onRemoveEmail(obj.id)}>Remove</Button>
                                                </Col>
                                                <Col style={{ lineHeight: 'initial' }}>
                                                    <Tooltip placement="bottom" title="Unverified">
                                                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '20px' }} />
                                                    </Tooltip>
                                                </Col>
                                                <Col><a onClick={() => this.onResendVerifyEmail(obj.email)}>Resend Verification</a></Col>
                                            </Row>
                                        ) : (
                                            obj.status === 2 ? (
                                                <Row type="flex" align="middle" gutter={8} style={{ fontSize: 14 }}>
                                                    <Col>
                                                        <Button shape="round" className="btn-pink" onClick={() => this.onRemoveEmail(obj.id)}>Remove</Button>
                                                    </Col>
                                                    <Col style={{ lineHeight: 'initial' }}>
                                                        <Tooltip placement="bottom" title="Suspended">
                                                            <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '20px' }} />
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Row type="flex" align="middle" gutter={8} style={{ fontSize: 14 }}>
                                                    <Col>
                                                        <Button shape="round" className="btn-pink" onClick={() => this.onRemoveEmail(obj.id)}>Remove</Button>
                                                    </Col>
                                                </Row>
                                            )
                                        )}
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
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }} className="text-right-md">
                            {index === 0 && (
                                <Form.Item>
                                    <Button shape="round" type="default" onClick={this.onAddEmail}>Add an Email/Account</Button>
                                </Form.Item>
                            )}
                        </Col>
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
        };

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
                <Form hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
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
                                    <Avatar src={this.state.avatarURL} size={120} icon={this.state.avatarLoading ? "loading" : "user"} />
                                </Col>
                                <Col md={{ span: 24 }} lg={{ span: 16 }}>
                                    <Row><h4>Upload new avatar</h4></Row>
                                    <Form.Item>
                                        <Row>
                                            <Upload
                                                showUploadList={false}
                                                onChange={this.onUploadAvatar}
                                                beforeUpload={this.onBeforeUpload}
                                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                            >
                                                <Button shape="round" style={{ width: '120px'}}>
                                                    Choose File...
                                                </Button>
                                                <span style={{ marginLeft: '10px' }}>{this.state.avatarFilename}</span>
                                            </Upload>
                                        </Row>
                                        <Row>
                                            <Text type="secondary">The maximum file size allowed is 200KB</Text>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item>
                                        <Row>
                                            <Button className="btn-pink" shape="round" style={{ width: '120px'}} onClick={this.onRemoveAvatar}>
                                                Remove Avatar
                                            </Button>
                                        </Row>
                                        <Row>
                                            <Text>Avatar will revert to gravatar.com version</Text>
                                        </Row>
                                    </Form.Item>
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
                            <Form.Item extra="It's your responsibility to keep this information private">
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('publicKey', {
                                            initialValue: `${user && user.publicKey}`
                                        })(<Input.Password addonBefore="Public Key" className="border-left-hide text-right" disabled />)}
                                    </Col>
                                    {/* <Col span={8}>
                                        <Button shape="round" className="btn-pink">Replace</Button>
                                    </Col> */}
                                </Row>
                            </Form.Item>
                            {/* <Row>GnuPG 1</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input disabled value={this.state.mid1}/>
                                    </Col>
                                    <Col span={8}>
                                        <Row type="flex" align="middle" gutter={8} style={{ fontSize: 12 }}>
                                            <Col style={{ lineHeight: 'initial' }}>
                                                <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '20px' }} />
                                            </Col>
                                            <Col>Unverified</Col>
                                            <Col><a>Resend Verification</a></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Add GnuPG Key</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Row>
                                            <Input.TextArea rows={3} onChange={this.onPublicKeyChange} />
                                        </Row>
                                        <Row type="flex" justify="space-between" align="top">
                                            <Col>
                                                <Text type="secondary">Paste a GnuPG Key</Text>
                                            </Col>
                                            <Col>
                                                <Button shape="round" type="default" onClick={this.onAddGnuPGKey}>Add</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form.Item> */}
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
                                        })(<Input size="default" />)}
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
                                        })(<Input size="default" />)}
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
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }} className="text-right-md">
                            {/* <Form.Item>
                                <Button shape="round" type="default" onClick={this.onChangePrimaryEmail}>Change Primary Email</Button>
                            </Form.Item> */}
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {form.getFieldDecorator('primaryEmail', {
                                            initialValue: `${user && primaryEmail.email}`
                                        })(<Input disabled={!this.state.isPrimaryEmailEnabled} />)}
                                    </Col>
                                    {(primaryEmail.status === 1) ? null : (
                                        <Col span={8}>
                                            <Row type="flex" align="middle" gutter={8} style={{ fontSize: 14 }}>
                                                <Col style={{ lineHeight: 'initial' }}>
                                                    <Tooltip placement="bottom" title="Unverified">
                                                        <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#eb2f96" style={{ fontSize: '20px' }} />
                                                    </Tooltip>
                                                </Col>
                                                <Col><a onClick={() => this.onResendVerifyEmail(primaryEmail.email)}>Resend Verification</a></Col>
                                            </Row>
                                        </Col>
                                    )}
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
                                        <Input defaultValue="678 Maple Lane Rd" />
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
                                        <Input defaultValue="APT 3" />
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Zipcode</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="12345" />
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>City</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="Hyrule" />
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Row>Country</Row>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={16}>
                                        <Input defaultValue="Holodrum" />
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
                                                    <Input style={{ textAlign: 'right' }} defaultValue="+1" />
                                                </Col>
                                                <Col span={18}>
                                                    <Input defaultValue="(801)-867-7183" />
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
                                            <Button shape="round" className="btn-pink">Remove</Button>
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
                                            <Button shape="round" className="btn-pink" onClick={() => this.onRemoveSocial(2)}>Remove</Button>
                                        ) : (
                                            <Button shape="round" onClick={() => this.onAddSocial(2)} loading={this.state.facebookLoading}>Add</Button>
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
                                            <Button shape="round" className="btn-pink">Remove</Button>
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
                                            <Button shape="round" className="btn-pink">Remove</Button>
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
                                <h3>Global Privacy Settings</h3>
                                <Text>Determines your privacy settings for the whole Meritocracy Platform.</Text>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Row><h4>Profile Global Privacy</h4></Row>
                            <Form.Item extra="Other Meritocracy members may find you in the global member lists">
                                <Checkbox>Display Profile in Global Member list</Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Row gutter={20} type="flex" align="middle">
                                    <Col>
                                        <Button shape="round" className="btn-green" htmlType="submit" loading={isSubmitForm}>Update Profile Settings</Button>
                                    </Col>
                                    <Col>
                                        <Button shape="round">Cancel</Button>
                                    </Col>
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
                    <Divider />
                    <Row gutter={20}>
                        <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Row>
                                <h3>Cryptocurrency</h3>
                                <Text>Cryptocurrency Wallet Address and Balance</Text>
                            </Row>
                        </Col>
                        <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24}}>
                            <Form.Item>
                                <Row gutter={8} type="flex" align="middle">
                                    <Col span={8}><h4>GLX (Balance: {glxBalance ? glxBalance : 0})</h4></Col>
                                    {(glxAddress && glxAddress != '') ? (
                                        <Container>
                                            <Col span={10}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(glxAddress)} />} defaultValue={glxAddress} disabled />
                                            </Col>
                                            <Col span={4}>
                                                <Button shape="round" onClick={() => this.onWithdraw(0)}>Withdraw</Button>
                                            </Col>
                                            {/* <Col span={4}>
                                                <Button shape="round" onClick={() => this.onDeposit(0, glxAddress)} disabled={glx.isDeposit}>Deposit</Button>
                                            </Col> */}
                                        </Container>
                                    ) : (
                                        <Col span={10}>
                                            <Button shape="round" loading={glxLoading} onClick={() => this.generateWalletAddress(0)} disabled>Generate Address</Button>
                                        </Col>
                                    )}
                                </Row>
                                {glx.isDeposit && (
                                    <Container>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                Please make a GLX deposit in {glx.countDownLabel} to the below address.
                                                <br/>
                                                Please do not close or reload browser.
                                                <br/>
                                                Waiting for your deposit...
                                            </Col>
                                        </Row>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(glxAddress)} />} defaultValue={glxAddress} disabled />
                                            </Col>
                                        </Row>
                                    </Container>
                                )}
                            </Form.Item>

                            <Form.Item>
                                <Row gutter={8} type="flex" align="middle">
                                    <Col span={8}><h4>ETH (Balance: {ethBalance ? ethBalance.toFixed(4) : 0})</h4></Col>
                                    {(ethAddress && ethAddress != '') ? (
                                        <Container>
                                            <Col span={10}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(ethAddress)} />} defaultValue={ethAddress} disabled />
                                            </Col>
                                            <Col span={4}>
                                                <Button shape="round" onClick={() => this.onWithdraw(1)}>Withdraw</Button>
                                            </Col>
                                            {/* <Col span={4}>
                                                <Button shape="round" onClick={() => this.onDeposit(1, ethAddress)} disabled={eth.isDeposit}>Deposit</Button>
                                            </Col> */}
                                        </Container>
                                    ) : (
                                        <Col span={10}>
                                            <Button shape="round" loading={ethLoading} onClick={() => this.generateWalletAddress(1)}>Generate Address</Button>
                                        </Col>
                                    )}
                                </Row>
                                {eth.isDeposit && (
                                    <Container>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                Please make a ETH deposit in {eth.countDownLabel} to the below address.
                                                <br/>
                                                Please do not close or reload browser.
                                                <br/>
                                                Waiting for your deposit...
                                            </Col>
                                        </Row>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(ethAddress)} />} defaultValue={ethAddress} disabled />
                                            </Col>
                                        </Row>
                                    </Container>
                                )}
                            </Form.Item>

                            <Form.Item>
                                <Row gutter={8} type="flex" align="middle">
                                    <Col span={8}><h4>BTC (Balance: {btcBalance ? btcBalance : 0})</h4></Col>
                                    {(btcAddress && btcAddress != '') ? (
                                        <Container>
                                            <Col span={10}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(btcAddress)} />} defaultValue={btcAddress} disabled />
                                            </Col>
                                            <Col span={4}>
                                                <Button shape="round" onClick={() => this.onWithdraw(2)}>Withdraw</Button>
                                            </Col>
                                            {/* <Col span={4}>
                                                <Button shape="round" onClick={() => this.onDeposit(2, btcAddress)} disabled={btc.isDeposit}>Deposit</Button>
                                            </Col> */}
                                        </Container>
                                    ) : (
                                        <Col span={10}>
                                            <Button shape="round" loading={btcLoading} onClick={() => this.generateWalletAddress(2)}>Generate Address</Button>
                                        </Col>
                                    )}
                                </Row>
                                {btc.isDeposit && (
                                    <Container>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                Please make a BTC deposit in {btc.countDownLabel} to the below address.
                                                <br/>
                                                Please do not close or reload browser.
                                                <br/>
                                                Waiting for your deposit...
                                            </Col>
                                        </Row>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(btcAddress)} />} defaultValue={btcAddress} disabled />
                                            </Col>
                                        </Row>
                                    </Container>
                                )}
                            </Form.Item>

                            <Form.Item>
                                <Row gutter={8} type="flex" align="middle">
                                    <Col span={8}><h4>BCH (Balance: {bchBalance ? btcBalance : 0})</h4></Col>
                                    {(bchAddress && bchAddress != '') ? (
                                        <Container>
                                            <Col span={10}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(bchAddress)} />} defaultValue={bchAddress} disabled />
                                            </Col>
                                            <Col span={4}>
                                                <Button shape="round" onClick={() => this.onWithdraw(3)}>Withdraw</Button>
                                            </Col>
                                            {/* <Col span={4}>
                                                <Button shape="round" onClick={() => this.onDeposit(3, bchAddress)} disabled={bch.isDeposit}>Deposit</Button>
                                            </Col> */}
                                        </Container>
                                    ) : (
                                        <Col span={10}>
                                            <Button shape="round" loading={bchLoading} onClick={() => this.generateWalletAddress(3)}>Generate Address</Button>
                                        </Col>
                                    )}
                                </Row>
                                {bch.isDeposit && (
                                    <Container>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                Please make a BCH deposit in {bch.countDownLabel} to the below address.
                                                <br/>
                                                Please do not close or reload browser.
                                                <br/>
                                                Waiting for your deposit...
                                            </Col>
                                        </Row>
                                        <Row gutter={8} type="flex" align="middle">
                                            <Col span={8}></Col>
                                            <Col span={16}>
                                                <Input addonAfter={<Icon type="copy" onClick={() => this.copyText(bchAddress)} />} defaultValue={bchAddress} disabled />
                                            </Col>
                                        </Row>
                                    </Container>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Modal
                    title={withdrawModal.title}
                    visible={withdrawModal.isVisible}
                    onOk={this.doWithdraw}
                    okText="Withdraw"
                    confirmLoading={withdrawModal.loading}
                    onCancel={this.cancelWithdraw}
                >
                    <Form.Item label={withdrawModal.coinName + " Address"}>
                        <Input placeholder={withdrawModal.coinName + " address to withdraw"} onChange={this.setWithDrawAddress} ref={this.coinAddress} />
                    </Form.Item>
                    <Form.Item label={`Amount (${withdrawModal.coinName})`}>
                        <Input type="number" placeholder="Amount to withdraw" onChange={this.setWithDrawAmount} defaultValue={ethFee} min={ethFee} ref={this.coinAmount} />
                    </Form.Item>
                    <Form.Item>
                        <Text>{subtractDecimals(withdrawModal.amount, withdrawModal.fee)} {withdrawModal.coinName} will be sent</Text>
                    </Form.Item>
                </Modal>
            </div>
        );
    }
}

export default ProfileEdit;