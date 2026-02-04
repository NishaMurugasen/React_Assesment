import React from 'react';
import { Table, Button, Avatar, Space } from 'antd';

const UserTable = ({ users, onEdit, onDelete }) => {
  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (text) => <Avatar src={text} size={45} />,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <a href={`mailto:${text}`} style={{ color: '#1890ff' }}>
          {text}
        </a>
      ),
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Action',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          {/* Action buttons styled to match userList.jpg */}
          <Button 
            type="primary" 
            onClick={() => onEdit(record)}
            style={{ 
              borderRadius: '4px', 
              width: '80px',
              backgroundColor: '#1890ff' 
            }}
          >
            Edit
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={() => onDelete(record.id)}
            style={{ 
              borderRadius: '4px', 
              width: '80px',
              backgroundColor: '#ff4d4f' 
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={users} 
      rowKey="id" 
      pagination={false} // Handled by the parent UsersPage
      style={{ marginTop: '20px' }}
      // Matches the clean white look in userSearch.png
      className="custom-table"
    />
  );
};

export default UserTable;