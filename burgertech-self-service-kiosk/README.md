# BurgerTech Self-Service Kiosk

**Tên dự án:** `burgertech-self-service-kiosk`

## 1. Giới thiệu

Bài tập **Hồi sinh Kiosk Đặt món Tự động – Dự án BurgerTech** yêu cầu khắc phục giao diện đặt món tự phục vụ: form bị tải lại trang khi gửi, danh sách món chưa cập nhật và thiếu phím tắt hỗ trợ thanh toán.

## 2. Mục tiêu

- Thao tác DOM bằng JavaScript: truy xuất, tạo mới, cập nhật và xóa phần tử HTML.
- Xử lý sự kiện form (`submit`), chuột (`click`, `hover`) và bàn phím (`keydown`).
- Đảm bảo dữ liệu giỏ hàng và nội dung hiển thị luôn đồng bộ.

## 3. Yêu cầu chức năng

| Chức năng | Yêu cầu |
| --- | --- |
| Thêm món | Nhập tên món, giá tiền và thêm vào giỏ hàng. |
| Chặn tải lại | Dùng `event.preventDefault()` khi gửi form. |
| Hiển thị giỏ hàng | Tạo và thêm phần tử `<li>` vào `#cartList`. |
| Tính tổng tiền | Cập nhật `#totalPrice` khi thêm hoặc xóa món. |
| Xóa từng món | Nhấn nút Xóa của món tương ứng. |
| Hiệu ứng chuột | Đổi màu nền món khi di chuột qua. |
| Thanh toán | Nhấn nút thanh toán hoặc phím `Enter` để thông báo thanh toán thành công khi giỏ có món. |
| Xóa toàn bộ | Nhấn phím `Escape` để làm trống giỏ hàng. |

## 4. Các phần tử DOM chính

| Selector | Vai trò | Sự kiện liên quan |
| --- | --- | --- |
| `#orderForm` | Form nhập món | `submit` |
| `#foodName` | Tên món ăn | Đọc giá trị khi submit |
| `#foodPrice` | Giá tiền | Đọc giá trị và kiểm tra hợp lệ |
| `#cartList` | Danh sách món đã chọn | `click` (Event Delegation) |
| `#totalPrice` | Tổng tiền giỏ hàng | Cập nhật nội dung |
| `#checkoutBtn` | Nút thanh toán | `click` |
| `document` hoặc `window` | Nhận phím tắt | `keydown` |

## 5. Yêu cầu kỹ thuật

- Sử dụng `getElementById()` hoặc `querySelector()` để truy xuất DOM.
- Sử dụng `addEventListener()` để đăng ký các sự kiện.
- Sử dụng `preventDefault()` để ngăn form tải lại trang.
- Tạo phần tử món ăn mới bằng thao tác DOM phù hợp.
- Khuyến khích sử dụng **Event Delegation** trên `#cartList` để xử lý nút Xóa được tạo động.
- Chú thích rõ trong `app.js` các phần **Form Event**, **Mouse Event**, **Keyboard Event**.
- Xử lý hợp lý phím `Enter` khi đang nhập form để tránh xung đột với thao tác thêm món.

## 6. Quy trình thực hiện

1. **Phân tích (10 phút):** Xác định nguyên nhân form reload; liệt kê DOM selector và sự kiện cần xử lý.
2. **Thiết kế (15 phút):** Viết mã giả cho submit form, click xóa món và keydown.
3. **Triển khai (30 phút):** Xây dựng giao diện và các chức năng tương tác DOM, sự kiện chuột, bàn phím.
4. **Kiểm thử (10 phút):** Kiểm tra validation, phím tắt, thao tác xóa liên tục và tính nhất quán của giỏ hàng.

## 7. Kiểm thử và nghiệm thu

- [ ] Gửi form không làm trang tải lại.
- [ ] Không thể thêm món nếu thiếu trường bắt buộc; kiểm tra giá hợp lệ.
- [ ] Món mới xuất hiện đúng trong danh sách.
- [ ] Tổng tiền chính xác sau khi thêm và xóa món.
- [ ] Nút Xóa chỉ xóa đúng món được chọn, kể cả khi click liên tục.
- [ ] Hiệu ứng hover hoạt động.
- [ ] `Enter` thực hiện thanh toán theo ngữ cảnh phù hợp; không thanh toán khi giỏ trống.
- [ ] `Escape` xóa sạch giỏ hàng và cập nhật tổng tiền về 0.
- [ ] Không phát sinh lỗi JavaScript trong Console.

## 8. Tiêu chí đánh giá

| Tiêu chí | Tỷ trọng |
| --- | ---: |
| Chất lượng sản phẩm: DOM, form, mouse, keyboard | 40% |
| Vấn đáp: Event Delegation, Event Object, Keyboard Event | 40% |
| Nhật ký tương tác AI (`ai_prompt_log.md`) | 20% |

**Các câu hỏi cần chuẩn bị:**

- Event Delegation là gì? Vì sao gắn `click` lên `<ul>` thay vì từng nút Xóa?
- Đối tượng `event` chứa những thông tin quan trọng nào?
- Phân biệt phím `Enter` và `Space` bằng thuộc tính nào?
- So sánh `textContent`, `innerText` và `innerHTML`.

## 9. Quy định sử dụng AI

Được dùng AI để tìm hiểu `preventDefault()`, so sánh cách thao tác DOM và tra cứu phím trong Keyboard Event. Không yêu cầu AI viết sẵn toàn bộ logic giỏ hàng hoặc sao chép mã khi chưa hiểu Event Bubbling và Event Delegation.

File `ai_prompt_log.md` cần ghi lại **ít nhất 3 prompt chất lượng đã thực sự trao đổi với AI**, kèm mục đích và kiến thức rút ra.

## 10. Cấu trúc dự án

```text
burgertech-self-service-kiosk/
├── index.html
├── style.css
├── app.js
├── README.md
└── ai_prompt_log.md
```

## 11. Sản phẩm nộp bài

Nộp thư mục nén hoặc đường dẫn GitHub repository có đủ `index.html`, `style.css`, `app.js` và `ai_prompt_log.md`. `README.md` dùng để giới thiệu và mô tả yêu cầu dự án.
