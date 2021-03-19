import { connect } from 'react-redux';
import { Card, Form, Checkbox, Icon, Input, Select, Button, notification } from 'antd';
import { REDUCER, createClient } from '../../redux/ducks/client';
import { getCaptcha } from '../../redux/ducks/auth';
import { getUserList } from '../../redux/ducks/user';
import { getBaseDetailList } from '../../redux/ducks/base';
import './style.scss';

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER],
    user: state.app.user
});

@Form.create()
@connect(mapStateToProps)
class CreatePage extends React.Component {
    state = {
        captcha: {},
        loadingCaptcha: false,
        users: [],
        loadingUsers: false,
        types: []
    }

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    componentDidMount() {
        this.getCaptcha();
    }

    getOrganisationTypes = () => {
        getBaseDetailList(1, res => {
            if (res.success) {
                this.setState({ types: res.data });
            }
        });
    };

    getCaptcha = () => {
        this.setState({ loadingCaptcha: true });
        getCaptcha(res => {
            this.setState({ captcha: res.data, loadingCaptcha: false });
        });
    };

    validateCheckbox = (rule, value, callback) => {
        if (!value) {
            callback('To continue, please check this');
        } else {
            callback();
        }
    };

    fetchUsers = val => {
        var self = this;
        var state = self.state;
        state.users = [{ text: 'Myself', value: null }];
        state.loadingUsers = true;
        self.setState(state, () => {
            getUserList({ keyword: val }, res => {
                if (res.success) {
                    if (res.data.length > 0) {
                        res.data.map(user => state.users.push({
                            value: `${user.id}`,
                            text: `${user.username}`,
                        }));
                    }
                }
                state.loadingUsers = false;
                self.setState(state);
            });
        });
    };

	onSubmit = isSubmitForm => event => {
        event.preventDefault();
        const { form, dispatch } = this.props;
		if (!isSubmitForm) {
			form.validateFields((error, values) => {
				if (!error) {
                    if (values['captcha'] === this.state.captcha.text) {
                        dispatch(createClient(values));
                    } else {
                        notification.open({ type: 'error', message: 'Invalid captcha' });
                    }
				}
			});
		}
    };

    render() {
        const { form, isSubmitForm, user } = this.props;
        const { captcha, loadingCaptcha, users, loadingUsers, types } = this.state;

        return (
            <Card
                title={<Card.Meta title="CREATING A NEW ORGANISATION" description="All Fields are required"/>}
                className="organisation-create-panel"
                extra={<Icon type="reconciliation" style={{ fontSize: 32 }} />}
            >
                <Form hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                    <Form.Item label="Organisation Name" hasFeedback>
                        {form.getFieldDecorator('name', {
                            initialValue: '',
                            rules: [{ required: true, message: 'Enter the organisation name' }],
                        })(<Input />)}
                    </Form.Item>
                    
                    <Form.Item label="Organisation Website" hasFeedback>
                        {form.getFieldDecorator('rootUrl', {
                            initialValue: '',
                            rules: [{
                                required: true,
                                message: 'Enter the organisation website'
                            }, {
                                type: 'url',
                                message: 'Enter the valid url'
                            }],
                        })(<Input placeholder="https://domain.com" />)}
                    </Form.Item>

                    {user.role <= 1 && (
                        <Form.Item label="Ownership">
                            {form.getFieldDecorator('ownerId', {
                                initialValue: 'Myself',
                                rules: [{ required: true, message: 'Select ownership' }],
                            })(<Select
                                showSearch
                                placeholder="Please type to search users"
                                filterOption={false}
                                loading={loadingUsers}
                                onSearch={this.fetchUsers}
                            >
                                {users.map(d => (
                                    <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                            </Select>)}
                        </Form.Item>
                    )}

                    <Form.Item label="Main Topic" hasFeedback>
                        {form.getFieldDecorator('type', {
                            rules: [{ required: true, message: 'Select ownership' }],
                        })(<Select placeholder="Choose the main Topic">
                            <Select.Option value={0}>Legacy</Select.Option>
                            {user.role <= 1 && (<Select.Option value={1}>Certified</Select.Option>)}
                            <Select.Option value={2}>Public</Select.Option>
                            {user.role <= 1 && (<Select.Option value={3}>Private</Select.Option>)}
                            {/* {types.map(d => ((d.code !== 1 || user.role <= 1) && (
                                <Select.Option key={d.code} value={d.code}>{d.title}</Select.Option>
                            )))} */}
                        </Select>)}
                    </Form.Item>

                    <div className="captcha">
                        <div className="captcha-image">
                            <div dangerouslySetInnerHTML={{ __html: captcha.data }}/>
                            <Button icon={loadingCaptcha ? "loading" : "reload"} onClick={this.getCaptcha} />
                        </div>
                        <Form.Item>
                            {form.getFieldDecorator('captcha', {
                                initialValue: '',
                                rules: [{ required: true, message: 'Enter the characters you see' }],
                            })(<Input size="default" />)}
                        </Form.Item>
                    </div>
                    
                    <Form.Item className="text-center">
                        {form.getFieldDecorator('check', {
                            rules: [{ validator: this.validateCheckbox }],
                        })(<Checkbox>I have read and accept the terms of use</Checkbox>)}
                    </Form.Item>
                    
                    <p className="text-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            shape="round"
                            size="large"
                            loading={isSubmitForm}
                            className="btn-purple"
                        >
                            CREATE
                        </Button>
                    </p>
                </Form>
            </Card>
        );
    }
}

export default CreatePage;