'use client';

import { Content } from "antd/es/layout/layout";

const AdminContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <Content style={{ margin: '24px 16px 0' }}>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    backgroundColor: "#ccc",
                    borderRadius: "#ccc",
                }}
            >
                {children}
            </div>
        </Content>
    )
}

export default AdminContent;