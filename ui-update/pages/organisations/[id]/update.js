import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Card, Form, Checkbox, Icon, Input, Select, Button } from 'antd';
import { REDUCER, getClientDetail, updateClient } from '../../../redux/ducks/client';
import { getCaptcha } from '../../../redux/ducks/auth';
import { getUserList } from '../../../redux/ducks/user';
import { getBaseDetailList } from '../../../redux/ducks/base';
import '../style.scss';

const EditPageWithRouter = props => {
    const router = useRouter();
    return (<EditPage {...props} router={router}/>);
};

EditPageWithRouter.getInitialProps = async () => {
    return { roles: [0, 1, 2, 3] };
};

const mapStateToProps = (state, props) => ({
    isSubmitForm: state.app.submitForms[REDUCER],
    user: state.app.user
});

@Form.create()
@connect(mapStateToProps)
class EditPage extends React.Component {
    state = {
        captcha: {},
        loadingCaptcha: false,
        users: [],
        loadingUsers: false,
        organisation: {},
        types: []
    }

    static async getInitialProps() {
        return { roles: [0, 1, 2, 3] };
    }

    componentDidMount() {
        this.getCaptcha();
        this.getOrganisationTypes(() => {
            this.getOrganisation();
        });
    }

    getOrganisation = () => {
        const { router } = this.props;
        const { id } = router.query;
        getClientDetail(id, res => {
            if (res.success) {
                this.setState({ organisation: res.data });
            }
        });
    };

    getOrganisationTypes = (callback = null) => {
        getBaseDetailList(1, res => {
            if (res.success) {
                this.setState({ types: res.data });
                if (callback) {
                    callback();
                }
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
        const { form } = this.props;
        if (!value) {
            callback('To continue, please check this');
        } else {
            callback();
        }
    };

    fetchUsers = val => {
        var state = this.state;
        state.users = [{ text: 'Myself', value: 'Myself' }];
        state.loadingUsers = true;
        this.setState(state, () => {
            getUserList({ keyword: val }, res => {
                state = this.state;
                if (res.success) {
                    if (res.data.length > 0) {
                        res.data.map(user => state.users.push({
                            value: `${user.id}`,
                            text: `${user.username}`,
                        }));
                    }
                }
                state.loadingUsers = false;
                this.setState(state);
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
                        const { id } = this.state.organisation;
                        dispatch(updateClient(id, values));
                    } else {
                        notification.open({ type: 'error', message: 'Invalid captcha' });
                    }
				}
			});
		}
    };

    render() {
        const { form, isSubmitForm, user } = this.props;
        const { captcha, loadingCaptcha, users, loadingUsers, types, organisation } = this.state;
        console.log(organisation.type);

        return (
            <Card
                title={<Card.Meta title="CREATING A NEW ORGANISATION" description="All Fields are required"/>}
                className="organisation-create-panel"
                extra={<Icon type="reconciliation" style={{ fontSize: 32 }} />}
            >
                <Form hideRequiredMark onSubmit={this.onSubmit(isSubmitForm)}>
                    <Form.Item label="Organisation Name" hasFeedback>
                        {form.getFieldDecorator('name', {
                            initialValue: `${organisation.name}`,
                            rules: [{ required: true, message: 'Enter the organisation name' }],
                        })(<Input />)}
                    </Form.Item>
                    
                    <Form.Item label="Organisation Website" hasFeedback>
                        {form.getFieldDecorator('rootUrl', {
                            initialValue: `${organisation.rootUrl}`,
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
                                defaultValue={organisation.type}
                            >
                                {users.map(d => (
                                    <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                            </Select>)}
                        </Form.Item>
                    )}

                    <Form.Item label="Main Topic" hasFeedback>
                        {form.getFieldDecorator('type', {
                            initialValue: `${organisation.type}`,
                            rules: [{ required: true, message: 'Select ownership' }],
                        })(<Select placeholder="Choose the main Topic">
                            {types.map(d => ((d.code !== 1 || user.role <= 1) && (
                                <Select.Option key={d.code} value={d.code}>{d.title}</Select.Option>
                            )))}
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

export default EditPageWithRouter;