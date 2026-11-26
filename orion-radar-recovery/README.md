# Orion Radar Recovery

## Giới thiệu

Bài thực hành khôi phục Trạm Radar Không lưu Orion bằng HTML5 Canvas và JavaScript. Mục tiêu là xây dựng Radar động, xử lý dữ liệu lỗi từ API và hỗ trợ tương tác với máy bay bằng chuột.

## Yêu cầu chức năng

- Sử dụng `requestAnimationFrame()` để tạo vòng lặp hiển thị Radar liên tục.
- Xây dựng hàm `cleanData()` để kiểm tra và lọc dữ liệu trước khi render.
- Xử lý dữ liệu `null`, `undefined`, `NaN`, `Infinity`, sai kiểu, thiếu tọa độ hoặc sai cấu trúc.
- Sử dụng `try...catch` để cô lập lỗi và `console.warn()` để ghi cảnh báo.
- Bắt sự kiện click trên Canvas, xác định máy bay được chọn và đổi màu sang đỏ.
- Kiểm thử với dữ liệu biến động và 500 máy bay, khoảng 30% dữ liệu lỗi.
- Đảm bảo Radar tiếp tục hoạt động, không phát sinh ngoại lệ chưa được xử lý trong các kịch bản kiểm thử.

## Cấu trúc dự án dự kiến

```text
orion-radar-recovery/
├── radar_system.html
├── app.js
├── README.md
├── error_handling_report.txt
├── ai_prompt_log.md
└── screenshots/
    └── console-warning.png
```

## Quy trình triển khai

| Giai đoạn | Nội dung | Thời gian |
|---|---|---|
| Phân tích | Đọc Legacy Code, xác định nguyên nhân lỗi và edge cases | 10 phút |
| Thiết kế | Viết mã giả xử lý dữ liệu và thuật toán click | 15 phút |
| Triển khai | Animation, validation, xử lý ngoại lệ và tương tác | 25 phút |
| Kiểm thử | Kiểm tra dữ liệu cực đoan và khả năng hoạt động liên tục | 10 phút |

## Kiến thức cần bảo vệ

- Công thức xác định click trúng hình tròn: `d = √((mouseX - x)² + (mouseY - y)²)`. Nếu `d <= r` thì click nằm trong vùng chọn.
- Sử dụng `getBoundingClientRect()` và tỷ lệ kích thước Canvas để chuyển đổi tọa độ chuột.
- `try...catch` bên ngoài vòng lặp có thể khiến các phần tử còn lại không được xử lý khi xảy ra ngoại lệ; đặt bên trong giúp cô lập lỗi của từng phần tử.
- Validation giúp ngăn dữ liệu không hợp lệ trước khi render. Trong Legacy Code, truy cập thuộc tính `x` của phần tử `null` gây `TypeError`; tọa độ không hữu hạn không nhất thiết gây ngoại lệ trong `arc()`.

## Sản phẩm bàn giao

- [x] `radar_system.html` và `app.js`: ứng dụng Radar hoàn chỉnh.
- [x] `error_handling_report.txt`: dữ liệu kiểm thử lỗi, kết quả kiểm thử và đường dẫn ảnh Console minh chứng cảnh báo.
- [ ] `screenshots/console-warning.png`: ảnh chụp Console thực tế.
- [x] `ai_prompt_log.md`: nhật ký trao đổi với AI.

## Tiêu chí đánh giá

| Tiêu chí | Trọng số |
|---|---:|
| Chất lượng sản phẩm | 40% |
| Bảo vệ mã nguồn và vấn đáp | 40% |
| Kỹ năng tương tác AI | 20% |

## Quy định sử dụng AI

AI được sử dụng để sinh dữ liệu kiểm thử, giải thích công thức toán học, phân tích lỗi và hỗ trợ debug. Không yêu cầu AI viết hoàn chỉnh hàm render Canvas hoặc sửa toàn bộ bài thực hành. Học viên phải tự giải thích được cơ chế validation và `try...catch`.

## Trạng thái

Đang phát triển. Các mục bàn giao và kết quả kiểm thử sẽ được cập nhật sau khi triển khai thực tế.
