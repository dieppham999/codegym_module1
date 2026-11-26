# WeatherSync IoT Error Handling – Hỏi đáp ôn tập (15 câu)

**1. Vì sao Legacy Code dừng ngay ở cảm biến S2?**
S2 có `temp: null`. Lệnh `sensor.temp.toFixed(1)` gọi phương thức trên `null` nên ném `TypeError: Cannot read properties of null (reading 'toFixed')`. Không có `try...catch` nên lỗi lan lên cấp cao nhất và dừng toàn bộ chương trình; S3, S4, S5 và dòng "HOÀN THÀNH" không được chạy.

**2. Hai nguyên nhân cốt lõi khiến hệ thống ngừng hoạt động là gì?**
(1) Không kiểm tra dữ liệu: gọi `.toFixed()` mà không chắc `temp` là number và đọc `.temp` từ phần tử không phải object. (2) Không xử lý ngoại lệ: một lỗi trong vòng lặp làm dừng cả chương trình.

**3. Đọc Stack Trace như thế nào?**
Dòng đầu cho biết loại lỗi và thông điệp. Các dòng `at ...` bên dưới là chuỗi lời gọi hàm, dòng trên cùng là nơi lỗi xảy ra (ví dụ `legacy.js:13:41` là dòng 13, cột 41). Đọc từ trên xuống để biết lỗi ở đâu, từ dưới lên để biết lời gọi bắt đầu từ đâu.

**4. TypeError và ReferenceError khác nhau thế nào?**
`TypeError` xảy ra khi thao tác trên giá trị sai kiểu, ví dụ gọi phương thức của `null`/`undefined`. `ReferenceError` xảy ra khi dùng biến chưa được khai báo, ví dụ gõ sai tên biến `sensr.id`.

**5. SyntaxError khác TypeError thế nào? `try...catch` có bắt được lỗi sai cú pháp không?**
`SyntaxError` là lỗi viết sai cú pháp, được phát hiện khi trình duyệt/Node phân tích mã, trước khi chạy, nên `try...catch` trong cùng file không bắt được. `TypeError` là lỗi lúc chạy (runtime) nên bắt được. Ngoại lệ: lỗi cú pháp trong dữ liệu được phân tích lúc chạy, như `JSON.parse("{sai")`, thì bắt được.

**6. Vì sao đặt `try...catch` bên trong vòng lặp thay vì bọc toàn bộ vòng lặp?**
Nếu bọc ngoài, khi S2 lỗi, chương trình nhảy thẳng ra `catch` và thoát khỏi `forEach`, các cảm biến sau không được xử lý. Đặt bên trong callback thì mỗi cảm biến có `try...catch` riêng: lỗi chỉ dừng cảm biến đó, vòng lặp tiếp tục với phần tử kế tiếp.

**7. Khối `finally` có tác dụng gì?**
`finally` luôn chạy sau `try`/`catch`, bất kể thành công hay có lỗi. Bài này dùng `finally` để in "Đã quét qua cảm biến [ID]" cho mọi cảm biến. Thực tế `finally` thường dùng để dọn dẹp: đóng file, đóng kết nối, tắt trạng thái loading.

**8. Nếu trong `try` có `return`, `finally` có chạy không?**
Có. `finally` vẫn chạy trước khi hàm thực sự trả về. Nếu `finally` cũng có `return` thì giá trị đó sẽ ghi đè giá trị `return` trong `try`, vì vậy không nên `return` trong `finally`.

**9. Vì sao phải kiểm tra bằng `typeof` trước khi gọi `toFixed()`?**
`toFixed()` chỉ tồn tại trên number. Kiểm tra `typeof sensor.temp === "number"` trước giúp loại `null`, `undefined`, chuỗi, boolean, tránh `TypeError` và tạo được thông báo lỗi rõ ràng hơn.

**10. Vì sao `typeof` thôi chưa đủ để kiểm tra nhiệt độ?**
`typeof NaN` và `typeof Infinity` đều là `"number"`. Cần thêm `Number.isFinite(temp)` để loại `NaN`, `Infinity`, `-Infinity`.

**11. Vì sao kiểm tra phần tử là object phải loại riêng `null` và mảng?**
`typeof null === "object"` (lỗi lịch sử của JavaScript) và `typeof [] === "object"`. Vì vậy điều kiện đúng là `sensor !== null && typeof sensor === "object" && !Array.isArray(sensor)`.

**12. Kiểm tra thiếu trường bắt buộc như thế nào? Vì sao không dùng `if (!sensor.temp)`?**
Dùng toán tử `in`: `"humidity" in sensor`. Không dùng `!sensor.temp` vì nhiệt độ `0` là falsy, sẽ bị coi nhầm là thiếu dữ liệu, trong khi 0°C là giá trị hợp lệ.

**13. Khi nào chủ động `throw new Error()`? Nhiệt độ đúng -50 hoặc 100 thì sao?**
Khi dữ liệu đúng kiểu nhưng vi phạm quy tắc nghiệp vụ: nhiệt độ dưới -50°C hoặc trên 100°C. Điều kiện là `temp < -50 || temp > 100`, nên đúng ngưỡng -50 và 100 vẫn được chấp nhận. `throw` chuyển ngay luồng chạy sang khối `catch`.

**14. Phân biệt `console.log`, `console.warn`, `console.error` trong bài?**
`console.log`: thông tin bình thường (nhiệt độ hợp lệ, đã quét, bắt đầu/hoàn thành). `console.warn` (màu vàng): dữ liệu sai kiểu hoặc thiếu trường. `console.error` (màu đỏ): lỗi nghiệp vụ vượt ngưỡng. DevTools lọc được theo từng mức, giúp log "sạch" và dễ truy vết.

**15. Dùng Breakpoint trong DevTools để debug khối `catch` như thế nào?**
Mở DevTools > Sources, click số dòng trong khối `catch` để đặt Breakpoint, rồi chạy lại. Chương trình dừng tại đó; ở khung Scope xem `error.message`, `error.stack`, `sensor`, `index`. Nhấn F8 (Resume) để chạy tới cảm biến lỗi tiếp theo, F10 để chạy từng dòng.
