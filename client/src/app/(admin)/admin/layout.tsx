"use client";

import { Layout } from 'antd';
import AdminHeader from '@/app/components/admin/layout/admin.header';
import AdminSidebar from '@/app/components/admin/layout/admin.sidebar';
import AdminGuard from '@/app/components/admin/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { Content } = Layout;
    return (
        <AdminGuard>
            <Layout style={{ minHeight: '100vh' }}>
                <AdminSidebar />
                <Layout>
                    <AdminHeader />
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </AdminGuard>
    );
}

