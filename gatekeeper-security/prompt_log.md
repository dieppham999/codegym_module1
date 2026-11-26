# GateKeeper Security – Hỏi đáp ôn tập (15 câu)

**1. Internal JavaScript và External JavaScript khác nhau thế nào?**
Internal JS viết trực tiếp trong thẻ `<script>...</script>` của file HTML. External JS đặt trong file riêng (`security.js`) và nhúng bằng `<script src="security.js">`. External JS dễ bảo trì, tái sử dụng được, trình duyệt có thể cache, và dùng được `defer`/`async`.

**2. HTML Parsing là gì?**
Là quá trình trình duyệt đọc mã HTML từ trên xuống, chuyển thành cây DOM. Chỉ khi các phần tử đã được phân tích thì trình duyệt mới có thể hiển thị chúng và JavaScript mới truy cập được chúng.

**3. Render-blocking là gì? Vì sao script nặng trong `<head>` làm trang chậm hiển thị?**
Khi gặp `<script>` thường (không `defer`/`async`), trình duyệt dừng phân tích HTML để tải và chạy script. Nếu script chạy vòng lặp nặng, `<body>` chưa được phân tích nên người dùng chỉ thấy trang trắng cho tới khi script chạy xong.

**4. `async` và `defer` khác nhau như thế nào?**
Cả hai tải script song song với việc phân tích HTML. `defer` chạy sau khi HTML đã phân tích xong (trước `DOMContentLoaded`) và giữ đúng thứ tự giữa các script. `async` chạy ngay khi tải xong, có thể chen ngang việc phân tích HTML và không bảo đảm thứ tự.

**5. Vì sao dự án chọn `defer`?**
`security.js` cần truy cập phần tử `#status` trong HTML, nên phải chạy sau khi HTML phân tích xong. `async` có thể chạy khi DOM chưa sẵn sàng; `defer` thì luôn bảo đảm điều này.

**6. Khi nào nên dùng `async`?**
Với script độc lập, không phụ thuộc DOM và không phụ thuộc script khác, ví dụ script thống kê truy cập (analytics) hoặc quảng cáo.

**7. Đặt `<script>` cuối `<body>` khác `defer` thế nào?**
Cả hai đều chạy sau khi phần lớn HTML được phân tích. Nhưng script cuối `<body>` chỉ bắt đầu tải khi trình duyệt đọc tới thẻ đó, còn `defer` đặt trong `<head>` được tải sớm, song song với việc phân tích HTML, nên thường nhanh hơn.

**8. `defer` có tác dụng với script nội tuyến không?**
Không. `defer` và `async` chỉ có tác dụng với script có thuộc tính `src`. Đây là một lý do phải tách mã ra file `security.js`.

**9. Vì sao `defer` chưa đủ để bảo đảm giao diện hiện trước khi `prompt()` xuất hiện?**
`defer` chỉ bảo đảm HTML đã phân tích xong, không bảo đảm trình duyệt đã vẽ (paint) lên màn hình. `prompt()` chặn luồng chính, nên nếu gọi ngay thì hộp thoại có thể hiện trên nền trang trắng.

**10. Dự án xử lý thời điểm mở hộp thoại thế nào?**
Gọi `requestAnimationFrame(() => setTimeout(runSecurityCheck, 0))`. `requestAnimationFrame` chạy ngay trước lần vẽ kế tiếp; `setTimeout` bên trong đẩy việc mở hộp thoại ra sau lần vẽ đó, nên người dùng thấy nội dung trước.

**11. `prompt()` trả về gì trong từng trường hợp?**
Nhập nội dung và OK → chuỗi đã nhập. OK mà để trống → chuỗi rỗng `""`. Cancel hoặc ESC → `null`. Giá trị trả về luôn là chuỗi hoặc `null`, kể cả khi nhập số.

**12. Nhấn OK mà không nhập gì khác gì với nhấn Cancel?**
OK để trống trả về `""` (kiểu string), Cancel trả về `null` (kiểu object theo `typeof`). Hai giá trị này đều là falsy, nhưng `"" === null` là `false`. Bài này xử lý cả hai đều là "Truy cập bị từ chối".

**13. Vì sao phải kiểm tra `null` trước khi gọi `trim()`?**
Nếu nhấn Cancel, `input` là `null`; gọi `null.trim()` sẽ gây lỗi `TypeError`. Vì vậy phải kiểm tra `input === null` trước, sau đó mới `trim()` để bắt trường hợp chỉ nhập khoảng trắng.

**14. `confirm()` và `alert()` trả về gì?**
`confirm()` trả `true` khi nhấn OK, `false` khi nhấn Cancel hoặc ESC. `alert()` luôn trả `undefined` vì chỉ dùng để thông báo.

**15. Vì sao không nên lạm dụng `alert()` và `prompt()` trong ứng dụng web hiện đại?**
Chúng chặn luồng chính và toàn bộ trang cho tới khi người dùng đóng hộp thoại. Giao diện không tùy chỉnh được và khác nhau giữa các trình duyệt; trình duyệt có thể cho phép người dùng chặn hộp thoại lặp lại. Chúng cũng không bảo mật (nội dung nhập hiện rõ, không xác minh danh tính thật). Thực tế nên dùng form HTML và modal tự thiết kế, xác thực ở phía server.
