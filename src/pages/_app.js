import { useRouter } from 'next/router'
import { ConfigProvider, Layout, Space, Menu } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

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
  lineHeight: '120px',
  backgroundColor: '#f5f5f5',
};
const footerStyle = {
  textAlign: 'center',
  backgroundColor: '#f5f5f5',
};

//menu item
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const menuItem = [
  getItem('Setting', 'setting', <SettingOutlined />, [
    getItem('Kategori', 'kategori'),
    getItem('Buku', 'buku'),
    getItem('Peminjaman', 'peminjaman'),
    
  ]),
  getItem('Laporan', 'laporan', <SettingOutlined />, [
    getItem('Detail', 'laporan/detail'),
    getItem('Summary', 'laporan/summary'),
  ]),
  {
    type: 'divider',
  },
];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const onClick = (menuData) => {
    let page = menuData.key;
    router.push('/'+page);
  };

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
          <Header style={headerStyle}>Header</Header>
          <Layout>
            <Sider style={siderStyle}>
              <Menu
                onClick={onClick}
                defaultOpenKeys={['setting']}
                defaultSelectedKeys={['kategori']}
                mode="inline"
                items={menuItem}
              />
            </Sider>
            <Content style={contentStyle}><Component {...pageProps} /></Content>
          </Layout>
        </Layout>
      </Space>
    </ConfigProvider>
  )
}
