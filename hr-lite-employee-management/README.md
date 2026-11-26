# HR-Lite - Hệ thống Quản lý Nhân sự

## 1. Mục tiêu

Nâng cấp hệ thống quản lý nhân sự bằng JavaScript thuần, vận dụng DOM, Event Listener và Array Methods để xử lý dữ liệu và tương tác với người dùng.

## 2. Yêu cầu chức năng

- Thêm nhân viên mới mà không tải lại trang.
- Hiển thị, xóa và cập nhật danh sách nhân viên trên DOM.
- Tìm kiếm nhân viên theo tên theo thời gian thực, không phân biệt chữ hoa và chữ thường.
- Tự động tính và cập nhật tổng quỹ lương của toàn bộ nhân viên.
- Kiểm tra dữ liệu đầu vào, không chấp nhận tên rỗng hoặc lương âm.

## 3. Yêu cầu kỹ thuật

- Sử dụng `document.querySelector()` để truy xuất DOM.
- Sử dụng `addEventListener()` để xử lý sự kiện `submit`, `input` và `click`.
- Sử dụng `event.preventDefault()` để ngăn tải lại trang khi submit form.
- Sử dụng `push()` để thêm nhân viên.
- Sử dụng `map()` để tạo danh sách hiển thị.
- Sử dụng `filter()` để tìm kiếm và xóa nhân viên.
- Sử dụng `reduce()` để tính tổng quỹ lương.
- Không sử dụng vòng lặp `for/while` thay thế các phương thức mảng bắt buộc.

## 4. Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Git & GitHub

## 5. Cấu trúc dự án

```text
hr-lite-employee-management/
├── index.html
├── style.css
├── app.js
├── ai_prompt_log.md
└── README.md
```

## 6. Tiêu chí đánh giá

| Tiêu chí | Trọng số |
|---|---:|
| Chất lượng sản phẩm | 40% |
| Bảo vệ mã nguồn và vấn đáp | 40% |
| Kỹ năng tương tác AI | 20% |

## 7. Quy định sử dụng AI

AI đóng vai trò Pair-Programmer và QA Tester, hỗ trợ giải thích kiến thức, phân tích logic, tạo dữ liệu mẫu, gỡ lỗi và kiểm thử. Học viên tự triển khai mã nguồn, hiểu rõ logic và lưu lại ít nhất 3 prompt đã thực sự sử dụng trong quá trình thực hành vào `ai_prompt_log.md`.

## 8. Yêu cầu nộp bài

Nộp thư mục nén hoặc đường dẫn repository GitHub chứa mã nguồn và nhật ký tương tác AI.
