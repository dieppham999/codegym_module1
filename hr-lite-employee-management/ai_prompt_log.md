# Nhật ký tương tác AI – HR-Lite

**1. `document.querySelector()` khác `getElementById()` thế nào?**
`querySelector` nhận CSS selector bất kỳ (`#id`, `.class`, `tag`, `[attr]`...) và trả về phần tử đầu tiên khớp hoặc `null`. `getElementById` chỉ tìm theo id nhưng nhanh hơn một chút.

**2. Vì sao phải gọi `event.preventDefault()` trong sự kiện `submit`?**
Mặc định form submit sẽ gửi dữ liệu và tải lại trang, làm mất toàn bộ mảng `employees` trong bộ nhớ. `preventDefault()` chặn hành vi đó để xử lý bằng JS.

**3. Sự kiện `input` khác `change` thế nào? Vì sao tìm kiếm dùng `input`?**
`input` kích hoạt mỗi lần giá trị thay đổi (mỗi phím gõ); `change` chỉ kích hoạt khi ô mất focus hoặc nhấn Enter. Tìm kiếm thời gian thực cần `input`.

**4. Tìm kiếm không phân biệt hoa/thường làm thế nào?**
Chuyển cả tên nhân viên và từ khóa về `toLowerCase()` rồi so sánh bằng `includes()`.

**5. `push()` trả về gì? Có thay đổi mảng gốc không?**
Có, `push()` thêm phần tử vào cuối và thay đổi mảng gốc; giá trị trả về là độ dài mới của mảng.

**6. `map()` dùng ở đâu trong bài?**
(1) Biến mỗi nhân viên thành chuỗi HTML `<tr>` rồi `join("")` để gán vào `innerHTML`. (2) Cập nhật nhân viên: trả về object mới cho nhân viên có `id` trùng, giữ nguyên các nhân viên khác.

**7. Vì sao sau `map()` phải gọi `join("")`?**
`map()` trả về mảng chuỗi. Gán thẳng mảng vào `innerHTML` sẽ tự chuyển thành chuỗi có dấu phẩy ngăn cách, làm xuất hiện dấu `,` trên giao diện.

**8. Xóa nhân viên bằng `filter()` như thế nào?**
`employees = employees.filter(e => e.id !== id)` tạo mảng mới chỉ giữ các nhân viên có id khác id cần xóa. `filter()` không thay đổi mảng gốc nên phải gán lại.

**9. `reduce()` tính tổng lương ra sao? Vì sao cần giá trị khởi tạo `0`?**
`employees.reduce((sum, e) => sum + e.salary, 0)`. Không có `0`, phần tử đầu (một object) sẽ thành `sum` ban đầu → kết quả sai; với mảng rỗng còn ném lỗi `TypeError`.

**10. Vì sao tổng quỹ lương tính trên toàn bộ `employees` chứ không phải danh sách đang lọc?**
Yêu cầu là tổng quỹ lương của toàn bộ nhân viên; tìm kiếm chỉ thay đổi phần hiển thị, không thay đổi dữ liệu.

**11. Kiểm tra dữ liệu đầu vào gồm những gì?**
Tên sau `trim()` không được rỗng; lương phải nhập, phải là số hữu hạn (`Number.isFinite`) và không âm. Lỗi hiển thị trên trang thay vì `alert`.

**12. Event delegation là gì? Vì sao dùng cho nút Sửa/Xóa?**
Gắn một listener lên phần tử cha (`tbody`) và dùng `event.target.closest("button[data-action]")` để biết nút nào được bấm. Các dòng được render lại liên tục nên nếu gắn listener cho từng nút sẽ phải gắn lại sau mỗi lần render.

**13. `data-id` và `dataset` dùng để làm gì?**
Thuộc tính `data-*` lưu dữ liệu tùy ý trên phần tử HTML. Trong JS đọc qua `btn.dataset.id` (luôn là chuỗi, nên cần `Number()` để so sánh với id số).

**14. Vì sao phải escape HTML trước khi đưa tên vào `innerHTML`?**
Tên do người dùng nhập; nếu nhập `<img src=x onerror=alert(1)>` mà không escape sẽ chạy mã độc (XSS). Hàm `escapeHtml` thay `& < > " '` bằng thực thể HTML.

**15. Chức năng cập nhật (sửa) hoạt động như thế nào?**
Bấm "Sửa" → đổ dữ liệu vào form và lưu id vào ô ẩn `#employee-id`. Khi submit, nếu có id thì cập nhật bằng `map()`, ngược lại thêm mới bằng `push()`. Sau đó `resetForm()` và `render()` lại.
