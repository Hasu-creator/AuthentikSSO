const API_BASE_URL = 'http://localhost:5000/api';

export const authAPI = {
  // Đăng xuất khỏi Authentik
  logout: async () => {
    try {
      const token = localStorage.getItem('access_token') || 
                    localStorage.getItem('auth_token') || 
                    localStorage.getItem('session');
      
      const username = localStorage.getItem('authentik_username');
      
      // Gọi backend logout endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          username: username
        })
      }).catch(err => console.error('Backend logout error:', err));
      
      // Xóa tất cả dữ liệu local
      localStorage.removeItem('authentik_username');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('session');
      sessionStorage.clear();
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn xóa local storage dù có lỗi
      localStorage.clear();
      sessionStorage.clear();
      return { success: false, error: error.message };
    }
  }
};

export const userAPI = {
  // Lấy tất cả users đang hoạt động
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Lấy tất cả users đã bị vô hiệu hóa
  getInactiveUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/inactive`);
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách người dùng đã vô hiệu hóa');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Vô hiệu hóa user
  disableUser: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/disable_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Không thể vô hiệu hóa tài khoản');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Kích hoạt lại user
  activateUser: async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/activate_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.detail || 'Không thể kích hoạt tài khoản');
      }
      
      return data;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },

  // Chỉnh sửa thông tin user (bao gồm cả username)
  editUser: async (username, updateData) => {
    try {
      const payload = {
        username,
        name: updateData.name,
        email: updateData.email
      };
      
      // Chỉ thêm new_username nếu có
      if (updateData.new_username) {
        payload.new_username = updateData.new_username;
        payload.keep_sessions = true;
      }
      
      const response = await fetch(`${API_BASE_URL}/edit_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(data.detail || 'Username đã tồn tại trong hệ thống');
        } else if (response.status === 403) {
          throw new Error(data.detail || 'Bạn không có quyền chỉnh sửa tài khoản này');
        } else if (response.status === 404) {
          throw new Error(data.detail || 'Không tìm thấy tài khoản');
        }
        throw new Error(data.message || data.detail || 'Không thể cập nhật thông tin tài khoản');
      }
      
      return data.user;
    } catch (error) {
      throw new Error(error.message || 'Lỗi kết nối đến server');
    }
  },
};