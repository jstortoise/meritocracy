import Link from 'next/link';
import { Menu, Icon, Button } from 'antd';
import { default as menuData } from './menuData';
import './style.scss';

class MainMenu extends React.Component {
    state = {
        hideMenu: false
    };

    generateMenuItems(items) {
        return items.map(menuItem => {
            if (menuItem.divider) {
                return <Menu.Divider key={Math.random()}/>;
            } else {
                if (menuItem.subMenu) {
                    return (
                        <Menu.SubMenu
                            key={menuItem.key}
                            title={
                                <a>
                                    {menuItem.icon ? (
                                        <Icon type={menuItem.icon} />
                                    ) : (
                                        menuItem.image && <Icon component={() => <img src={`/static/images/${menuItem.image}`} />}/>
                                    )}
                                    {(menuItem.icon || menuItem.image) && <br/>}
                                    <span>{menuItem.title}</span>
                                </a>
                            }
                        >
                            {this.generateMenuItems(menuItem.subMenu)}
                        </Menu.SubMenu>
                    );
                } else {
                    return (
                        <Menu.Item key={menuItem.key}>
                            { menuItem.url ? (
                                <Link href={menuItem.url}>
                                    <a>
                                        {menuItem.icon ? (
                                            <Icon type={menuItem.icon} />
                                        ) : (
                                            menuItem.image && <Icon component={() => <img src={`/static/images/${menuItem.image}`} />}/>
                                        )}
                                        {(menuItem.icon || menuItem.image) && <br/>}
                                        <span>{menuItem.title}</span>
                                    </a>
                                </Link>
                            ) : (
                                <a>
                                    {menuItem.icon ? (
                                        <Icon type={menuItem.icon} />
                                    ) : (
                                        menuItem.image && <Icon component={() => <img src={`/static/images/${menuItem.image}`} />}/>
                                    )}
                                    {(menuItem.icon || menuItem.image) && <br/>}
                                    <span>{menuItem.title}</span>
                                </a>
                            )}
                        </Menu.Item>
                    );
                }
            }
        });
    }

    toggleMenu = () => {
        let { hideMenu } = this.state;
        hideMenu = !hideMenu;
        this.setState({ hideMenu });
    };

    render() {
        const menuItems = this.generateMenuItems(menuData);
        const { hideMenu } = this.state;
        return (
            <div className="main-menu">
                <Button type="primary" style={{ marginBottom: 16 }} onClick={this.toggleMenu}>
                    <Icon type='menu-unfold' />
                </Button>

                <Menu className={hideMenu && 'hide'}>
                    {menuItems}
                </Menu>
            </div>
        );
    }
}

export default MainMenu;