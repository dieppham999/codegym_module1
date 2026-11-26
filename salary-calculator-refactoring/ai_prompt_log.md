# Tái cấu trúc hệ thống tính lương – Hỏi đáp ôn tập (15 câu)

**1. Vì sao mã mẫu in ra 4015 thay vì 4515?**
`var taxRate = 0.2` khai báo lại và ghi đè `taxRate = 0.1`, nên thuế tính 20% (1000) thay vì 10% (500): 5000 + 15 − 1000 = 4015.

**2. Vì sao `var` cho phép khai báo lại mà không báo lỗi?**
Đó là thiết kế cũ của JavaScript: `var` cùng tên trong cùng phạm vi chỉ là một biến, lần khai báo sau chỉ gán đè giá trị. `let` và `const` không cho khai báo lại trong cùng phạm vi.

**3. Đổi `var taxRate` thành `const` thì chuyện gì xảy ra với dòng `taxRate = 0.2`?**
Nếu khai báo lại (`const taxRate = 0.2`) → `SyntaxError: Identifier 'taxRate' has already been declared` ngay khi chạy. Nếu gán lại (`taxRate = 0.2`) → `TypeError: Assignment to constant variable`. Cả hai đều giúp phát hiện lỗi thay vì âm thầm tính sai.

**4. Hoisting là gì?**
Trước khi chạy, JavaScript "đưa" phần khai báo biến/hàm lên đầu phạm vi. `var` được hoisting và khởi tạo bằng `undefined`, nên dùng trước khi khai báo cho ra `undefined`. `let`/`const` cũng được hoisting nhưng không được khởi tạo.

**5. Temporal Dead Zone (TDZ) là gì?**
Là khoảng từ đầu phạm vi tới dòng khai báo `let`/`const`. Truy cập biến trong khoảng này ném `ReferenceError: Cannot access 'x' before initialization`, giúp phát hiện lỗi dùng biến quá sớm.

**6. Block scope khác function scope thế nào?**
`let`/`const` chỉ tồn tại trong cặp `{}` gần nhất (if, for, khối lệnh). `var` chỉ bị giới hạn bởi hàm, nên `var` khai báo trong `if` vẫn dùng được ngoài `if` và có thể ghi đè biến cùng tên bên ngoài.

**7. Khi nào dùng `const`, khi nào dùng `let`?**
Mặc định dùng `const` cho giá trị không gán lại (thuế suất, dữ liệu đầu vào, kết quả trung gian). Chỉ dùng `let` khi biến cần thay đổi, như `finalSalary` được cộng/trừ dần.

**8. `const` có làm object không thay đổi được không?**
Không. `const` chỉ cấm gán lại biến; thuộc tính bên trong object/mảng vẫn sửa được. Muốn khóa nội dung phải dùng `Object.freeze()`.

**9. Thứ tự ưu tiên toán tử số học trong JavaScript?**
`()` → `**` → `*`, `/`, `%` → `+`, `-`. Các phép cùng mức tính từ trái sang phải (riêng `**` từ phải sang trái).

**10. Biểu thức mẫu `baseSalary + overTimeHours * bonusRate - baseSalary * taxRate` có sai thứ tự không?**
Về số học thì không: JS tính `overTimeHours * bonusRate` và `baseSalary * taxRate` trước, sau đó cộng/trừ từ trái sang phải, đúng với công thức. Nhưng không có ngoặc nên khó đọc và dễ sửa sai, vì vậy viết lại thành `(baseSalary + (overTimeHours * bonusRate)) - (baseSalary * taxRate)` hoặc tách biến trung gian.

**11. Nếu bỏ ngoặc sai chỗ thì kết quả có thể sai thế nào?**
Ví dụ `(baseSalary + overTimeHours) * bonusRate - ...` sẽ nhân cả lương cơ bản với hệ số: (5000 + 10) × 1.5 = 7515 trước khi trừ thuế, sai hoàn toàn.

**12. Toán tử `+=` và `-=` hoạt động thế nào?**
`a += b` tương đương `a = a + b`; `a -= b` tương đương `a = a - b`. Bài dùng: `finalSalary = baseSalary; finalSalary += overtimePay; finalSalary -= taxAmount;`, nên biến phải khai báo bằng `let`.

**13. Vì sao `0.1 + 0.2` không bằng `0.3`? Xử lý thế nào?**
Số trong JS là số dấu phẩy động nhị phân (IEEE 754), không biểu diễn chính xác 0.1 và 0.2, nên kết quả là `0.30000000000000004`. Làm tròn tiền bằng `Math.round((x + Number.EPSILON) * 100) / 100` và hiển thị bằng `toFixed(2)`.

**14. Vì sao cần `Number.EPSILON` khi làm tròn?**
`1.005 * 100` thực tế là `100.49999…`, `Math.round` cho 100 → 1.00 (sai). Cộng `Number.EPSILON` bù phần sai số nhỏ để làm tròn đúng thành 1.01.

**15. Kiểm thử số âm và giá trị lớn để làm gì?**
Lương, giờ tăng ca, hệ số âm là dữ liệu vô lý nên phải báo lỗi (`RangeError`) thay vì tính ra số sai. Giá trị lớn hơn `Number.MAX_SAFE_INTEGER` (2^53 − 1) sẽ mất độ chính xác số nguyên, nên cũng được chặn. Chương trình chạy 16/16 ca kiểm thử đạt.
