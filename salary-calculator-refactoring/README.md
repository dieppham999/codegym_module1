# Tái cấu trúc hệ thống tính lương

## Giới thiệu

Dự án thực hành JavaScript nhằm khắc phục lỗi ghi đè thuế suất và sai công thức tính lương của hệ thống Freelancer.

## Mục tiêu

- Hiểu Hoisting, Block Scope, Temporal Dead Zone (TDZ) và sự khác biệt giữa `var`, `let`, `const`.
- Nắm vững thứ tự ưu tiên toán tử số học.
- Tái cấu trúc mã nguồn để đảm bảo tính chính xác và dễ bảo trì.

## Yêu cầu thực hiện

1. **Phân tích:** Xác định nguyên nhân ghi đè biến, lỗi phạm vi và lỗi công thức tính lương.
2. **Thiết kế:** Phân loại biến, lập bảng khai báo biến và xác định công thức tính lương.
3. **Triển khai:** Loại bỏ toàn bộ `var`, sử dụng `let` và `const` hợp lý, bổ sung ngoặc đơn và áp dụng toán tử gán `+=`, `-=`.
4. **Kiểm thử:** Kiểm tra dữ liệu thập phân, số âm và giá trị lớn; đảm bảo kết quả chính xác đến hai chữ số thập phân.

## Công thức tính lương

Theo cách tính thuế trên lương cơ bản trong mã mẫu:

- Lương tăng ca = Số giờ tăng ca × Hệ số tăng ca.
- Tiền thuế = Lương cơ bản × Thuế suất.
- Lương thực nhận = (Lương cơ bản + Lương tăng ca) − Tiền thuế.

## Cấu trúc dự án

```text
salary-calculator-refactoring/
├── README.md
├── salary_calculator.js
└── ai_prompt_log.md
```

## Chạy chương trình

Sử dụng Node.js:

```bash
node salary_calculator.js
```

## Tiêu chí đánh giá

| Nội dung | Tỷ trọng |
|---|---:|
| Mã nguồn: khai báo biến hợp lý, công thức chính xác | 50% |
| Bảo vệ mã nguồn: giải thích phạm vi biến và thứ tự toán tử | 30% |
| Nhật ký prompt AI | 20% |

## Quy tắc sử dụng AI

- Sử dụng AI để giải thích kiến thức, phân tích lỗi và tạo dữ liệu kiểm thử.
- Không yêu cầu AI sửa toàn bộ mã nguồn thay cho học viên.
- Học viên tự viết và giải thích các khai báo `const` và dấu ngoặc đơn trong biểu thức toán học.

## Sản phẩm nộp bài

- Mã nguồn `salary_calculator.js`.
- Nhật ký prompt `ai_prompt_log.md`.
- Đường dẫn repository GitHub chứa bài thực hành.
