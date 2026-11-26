# GateKeeper Security – Cổng Kiểm Soát An Ninh MegaCorp

## 1. Giới thiệu

**GateKeeper** là bài tập Frontend mô phỏng cổng kiểm soát truy cập hệ thống nội bộ MegaCorp. Nhiệm vụ là cải thiện quá trình tải trang bằng cách tách JavaScript nội bộ thành file riêng và xây dựng luồng xác thực danh tính cơ bản.

> **Lưu ý:** Đây là bài thực hành tương tác trên trình duyệt, không phải hệ thống xác thực bảo mật thực tế. Việc nhập mã và bấm xác nhận không chứng minh danh tính người dùng hay bảo vệ dữ liệu nhạy cảm.

## 2. Mục tiêu học tập

- Phân biệt **Internal JavaScript** và **External JavaScript**.
- Hiểu **HTML Parsing**, **render-blocking** và ảnh hưởng của JavaScript đến quá trình tải trang.
- So sánh `async` và `defer`, lựa chọn cách nhúng script phù hợp.
- Sử dụng `prompt()`, `confirm()` và `alert()` để xử lý luồng tương tác.
- Xử lý đúng các trường hợp người dùng nhấn **Cancel** hoặc để trống dữ liệu.

## 3. Bối cảnh và vấn đề cần giải quyết

Phiên bản cũ đặt một đoạn JavaScript giả lập tác vụ nặng trực tiếp trong `<head>`, khiến trình duyệt tạm dừng phân tích HTML và chậm hiển thị nội dung. Ngoài ra, hệ thống chỉ có thông báo khởi động, chưa có quy trình nhập mã nhân viên và xác nhận đăng nhập.

## 4. Yêu cầu chức năng

### 4.1. Tối ưu tải trang

- Tách JavaScript từ HTML thành file `security.js`.
- Nhúng file JavaScript bằng thuộc tính `defer`.
- Hiển thị nội dung trang gồm tiêu đề `Chào mừng đến với hệ thống nội bộ MegaCorp` và đoạn văn `Nội dung tuyệt mật...`.
- Không giữ vòng lặp nặng chặn luồng chính trong quá trình khởi tạo.
- Đảm bảo nội dung có thể được hiển thị trước khi hộp thoại an ninh xuất hiện. **Lưu ý kỹ thuật:** `defer` bảo đảm script chạy sau khi HTML được phân tích xong, nhưng không tự bảo đảm trình duyệt đã vẽ giao diện trước khi `prompt()` xuất hiện. Cần chủ động bố trí thời điểm mở hộp thoại và kiểm thử thực tế.

### 4.2. Quy trình xác thực ba bước

1. **Prompt:** Yêu cầu nhập `Mã nhân viên`.
2. **Confirm:** Nếu có mã hợp lệ về mặt nhập liệu, hỏi: `Bạn có chắc chắn muốn sử dụng mã [Mã vừa nhập] để đăng nhập không?`.
3. **Alert:** Thông báo kết quả tương ứng.

Quy tắc xử lý:

- Nhấn **Cancel** ở `prompt()` (giá trị `null`) → thông báo `Truy cập bị từ chối` và dừng quy trình.
- Nhấn **OK** nhưng để trống (chuỗi `""`) hoặc chỉ nhập khoảng trắng → thông báo `Truy cập bị từ chối` và dừng quy trình.
- Nhập mã rồi nhấn **OK** ở `confirm()` (`true`) → thông báo `Truy cập thành công!`.
- Nhấn **Cancel** ở `confirm()` (`false`) → thông báo `Hủy đăng nhập`.

## 5. Cấu trúc thư mục

```text
gatekeeper-security/
├── index.html       # Giao diện và thẻ script defer
├── security.js      # Luồng tương tác xác thực
├── prompt_log.md    # Nhật ký câu hỏi sử dụng AI
└── README.md        # Tài liệu dự án
```

## 6. Các bước triển khai

### Bước 1 – Hình thành ý tưởng (10 phút)

- Phân tích mã nguồn cũ và nguyên nhân trang hiển thị chậm.
- Phác thảo flowchart: nhập mã → kiểm tra Cancel/rỗng → xác nhận → thông báo kết quả.

### Bước 2 – Thiết kế (10 phút)

- Thiết kế cấu trúc gồm `index.html` và `security.js`.
- Giải thích lựa chọn `defer` thay cho `async`.
- Xác định thời điểm mở hộp thoại để đáp ứng yêu cầu hiển thị giao diện.

### Bước 3 – Triển khai (20 phút)

- Tạo file `security.js`.
- Xây dựng các nhánh xử lý `prompt()`, `confirm()` và `alert()`.
- Nhúng JavaScript từ file ngoài bằng `defer`.

### Bước 4 – Vận hành và kiểm thử (10 phút)

- Tải lại trang và kiểm tra thời điểm hiển thị giao diện.
- Kiểm thử đầy đủ các trường hợp nhập liệu và hủy thao tác.

## 7. Kịch bản kiểm thử

| STT | Thao tác | Kết quả mong đợi |
|---|---|---|
| 1 | Nhập mã nhân viên → OK → OK ở Confirm | `Truy cập thành công!` |
| 2 | Nhấn Cancel tại Prompt | `Truy cập bị từ chối` |
| 3 | Để trống Prompt → OK | `Truy cập bị từ chối` |
| 4 | Chỉ nhập khoảng trắng → OK | `Truy cập bị từ chối` |
| 5 | Nhập mã → OK → Cancel ở Confirm | `Hủy đăng nhập` |

## 8. Câu hỏi vấn đáp cần chuẩn bị

1. `async` và `defer` khác nhau như thế nào? Vì sao dự án chọn `defer`?
2. Khi dùng `prompt()`, nhấn OK mà không nhập gì khác gì với nhấn Cancel?
3. Vì sao không nên lạm dụng `alert()` và `prompt()` trong ứng dụng web hiện đại?

## 9. Yêu cầu nhật ký AI

File `prompt_log.md` cần ghi lại **ít nhất hai câu hỏi thực tế đã trao đổi với AI**, tập trung vào:

- Sự khác biệt giữa `async` và `defer`, tác động đến HTML Parsing và render-blocking.
- Cách `prompt()` trả về dữ liệu khi nhấn OK, Cancel hoặc nhập chuỗi rỗng.

Mỗi mục nên có câu hỏi, tóm tắt câu trả lời và lý do đặt câu hỏi. Chỉ ghi những tương tác thực sự đã diễn ra; không tạo lịch sử giả.

## 10. Tiêu chí đánh giá

| Tiêu chí | Tỷ trọng | Nội dung |
|---|---:|---|
| Chất lượng sản phẩm | 40% | Tách JS, tối ưu hiển thị, xử lý đủ ba hộp thoại và các trường hợp Cancel/rỗng |
| Bảo vệ mã nguồn – vấn đáp | 40% | Giải thích `async`/`defer`, `null`/chuỗi rỗng và hạn chế của hộp thoại trình duyệt |
| Kỹ năng tương tác AI – Prompt Log | 20% | Câu hỏi tập trung vào lý thuyết, thể hiện khả năng tự phân tích |

## 11. Hướng dẫn chạy và nộp bài

1. Mở `index.html` trong trình duyệt hoặc sử dụng Live Server trong VS Code.
2. Tải lại trang, kiểm tra nội dung và toàn bộ các kịch bản ở mục 7.
3. Hoàn thiện `prompt_log.md` dựa trên lịch sử trao đổi thực tế.
4. Nén thư mục dự án thành `gatekeeper-security.zip`.
5. Nộp file ZIP gồm `index.html`, `security.js`, `prompt_log.md` và `README.md`.

**Lưu ý:** Đề bài yêu cầu ba file đầu tiên; `README.md` là tài liệu bổ sung để trình bày dự án rõ ràng hơn.
