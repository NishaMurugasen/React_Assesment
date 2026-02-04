import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Button, Input, Radio, Modal, Pagination, Space, Avatar } from 'antd';
import { 
  UnorderedListOutlined, 
  AppstoreOutlined, 
  LogoutOutlined, 
  PlusOutlined 
} from '@ant-design/icons';

// Redux Actions
import { fetchUsers, createUser, updateUser, deleteUser, setViewMode } from '../features/user/usersSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

// Modular Components
import UserModal from '../components/UserModal';
import UserTable from '../components/UserTable';       // Ensure this file exists
import UserCardList from '../components/UserCardList'; // Ensure this file exists

const { Header, Content } = Layout;
const { Search } = Input;

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Selectors
  const { list, status, viewMode } = useSelector((state) => state.users);

  // Local State for Search & Pagination
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Set to 6 to perfectly fill two rows of 3 cards

  // Local State for Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

 // 1. First, filter the ENTIRE list based on the search text
const filteredUsers = list.filter(user => 
  user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
  user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
  user.email.toLowerCase().includes(searchText.toLowerCase())
);

// 2. IMPORTANT: Reset to page 1 if the user is searching to avoid "empty page" bugs
useEffect(() => {
  setCurrentPage(1);
}, [searchText]);

// 3. Paginate the FILTERED list, not the original list
const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  // --- Handlers ---
  const handleCRUDSubmit = (values) => {
    if (editingUser) {
      dispatch(updateUser({ id: editingUser.id, data: values }));
    } else {
      dispatch(createUser(values));
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => dispatch(deleteUser(id)),
    });
  };

  const openModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Top Header matching userList.jpg */}
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: '#001529', 
        padding: '0 24px' 
      }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>CompanyLogo</div>
        <Space size="large">
          <span style={{ color: 'white' }}>Elon Musk</span> {/* Static name from design */}
          <Avatar icon={<LogoutOutlined />} onClick={handleLogout} style={{ cursor: 'pointer', background: '#ff4d4f' }} />
        </Space>
      </Header>
      
      <Content style={{ padding: '40px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', minHeight: '80vh' }}>
          
          {/* Action Bar matching userSearch.png */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: '10px' }}>
            <h1 style={{ fontSize: '24px', margin: 0 }}>Users</h1>
            <Space>
             <Search 
                placeholder="Search users..." 
                allowClear
                // onChange updates searchText in real-time, triggering the .filter() above
                onChange={e => setSearchText(e.target.value)} 
                onSearch={value => setSearchText(value)} 
                style={{ width: 300 }} 
                />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
                Create User
              </Button>
            </Space>
          </div>

          {/* View Toggle matching design */}
          <div style={{ marginBottom: 24 }}>
            <Radio.Group value={viewMode} onChange={(e) => dispatch(setViewMode(e.target.value))}>
              <Radio.Button value="table"><UnorderedListOutlined /> Table</Radio.Button>
              <Radio.Button value="card"><AppstoreOutlined /> Card</Radio.Button>
            </Radio.Group>
          </div>

          {/* Content Switching */}
          {viewMode === 'table' ? (
            <UserTable 
              users={paginatedUsers} 
              onEdit={openModal} 
              onDelete={handleDelete} 
            />
          ) : (
            <UserCardList 
              users={paginatedUsers} 
              onEdit={openModal} 
              onDelete={handleDelete} 
            />
          )}

          {/* Pagination matching design */}
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Pagination 
              current={currentPage} 
              pageSize={pageSize} 
              total={filteredUsers.length} 
              onChange={(page) => setCurrentPage(page)} 
              showSizeChanger={false}
            />
          </div>
        </div>
      </Content>

      <UserModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleCRUDSubmit}
        initialValues={editingUser}
        loading={status === 'loading'}
      />
    </Layout>
  );
};

export default UsersPage;