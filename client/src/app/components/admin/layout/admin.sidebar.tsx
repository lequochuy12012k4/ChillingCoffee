'use client';
import { Layout, Menu } from 'antd';
import { MessageOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function AdminSidebar() {
  const { Sider } = Layout;
  const pathname = usePathname();
  const selected = pathname?.includes('/admin/users')
    ? ['users']
    : pathname?.includes('/admin/products')
    ? ['products']
    : pathname?.includes('/admin/feedback')
    ? ['feedback']
    : [];
  const items = [
    { key: 'users', icon: <UserOutlined />, label: <Link href="/admin/users">Users</Link> },
    { key: 'products', icon: <ShopOutlined />, label: <Link href="/admin/products">Products</Link> },
    { key: 'feedback', icon: <MessageOutlined />, label: <Link href="/admin/feedback">Feedback</Link> },
  ];
  return (
    <>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" selectedKeys={selected} items={items} />
      </Sider>
    </>
  );
}