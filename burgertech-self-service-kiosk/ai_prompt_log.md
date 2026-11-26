# Nhật ký tương tác AI – BurgerTech Self-Service Kiosk

## Hỏi đáp ôn tập – 15 câu

**1. Vì sao form bị tải lại trang khi gửi? Sửa thế nào?**
Hành vi mặc định của `<form>` khi submit là gửi dữ liệu tới `action` và tải lại trang, làm mất giỏ hàng trong bộ nhớ. Gọi `event.preventDefault()` trong listener `submit` để chặn hành vi đó.

**2. Vì sao lắng nghe `submit` trên form thay vì `click` trên nút "Thêm"?**
`submit` kích hoạt cả khi bấm nút lẫn khi nhấn Enter trong ô input, nên chỉ cần một chỗ xử lý. Nghe `click` trên nút sẽ bỏ sót trường hợp nhấn Enter.

**3. Event Delegation là gì? Vì sao gắn `click` lên `<ul>` thay vì từng nút Xóa?**
Là gắn một listener lên phần tử cha và dựa vào sự nổi bọt (bubbling) của sự kiện để xử lý cho các phần tử con. Nút Xóa được tạo động mỗi lần thêm món; gắn trên `#cartList` thì nút tạo sau vẫn hoạt động, không phải gắn lại, tốn ít bộ nhớ hơn và không bị rò rỉ listener khi xóa `<li>`.

**4. Event Bubbling là gì?**
Khi sự kiện xảy ra trên một phần tử, nó lần lượt được truyền lên các phần tử cha (`button` → `li` → `ul` → `body` → `document`). Nhờ đó listener trên `<ul>` nhận được click từ nút Xóa bên trong.

**5. `event.target` khác `event.currentTarget` thế nào?**
`target` là phần tử thực sự bị click (có thể là nút Xóa). `currentTarget` là phần tử đang gắn listener (`#cartList`). Trong delegation dùng `target` để biết người dùng bấm vào đâu.

**6. Vì sao dùng `event.target.closest(".delete-btn")` thay vì so sánh `event.target` trực tiếp?**
Nếu nút có phần tử con (icon, `<span>`), `target` có thể là phần tử con đó. `closest()` đi ngược lên tổ tiên để tìm đúng nút, và trả `null` nếu click không nằm trong nút Xóa.

**7. Đối tượng `event` chứa những thông tin quan trọng nào?**
`type` (loại sự kiện), `target`, `currentTarget`, `preventDefault()`, `stopPropagation()`; với chuột có `clientX/clientY`, `button`, `relatedTarget`; với bàn phím có `key`, `code`, `repeat`, `ctrlKey/shiftKey/altKey`.

**8. Phân biệt phím `Enter` và `Space` bằng thuộc tính nào?**
`event.key`: `"Enter"` và `" "` (một dấu cách). Hoặc `event.code`: `"Enter"` và `"Space"`. `key` là ký tự/ý nghĩa của phím, `code` là vị trí vật lý của phím trên bàn phím.

**9. Vì sao nhấn Enter trong ô nhập không thanh toán?**
Listener `keydown` kiểm tra `event.target.closest("#orderForm")`: nếu đang nhập trong form thì `return`, để Enter làm đúng việc mặc định là submit form (thêm món). Nhờ vậy Enter không vừa thêm món vừa thanh toán.

**10. Vì sao bỏ qua Enter khi đang focus vào một nút? Còn `event.repeat` để làm gì?**
Khi nút đang focus, trình duyệt tự biến Enter thành `click` trên nút đó. Nếu `keydown` cũng gọi `checkout()` thì sẽ thanh toán 2 lần. `event.repeat` là `true` khi giữ phím, dùng để chặn thanh toán lặp lại.

**11. So sánh `textContent`, `innerText` và `innerHTML`.**
`textContent` đọc/ghi văn bản thuần, nhanh, không phụ thuộc CSS. `innerText` cũng là văn bản nhưng tính theo hiển thị (bỏ phần bị ẩn, gây reflow nên chậm hơn). `innerHTML` đọc/ghi chuỗi HTML, sẽ phân tích thẻ nên có nguy cơ XSS nếu chèn dữ liệu người dùng. Bài này dùng `textContent` cho tên món.

**12. Tạo phần tử món mới như thế nào?**
`document.createElement("li")`, gán `textContent` cho tên và giá, tạo nút Xóa, ghép bằng `li.append(...)`, rồi `cartList.appendChild(li)`. Mỗi `<li>` có `data-id` để liên kết với phần tử trong mảng `cart`.

**13. Làm sao đảm bảo nút Xóa chỉ xóa đúng món, kể cả khi click liên tục?**
Xóa theo `id` duy nhất (lưu ở `data-id`), không theo vị trí (index). Khi xóa: `cart.filter(item => item.id !== id)` và `li.remove()`. Index thay đổi sau mỗi lần xóa nên dùng index dễ xóa nhầm món.

**14. Hiệu ứng hover làm bằng sự kiện nào? Vì sao không dùng `mouseenter`?**
Dùng `mouseover`/`mouseout` gắn trên `<ul>` để bật/tắt class `hovered`. `mouseenter`/`mouseleave` không nổi bọt nên không dùng được delegation. Kiểm tra `li.contains(event.relatedTarget)` để không tắt màu khi chuột chỉ di chuyển giữa các phần tử con trong cùng `<li>`.

**15. Làm sao để giỏ hàng và giao diện luôn đồng bộ?**
Mảng `cart` là nguồn dữ liệu duy nhất. Mọi thao tác (thêm, xóa, xóa toàn bộ, thanh toán) đều cập nhật `cart` và DOM cùng lúc, rồi gọi `updateSummary()` để tính lại tổng tiền bằng `reduce()` và cập nhật trạng thái giỏ trống.
