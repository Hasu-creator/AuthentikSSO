
🛠️ HR Account Disabler Tool

<div align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</div>

<br/>

<div align="center">
  <p><strong>Công cụ quản lý tài khoản nhân viên cho phòng Nhân sự</strong></p>
  <p>Một giao diện trực quan giúp vô hiệu hóa và quản lý tài khoản nhân viên nghỉ việc trên hệ thống Authentik</p>
</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt](#-cài-đặt)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Đóng Góp](#-đóng-góp)
- [License](#-license)

---

## 🎯 Giới Thiệu

**HR Account Disabler Tool** là một ứng dụng web được thiết kế dành riêng cho phòng Nhân sự, giúp đơn giản hóa quy trình quản lý tài khoản nhân viên trên hệ thống Authentik. Với giao diện thân thiện và trực quan, công cụ này cho phép:

- ✅ Vô hiệu hóa tài khoản nhân viên nghỉ việc một cách nhanh chóng
- ✅ Kích hoạt lại tài khoản khi cần thiết
- ✅ Chỉnh sửa thông tin tài khoản
- ✅ Theo dõi lịch sử thay đổi và audit logs
- ✅ Xuất báo cáo dưới dạng JSON/CSV

---

## ✨ Tính Năng

### 🔐 Quản Lý Tài Khoản
- **Vô hiệu hóa tài khoản**: Disable tài khoản nhân viên với lý do rõ ràng
- **Kích hoạt tài khoản**: Activate lại tài khoản khi nhân viên quay lại
- **Chỉnh sửa thông tin**: Cập nhật email, tên, họ của nhân viên

### 📊 Quản Lý Dữ Liệu
- **Tìm kiếm thông minh**: Tìm kiếm theo tên, email, username
- **Phân loại rõ ràng**: Tab riêng cho tài khoản active và inactive
- **Lịch sử chi tiết**: Theo dõi tất cả thao tác disable/activate
- **Audit logs**: Ghi lại mọi thay đổi trên hệ thống

### 📤 Xuất Dữ Liệu
- **Export JSON**: Xuất audit logs dạng JSON
- **Export CSV**: Xuất lịch sử dạng CSV để phân tích
- **Export History**: Xuất lịch sử disable/activate

### 🎨 Giao Diện Người Dùng
- **Responsive design**: Tương thích mọi thiết bị
- **Dark mode ready**: Sẵn sàng cho chế độ tối
- **Smooth animations**: Hiệu ứng mượt mà, chuyên nghiệp
- **Scroll to top**: Nút cuộn lên đầu trang tiện lợi
- **Toast notifications**: Thông báo thân thiện với người dùng

---

## 💻 Yêu Cầu Hệ Thống

Để chạy ứng dụng này, bạn cần cài đặt:

### Phần Mềm Bắt Buộc

| Phần mềm | Phiên bản | Mục đích |
|----------|-----------|----------|
| **Node.js** | ≥ 16.x | Chạy Frontend |
| **npm** hoặc **yarn** | Latest | Quản lý packages |
| **Python** | ≥ 3.8 | Chạy Backend mock |

### Kiểm Tra Phiên Bản

```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra Python
python --version
```

---

## 🚀 Cài Đặt

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/hr-account-disabler.git
cd hr-account-disabler
```

### 2️⃣ Cài Đặt Dependencies Frontend

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt packages
npm install

# Hoặc nếu dùng yarn
yarn install
```

### 3️⃣ Cài Đặt Dependencies Backend (nếu có)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt requirements (nếu có file requirements.txt)
pip install -r requirements.txt
```

---

## 📖 Hướng Dẫn Sử Dụng

### ⚡ Quick Start

**⚠️ LƯU Ý QUAN TRỌNG**: Luôn khởi động Backend trước khi chạy Frontend!

#### **Bước 1: Khởi động Backend**

```bash
# Mở terminal thứ nhất
cd backend
python StoreToken.py
```

Backend sẽ chạy tại: `http://localhost:5000` (hoặc port được cấu hình)

#### **Bước 2: Khởi động Frontend**

```bash
# Mở terminal thứ hai
cd frontend
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

#### **Bước 3: Truy Cập Ứng Dụng**

Mở trình duyệt và truy cập: **http://localhost:5173**

---

### 🎮 Hướng Dẫn Sử Dụng Chi Tiết

#### 1. **Vô Hiệu Hóa Tài Khoản**

1. Chọn tab **"Tài khoản hoạt động"**
2. Tìm nhân viên cần disable
3. Click nút **"Vô hiệu hóa"** (màu đỏ)
4. Nhập lý do disable (bắt buộc)
5. Xác nhận thao tác

#### 2. **Kích Hoạt Tài Khoản**

1. Chọn tab **"Tài khoản bị vô hiệu hóa"**
2. Tìm nhân viên cần activate
3. Click nút **"Kích hoạt"** (màu xanh)
4. Nhập lý do activate (bắt buộc)
5. Xác nhận thao tác

#### 3. **Chỉnh Sửa Thông Tin**

1. Click nút **"Sửa"** (màu vàng) ở bất kỳ tài khoản nào
2. Cập nhật thông tin cần thiết:
   - Email
   - Tên
   - Họ
3. Click **"Lưu thay đổi"**

#### 4. **Tìm Kiếm Tài Khoản**

- Sử dụng thanh search bar ở đầu trang
- Tìm kiếm theo:
  - Username
  - Email
  - Tên
  - Họ

#### 5. **Xuất Báo Cáo**

- **Export History**: Click nút trong phần "Lịch sử vô hiệu hóa"
- **Export Audit Logs**: 
  - JSON: Click "Export JSON"
  - CSV: Click "Export CSV"

---

## 📁 Cấu Trúc Dự Án

```
hr-account-disabler/
│
├── frontend/                    # Frontend React application
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Header.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── UserTable.jsx
│   │   │   ├── InactiveUserTable.jsx
│   │   │   ├── ConfirmDisableModal.jsx
│   │   │   ├── ConfirmActivateModal.jsx
│   │   │   ├── EditUserModal.jsx
│   │   │   ├── AuditHistory.jsx
│   │   │   ├── DisableHistory.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── ScrollToTop.jsx
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useUsers.js
│   │   │   ├── useSearch.js
│   │   │   ├── useModals.js
│   │   │   └── useNotification.js
│   │   │
│   │   ├── handlers/            # Business logic handlers
│   │   │   ├── userActionsHandler.js
│   │   │   └── exportHandlers.js
│   │   │
│   │   ├── services/            # API & Service layer
│   │   │   ├── api.js
│   │   │   ├── auditService.js
│   │   │   ├── historyService.js
│   │   │   └── index.js
│   │   │
│   │   ├── context/             # React Context
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── App.jsx              # Main App component
│   │   ├── App.css              # Global styles
│   │   └── main.jsx             # Entry point
│   │
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   └── tailwind.config.js       # Tailwind CSS config
│
├── backend/                     # Backend Python mock service
│   ├── StoreToken.py            # Mock API server
│   └── requirements.txt         # Python dependencies
│
└── README.md                    # This file
```

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | 18.x | UI Framework |
| **Vite** | 5.x | Build tool & Dev server |
| **Tailwind CSS** | 3.x | CSS Framework |
| **Lucide React** | Latest | Icons |
| **React Hooks** | - | State management |

### Backend

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Python** | 3.x | Backend language |
| **Flask/FastAPI** | - | API Framework (nếu có) |

### DevOps & Tools

- **npm/yarn** - Package manager
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting

---


## 🐛 Xử Lý Lỗi Thường Gặp

### Lỗi: "Cannot connect to backend"

**Nguyên nhân**: Backend chưa được khởi động

**Giải pháp**:
```bash
cd backend
python StoreToken.py
```

### Lỗi: "Port 5173 already in use"

**Nguyên nhân**: Port đã được sử dụng bởi ứng dụng khác

**Giải pháp**:
```bash
# Thay đổi port trong vite.config.js
# Hoặc kill process đang dùng port
lsof -ti:5173 | xargs kill
```

### Lỗi: "Module not found"

**Nguyên nhân**: Dependencies chưa được cài đặt đầy đủ

**Giải pháp**:
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```
---

## 📝 Changelog

### Version 1.0.0 (2025-01-08)
- ✨ Release phiên bản đầu tiên
- ✅ Tính năng disable/activate tài khoản
- ✅ Chỉnh sửa thông tin user
- ✅ Export audit logs
- ✅ Scroll to top button
- ✅ Responsive design

---

## 👥 Authors

- **Hasu** - *Initial work* - [YourGitHub](https://github.com/Hasu-creator)

---

## 📞 Liên Hệ

- **Email**: tech.chauloc18@gmail.com
- **Issue Tracker**: [GitHub Issues](https://github.com/Hasu-creator/issues)

---
