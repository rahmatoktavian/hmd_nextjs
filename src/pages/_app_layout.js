import Head from 'next/head'
import { ConfigProvider, Layout, Space } from 'antd';

//theme
const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  height: 64,
  lineHeight: '64px',
  backgroundColor: '#f5f5f5',
};
const contentStyle = {
  padding: 10,
  color: '#fff',
  backgroundColor: '#fff',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  backgroundColor: '#f5f5f5',
};
const footerStyle = {
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
};

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: '#00b96b',
        }
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Sider style={siderStyle}>Sidebar</Sider>
          <Layout>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}><Component {...pageProps} /></Content>
          </Layout>
        </Layout>
      </Space>
    </ConfigProvider>
  )
}
