# Nhật ký sử dụng AI

**1. Vì sao script đồng bộ trong `<head>` làm trang hiển thị chậm?**
Khi gặp `<script>` không có `defer`/`async`, trình duyệt dừng phân tích HTML để tải và chạy script. Nếu script chạy vòng lặp nặng, `<body>` chưa được phân tích nên người dùng thấy trang trắng (render-blocking).

**2. `defer` khác `async` thế nào?**
Cả hai tải song song với việc phân tích HTML. `defer` chạy sau khi HTML phân tích xong, trước `DOMContentLoaded`, giữ thứ tự giữa các script. `async` chạy ngay khi tải xong, có thể chen ngang phân tích HTML, không đảm bảo thứ tự. Bài này dùng `defer` vì cần truy cập DOM.

**3. Đặt script cuối `<body>` thì sao?**
Không chặn phần HTML phía trên, nhưng script chỉ bắt đầu tải khi trình duyệt phân tích tới thẻ đó, nên chậm hơn `defer` (vốn tải ngay từ `<head>`).

**4. `prompt()` trả về gì trong từng trường hợp?**
Cancel/ESC → `null`; OK không nhập → `""`; nhập dấu cách → chuỗi dấu cách. Vì vậy cần kiểm tra `null` trước, rồi `trim()` và so sánh với `""`.

**5. `confirm()` và `alert()` trả về gì?**
`confirm()` trả `true` (OK) hoặc `false` (Cancel/ESC). `alert()` trả `undefined`.

**6. Làm sao để người chưa đủ tuổi không vào được?**
Nội dung game để `hidden` từ đầu; chỉ bỏ `hidden` khi `confirm()` trả `true`. Nhánh `false` thì `alert` từ chối và `return` để dừng luồng.

**7. Hạn chế của cách xác nhận này?**
`confirm()` chỉ là tự khai báo, không xác minh tuổi thật. Ẩn bằng `hidden` chỉ ở phía client, người dùng mở DevTools vẫn xem được nội dung.

**8. Vì sao phải kiểm tra `null` trước khi gọi `trim()`?**
Nếu người dùng bấm Cancel, `prompt()` trả `null`; gọi `null.trim()` sẽ gây lỗi `TypeError: Cannot read properties of null`. Kiểm tra `null` trước giúp tránh lỗi này.

**9. Lỗi `Chào null` trong mã ban đầu xuất phát từ đâu?**
Mã cũ ghép thẳng giá trị `prompt()` vào chuỗi mà không kiểm tra. Khi bấm Cancel, giá trị là `null` nên chuỗi hiển thị thành `"Chào null"`.

**10. `trim()` làm gì? Có thay đổi chuỗi gốc không?**
`trim()` trả về chuỗi mới đã bỏ khoảng trắng (dấu cách, tab, xuống dòng) ở hai đầu. Chuỗi gốc không bị thay đổi vì chuỗi trong JavaScript là bất biến.

**11. `alert`, `prompt`, `confirm` có chặn luồng chạy không?**
Có. Cả ba là hộp thoại đồng bộ (modal): code phía sau dừng lại và trang không tương tác được cho tới khi người dùng đóng hộp thoại.

**12. Vì sao trong `app.js` gọi `runGate` qua `setTimeout(..., 100)`?**
Để trình duyệt kịp vẽ giao diện cơ bản trước khi hộp thoại modal bật lên. Nếu gọi ngay, người dùng có thể thấy hộp thoại trên nền trang trắng.

**13. Thuộc tính `hidden` hoạt động thế nào?**
`hidden` là thuộc tính HTML boolean, tương đương `display: none` nên phần tử không hiển thị. Trong JS có thể bật/tắt bằng `element.hidden = true/false`.

**14. Vì sao dùng `textContent` thay vì `innerHTML` khi hiển thị tên?**
Tên do người dùng nhập. Nếu dùng `innerHTML`, chuỗi như `<img src=x onerror=alert(1)>` sẽ được chạy như HTML (lỗi XSS). `textContent` chỉ hiển thị văn bản thuần nên an toàn.

**15. `defer` có tác dụng với script nội tuyến (inline) không?**
Không. `defer` và `async` chỉ có tác dụng với script có thuộc tính `src` (External JS). Đây là một lý do phải tách mã ra file `app.js`.
