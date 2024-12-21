'use client';

import { Layout, Typography } from 'antd';
import Gallery from './components/Gallery/Gallery';
import MessageForm from './components/MessageForm';

const { Header, Content } = Layout;
const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <Layout style={{ height: '100vh', background: '#001529' }}>
      {/* <Header className="p-1" style={{ background: '#001529' }}> */}
        {/* <Title style={{ color: 'white', textAlign: 'center' }}>Generate Images</Title> */}
      {/* </Header> */}
      <Content style={{ padding: '50px', display: 'flex', flexDirection: 'column', background: '#141414' }}>
        <div style={{ marginBottom: '20px' }}>
          <MessageForm />
        </div>
        {/* <Gallery /> */}
      </Content>
    </Layout>
  );
};

export default Home;
