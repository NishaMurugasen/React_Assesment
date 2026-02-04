import React from 'react';
import { Row, Col, Card, Avatar, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './UserCardList.css'; 

const UserCardList = ({ users, onEdit, onDelete }) => {
  return (
    <Row gutter={[20, 24]}>
      {users.map((user) => (
        <Col key={user.id} xs={24} sm={12} md={8}>
          <div className="user-card-wrapper">
            <Card bordered={false} className="user-profile-card">
              {/* Overlay with circular action buttons */}
              <div className="card-overlay">
                <Space size="middle">
                  <Button 
                    shape="circle" 
                    icon={<EditOutlined />} 
                    className="action-btn edit-btn-circle" 
                    onClick={() => onEdit(user)}
                  />
                  <Button 
                    shape="circle" 
                    icon={<DeleteOutlined />} 
                    className="action-btn delete-btn-circle"
                    onClick={() => onDelete(user.id)}
                  />
                </Space>
              </div>

              <div className="card-content">
                <Avatar 
                  src={user.avatar} 
                  size={100} 
                  className="card-avatar" 
                />
                <h3 className="user-name">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="user-email">{user.email}</p>
              </div>
            </Card>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default UserCardList;