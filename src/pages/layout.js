import { useRouter } from 'next/router'
import { ConfigProvider, Layout, Space, Menu, Button, PageHeader } from 'antd';
import { SettingOutlined, FileOutlined } from '@ant-design/icons';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

//theme
const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  height: 64,
  lineHeight: '64px',
  backgroundColor: '#f5f5f5',
  fontSize: 20
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
const menuItem = [
  {
    label: 'Setting',
    key: 'setting',
    icon: <SettingOutlined />,
    children: [
      {
        label: 'Kategori',
        key: 'app/kategori'
      },
      {
        label: 'Buku',
        key: 'app/buku'
      },
      {
        label: 'Peminjaman',
        key: 'app/peminjaman'
      }
    ],
  },
  {
    label: 'Laporan',
    key: 'laporan',
    icon: <FileOutlined />,
    children: [
      {
        label: 'Detail',
        key: 'app/laporan/detail'
      },
      {
        label: 'Summary',
        key: 'app/laporan/summary'
      }
    ],
  }
]

export default function layout({children}) {
  const supabase = createClientComponentClient()
  const router = useRouter();

  const onClick = (menuData) => {
    let page = menuData.key;
    router.push('/'+page);
  };

  const onSignOut = async() => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: 'green',
        }
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
        <Layout>
          <Header style={headerStyle}>
            Header
            <Button type="primary" onClick={() => onSignOut()} style={{float:'right', marginTop:20}}>Sign out</Button>
          </Header>
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
            <Content style={contentStyle}>{children}</Content>
          </Layout>
        </Layout>
      </Space>
    </ConfigProvider>
  )
}