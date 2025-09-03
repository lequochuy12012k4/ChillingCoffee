import { Layout, Menu, theme } from 'antd';

export default function AdminFooter() {
    const { Header, Content, Footer, Sider } = Layout;
    return (
        <>
            <Footer style={{ textAlign: 'center' }}>
               ChillingCoffee ©{new Date().getFullYear()}
            </Footer>
        </>
    );
}