'use client';
import { Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function AdminHeader() {
    const { Header, Content, Footer, Sider } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
    const pathname = usePathname();
    const selected = pathname?.includes('/admin/users')
      ? ['users']
      : pathname?.includes('/admin/products')
      ? ['products']
      : pathname?.includes('/admin/feedback')
      ? ['feedback']
      : [];
    return (
        <>
        <Header style={{ padding: 0, backgroundColor: "#fff", borderBottom: '1px solid #f0f0f0' }}>
        	<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        		<div style={{ fontWeight: 600 }}>Admin Dashboard</div>
        		<Menu
        			mode="horizontal"
        			selectedKeys={selected}
        			items={[
        				{ key: 'users', label: <Link href="/admin/users">Users</Link> },
        				{ key: 'products', label: <Link href="/admin/products">Products</Link> },
        				{ key: 'feedback', label: <Link href="/admin/feedback">Feedback</Link> },
        			]}
        		/>
        	</div>
        </Header>
        </>
    );
}