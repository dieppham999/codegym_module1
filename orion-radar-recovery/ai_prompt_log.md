# Nhật ký tương tác AI – Orion Radar Recovery

## Phần 1. Prompt đã thực sự sử dụng

### Prompt 1
- **Công cụ:** Claude Code (VS Code)
- **Ngày:** 2026-11-26
- **Nội dung:**
  > đọc kỹ orion-radar-recovery\README.md và hoàn thành các yêu cầu vào orion-radar-recovery và nhớ file ai_prompt_log.md tự tạo 15 câu hỏi và tự trả lời, console-warning.png hướng dẫn để tao tự chụp
- **Mục đích:** Tạo `radar_system.html`, `app.js`, `error_handling_report.txt` và hướng dẫn chụp ảnh Console.
- **Kết quả:** AI viết toàn bộ mã nguồn, chạy kiểm thử `cleanData()` bằng Node.js (500 máy bay, ~30% lỗi, 0 ngoại lệ) và ghi kết quả vào báo cáo.

_(Bổ sung các prompt thật tiếp theo nếu có.)_

---

## Phần 2. Hỏi đáp ôn tập – 15 câu (ghi chú tự soạn để chuẩn bị vấn đáp, không phải prompt đã gửi AI)

**1. `requestAnimationFrame()` khác `setInterval()` thế nào?**
`requestAnimationFrame` gọi hàm trước lần vẽ lại kế tiếp của trình duyệt (thường 60 lần/giây, đồng bộ với màn hình), tự tạm dừng khi tab bị ẩn nên tiết kiệm tài nguyên. `setInterval` chạy theo thời gian cố định, không đồng bộ với màn hình, dễ bị giật.

**2. Vì sao trong `loop()` lệnh `requestAnimationFrame(loop)` đặt sau khối `try...catch`?**
Để khung tiếp theo luôn được lên lịch, kể cả khi khung hiện tại ném lỗi. Nếu đặt trong `try` sau dòng gây lỗi, lệnh này bị bỏ qua và radar đứng hình.

**3. Hàm `cleanData()` làm nhiệm vụ gì?**
Kiểm tra dữ liệu API trước khi render: nếu không phải mảng thì trả danh sách rỗng; với từng phần tử, chỉ giữ object có `id` hợp lệ và `x`, `y` là số hữu hạn nằm trong radar. Phần tử hỏng bị loại và ghi `console.warn`.

**4. Vì sao dùng `Number.isFinite()` thay vì `isFinite()` hay `!isNaN()`?**
`Number.isFinite()` chỉ trả `true` cho kiểu number hữu hạn, nên loại được `NaN`, `Infinity`, `null`, `undefined` và chuỗi. `isFinite("300")` và `isFinite(null)` trả `true` do tự ép kiểu, nên lọt dữ liệu sai.

**5. Vì sao `typeof null === "object"` là cái bẫy khi validate?**
Đây là lỗi lịch sử của JavaScript. Nếu chỉ kiểm tra `typeof item === "object"`, `null` vẫn lọt qua rồi gây `TypeError` khi đọc `item.x`. Phải kiểm tra `item === null` riêng.

**6. Vì sao phải loại phần tử là mảng?**
`typeof [] === "object"` nên mảng `[x, y]` lọt qua kiểm tra object. Cần `Array.isArray(item)` để loại dữ liệu sai cấu trúc.

**7. Truy cập `x` của `null` gây lỗi gì? Còn `arc()` với `NaN` thì sao?**
`null.x` gây `TypeError: Cannot read properties of null`. `ctx.arc(NaN, ...)` thì không ném lỗi, chỉ không vẽ gì, nên đây là lỗi "im lặng", khó phát hiện nếu không validate.

**8. Đặt `try...catch` bên trong hay bên ngoài vòng lặp? Vì sao?**
Bên trong. Nếu đặt bên ngoài, lỗi ở phần tử thứ k làm thoát cả vòng lặp, các phần tử sau không được xử lý. Đặt bên trong thì chỉ phần tử lỗi bị bỏ qua.

**9. `console.warn()` khác `console.error()` và `console.log()` thế nào?**
`warn` hiển thị nền vàng, dùng cho tình huống bất thường nhưng chương trình vẫn chạy được (như dữ liệu hỏng bị bỏ qua). `error` màu đỏ, dùng cho lỗi nghiêm trọng. `log` là thông tin thường. DevTools có thể lọc theo từng mức.

**10. Công thức kiểm tra click trúng máy bay là gì?**
`d = √((mouseX − x)² + (mouseY − y)²)`. Nếu `d <= r` thì điểm click nằm trong hình tròn của máy bay. Trong code dùng `Math.sqrt(... ** 2 + ... ** 2)`.

**11. Vì sao cần `getBoundingClientRect()` khi xử lý click?**
`event.clientX/Y` tính theo cửa sổ trình duyệt. Trừ `rect.left`/`rect.top` để có tọa độ tương đối với canvas.

**12. Vì sao phải nhân tỷ lệ `canvas.width / rect.width`?**
Canvas có kích thước nội bộ 600×600 nhưng CSS hiển thị nhỏ hơn (ví dụ 520px). Nếu không nhân tỷ lệ, tọa độ chuột lệch so với tọa độ vẽ và click sai máy bay.

**13. Vì sao lưu `selectedId` thay vì lưu object máy bay được chọn?**
Mỗi giây dữ liệu được lấy lại và `cleanData` tạo object mới. Lưu theo `id` giúp giữ trạng thái chọn (màu đỏ) qua các lần cập nhật dữ liệu.

**14. Vì sao khi tìm máy bay được click lại duyệt ngược mảng?**
Máy bay vẽ sau nằm đè lên máy bay vẽ trước. Duyệt ngược giúp chọn đúng máy bay người dùng nhìn thấy ở trên cùng khi các hình tròn chồng nhau.

**15. Làm sao chứng minh radar vẫn chạy với 500 máy bay và 30% dữ liệu lỗi?**
Chọn chế độ Stress test: radar vẫn quay, FPS ổn định, dòng trạng thái hiện số hợp lệ/bị loại (khoảng 350/150), Console chỉ có cảnh báo vàng, không có lỗi đỏ `Uncaught`. Kiểm thử Node.js 100 lượt × 500 máy bay cho 0 ngoại lệ.
