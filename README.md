# Photo Sharing App - Lab 2 & Lab 3

Ứng dụng chia sẻ ảnh hoàn chỉnh với Frontend (ReactJS) và Backend (Node.js + Express + MongoDB).

## Cấu trúc Project

```
photo-sharing-v1/
├── photo-sharing-v1/        # Frontend (ReactJS - Lab 2)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── photo-sharing-backend/   # Backend (Node.js + Express - Lab 3)
    ├── db/
    ├── routes/
    ├── modelData/
    └── package.json
```

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
- npm
- MongoDB Atlas account (hoặc MongoDB cài đặt local)

## Hướng dẫn cài đặt và chạy

### Bước 1: Cài đặt Backend

1. Mở terminal, di chuyển vào thư mục backend:
```bash
cd photo-sharing-backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` trong thư mục `photo-sharing-backend` với nội dung:
```
DB_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
PORT=8081
```
*Thay thế `<username>`, `<password>`, `<cluster-url>`, và `<database-name>` bằng thông tin MongoDB Atlas của bạn.*

4. Load dữ liệu mẫu vào database:
```bash
node db/dbLoad.js
```

5. Khởi động backend server:
```bash
node index.js
```
*Server sẽ chạy tại http://localhost:8081*

### Bước 2: Cài đặt Frontend

1. Mở terminal mới, di chuyển vào thư mục frontend:
```bash
cd photo-sharing-v1
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Khởi động React app:
```bash
npm start
```
*Ứng dụng sẽ tự động mở trình duyệt tại http://localhost:3000*

## Tính năng đã hoàn thành

### Lab 2 - Frontend
- ✅ Hiển thị danh sách users
- ✅ Hiển thị thông tin chi tiết user
- ✅ Hiển thị photos và comments
- ✅ Deep linking
- ✅ Advanced Features (Photo Stepper)

### Lab 3 - Backend
- ✅ API `/user/list` - Lấy danh sách users
- ✅ API `/user/:id` - Lấy thông tin chi tiết user
- ✅ API `/photosOfUser/:id` - Lấy photos và comments của user
- ✅ Kết nối MongoDB Atlas
- ✅ Load dữ liệu mẫu vào database

## API Endpoints

### User APIs
- `GET /user/list` - Trả về danh sách users (_id, first_name, last_name)
- `GET /user/:id` - Trả về thông tin chi tiết của user

### Photo APIs
- `GET /photosOfUser/:id` - Trả về tất cả photos của user kèm comments

## Lưu ý

- Frontend đã được cấu hình proxy để tự động kết nối với backend
- Cần chạy cả 2 servers (frontend và backend) đồng thời
- Backend phải chạy trước khi chạy frontend

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra lại chuỗi kết nối trong file `.env`
- Đảm bảo IP của bạn đã được whitelist trên MongoDB Atlas
- Kiểm tra username và password

### Lỗi CORS
- Backend đã cấu hình CORS, nếu vẫn gặp lỗi, kiểm tra lại cổng của backend

### Frontend không load được dữ liệu
- Đảm bảo backend đang chạy
- Kiểm tra proxy trong `package.json` của frontend
- Mở Developer Tools (F12) để xem lỗi trong Console
