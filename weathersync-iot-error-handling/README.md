# WeatherSync - IoT Error Handling

## 1. Giới thiệu dự án

**Bài tập:** Giải cứu Trạm quan trắc IoT - Dự án WeatherSync

**Ngôn ngữ:** JavaScript

Hệ thống WeatherSync nhận dữ liệu từ hàng ngàn cảm biến IoT. Một số cảm biến gửi dữ liệu sai kiểu, thiếu trường hoặc có giá trị bất thường. Legacy Code không kiểm tra dữ liệu và không xử lý ngoại lệ, khiến một lỗi có thể làm gián đoạn toàn bộ quá trình xử lý.

**Nhiệm vụ:** Refactor hàm `processWeatherData()` để phát hiện dữ liệu lỗi, ghi log và tiếp tục xử lý các cảm biến còn lại.

## 2. Mục tiêu

- Đọc hiểu Stack Trace, nhận diện TypeError và ReferenceError.
- Sử dụng `try...catch...finally` và `throw` để kiểm soát ngoại lệ.
- Kiểm tra dữ liệu bằng `typeof` trước khi gọi phương thức.
- Sử dụng `console.log()`, `console.warn()` và `console.error()` để truy vết lỗi.
- Sử dụng Breakpoint trong DevTools để kiểm tra lỗi.

## 3. Yêu cầu chức năng

- Kiểm tra phần tử cảm biến có phải Object hợp lệ hay không.
- Kiểm tra nhiệt độ có kiểu `number`, không phải `null`, `undefined`, `NaN` hoặc giá trị vô hạn.
- Phát hiện trường dữ liệu bắt buộc bị thiếu, bao gồm độ ẩm theo bối cảnh đề bài.
- Chủ động ném lỗi bằng `throw new Error()` khi nhiệt độ vượt ngưỡng nghiệp vụ, ví dụ dưới -50°C hoặc trên 100°C.
- Một cảm biến lỗi không được làm gián đoạn việc xử lý các cảm biến còn lại.
- Ghi log lỗi kèm ID cảm biến khi xác định được.
- Dùng `finally` để ghi log "Đã quét qua cảm biến [ID]" bất kể thành công hay thất bại.
- In thông báo `--- HOÀN THÀNH XỬ LÝ DỮ LIỆU ---` sau khi xử lý hết danh sách.

## 4. Dữ liệu mẫu và Legacy Code

```javascript
const sensorData = [
    { id: "S1", temp: 32.5, humidity: 80 },
    { id: "S2", temp: null, humidity: 90 },
    { id: "S3", temp: 35.1, humidity: 75 },
    { id: "S4", temp: 40.2 },
    "Tôi là hacker, tôi gửi chuỗi thay vì object",
    { id: "S5", temp: 28.0, humidity: 60 }
];

function processWeatherData(dataList) {
    console.log("--- BẮT ĐẦU XỬ LÝ DỮ LIỆU ---");
    dataList.forEach(sensor => {
        let formattedTemp = sensor.temp.toFixed(1);
        console.log(`Cảm biến ${sensor.id}: Nhiệt độ là ${formattedTemp}°C`);
    });
    console.log("--- HOÀN THÀNH XỬ LÝ DỮ LIỆU ---");
}

processWeatherData(sensorData);
```

## 5. Các bước triển khai

### Bước 1: Phân tích Legacy Code (10 phút)

- Chạy mã nguồn ban đầu trên trình duyệt hoặc Node.js.
- Đọc thông báo lỗi trong Console và xác định object gây lỗi.
- Viết báo cáo ngắn về hai nguyên nhân cốt lõi khiến hệ thống dừng hoạt động.

### Bước 2: Thiết kế (15 phút)

- Xem xét đặt `try...catch` bên trong hoặc bên ngoài vòng lặp `forEach`.
- Định nghĩa các quy tắc Validation và điều kiện chủ động ném lỗi.
- Viết mã giả thể hiện luồng xử lý và vị trí đặt khối xử lý ngoại lệ.

### Bước 3: Triển khai (25 phút)

- Refactor hàm `processWeatherData()`.
- Kiểm tra kiểu dữ liệu trước khi gọi phương thức.
- Đặt `try...catch...finally` đúng vị trí.
- Ghi log lỗi, ID cảm biến và thông báo đã quét qua cảm biến.

### Bước 4: Kiểm thử và Debugging (10 phút)

- Kiểm tra chương trình chạy hết danh sách và in thông báo hoàn thành.
- Mở DevTools > Sources, đặt Breakpoint tại khối `catch`.
- Kiểm tra `error.message` và `error.stack`.
- Thử nghiệm với dữ liệu bất thường do AI tạo.

## 6. Yêu cầu kiểm thử

| Trường hợp | Kết quả mong đợi |
|---|---|
| Nhiệt độ hợp lệ | Hiển thị nhiệt độ |
| Nhiệt độ null hoặc undefined | Ghi lỗi/cảnh báo |
| Nhiệt độ dạng chuỗi | Ghi lỗi/cảnh báo |
| Thiếu trường dữ liệu bắt buộc | Ghi lỗi/cảnh báo |
| Nhiệt độ dưới -50°C hoặc trên 100°C | Ném lỗi nghiệp vụ |
| Nhiệt độ đúng ngưỡng -50°C hoặc 100°C | Chấp nhận nếu các trường khác hợp lệ |
| Nhiệt độ NaN hoặc Infinity | Ghi lỗi/cảnh báo |
| Phần tử là chuỗi hoặc null | Ghi lỗi/cảnh báo |
| Cảm biến hợp lệ sau cảm biến lỗi | Tiếp tục xử lý |
| Kết thúc danh sách | In thông báo hoàn thành |

## 7. Tiêu chí đánh giá

### Chất lượng sản phẩm - Code Logic (40%)

- Khả năng chịu lỗi: vòng lặp xử lý đến phần tử cuối cùng.
- Tính chủ động: sử dụng ít nhất một câu lệnh `throw new Error()`.
- Logging sạch: phân biệt thông tin bình thường và lỗi/cảnh báo.

### Bảo vệ mã nguồn - Vấn đáp (40%)

1. Tại sao đặt `try...catch` bên trong vòng lặp thay vì bọc toàn bộ vòng lặp?
2. SyntaxError và TypeError khác nhau như thế nào? Có thể dùng `try...catch` để bắt lỗi sai cú pháp khi viết code không?
3. Khối `finally` có tác dụng gì? Nếu trong `try` có lệnh `return`, `finally` có được chạy không?

### Kỹ năng tương tác AI - Prompt Log (20%)

- Sử dụng AI để giải nghĩa thông báo lỗi và phân tích Stack Trace.
- Yêu cầu AI sinh dữ liệu JSON lỗi và các Edge Cases.
- Tìm hiểu cách sử dụng Breakpoint trong DevTools.
- Ghi lại prompt và lý do sử dụng.
- Không yêu cầu AI viết toàn bộ khối `try...catch` thay học viên.
- Giải thích được lý do lựa chọn vị trí đặt `try...catch`.

## 8. Cấu trúc dự án dự kiến

```text
weathersync-iot-error-handling/
├── README.md
├── weather_dashboard.js
├── debug_report.txt
├── ai_prompt_log.md
└── screenshots/
    └── console-debug.png
```

## 9. Hướng dẫn chạy

Sử dụng Node.js:

```bash
node weather_dashboard.js
```

Hoặc chạy mã JavaScript trên trình duyệt thông qua DevTools.

## 10. Sản phẩm cần nộp

- `weather_dashboard.js`: mã nguồn đã refactor, có chú thích Validation và Error Handling.
- `debug_report.txt` hoặc ảnh chụp Console: bằng chứng chương trình chạy hoàn tất và ghi log lỗi có kiểm soát.
- `ai_prompt_log.md`: nhật ký tương tác AI, đính kèm JSON dữ liệu lỗi dùng để kiểm thử.

## 11. Checklist hoàn thành

- [x] Phân tích hai nguyên nhân lỗi Legacy Code.
- [x] Viết mã giả thiết kế giải pháp.
- [x] Refactor hàm processWeatherData().
- [x] Bổ sung Validation và throw new Error().
- [x] Sử dụng try...catch...finally.
- [x] Xử lý hết danh sách dù có dữ liệu lỗi.
- [x] In thông báo hoàn thành.
- [ ] Kiểm thử Edge Cases và sử dụng Breakpoint.
- [x] Bổ sung báo cáo hoặc ảnh chụp Console.
- [ ] Hoàn thiện AI Prompt Log.
- [ ] Chuẩn bị trả lời các câu hỏi vấn đáp.

## 12. Kết quả mong đợi

WeatherSync có khả năng phát hiện dữ liệu không hợp lệ, ghi nhật ký lỗi và tiếp tục xử lý các cảm biến còn lại, nâng cao khả năng chịu lỗi và bảo trì hệ thống.
