"use strict";
// Tái cấu trúc hệ thống tính lương Freelancer
// Chạy: node salary_calculator.js

/* =====================================================================
 * 1. PHÂN TÍCH MÃ MẪU
 * ---------------------------------------------------------------------
 *   var taxRate = 0.1;
 *   var baseSalary = 5000;
 *   var overTimeHours = 10;
 *   var bonusRate = 1.5;
 *   var taxRate = 0.2;                                  // LỖI 1
 *   var finalSalary = baseSalary + overTimeHours * bonusRate - baseSalary * taxRate;  // LỖI 2
 *   console.log("Lương thực nhận: " + finalSalary);
 *
 * Kết quả chạy thực tế (Node.js): "Lương thực nhận: 4015"
 * Kết quả đúng với thuế 10%:      (5000 + 10 × 1.5) − 5000 × 0.1 = 4515
 * -> Sai lệch 500 do thuế bị tính 20% thay vì 10%.
 *
 * LỖI 1 – Ghi đè biến do `var`:
 *   `var` cho phép khai báo lại cùng một tên mà không báo lỗi, nên
 *   `var taxRate = 0.2` âm thầm ghi đè `taxRate = 0.1`. Trong hệ thống lớn,
 *   dòng khai báo lại có thể nằm ở file/đoạn khác nên rất khó phát hiện.
 *   Ngoài ra `var`:
 *     - có function scope, không có block scope: `var` khai báo trong if/for
 *       vẫn "lọt" ra ngoài khối;
 *     - được hoisting với giá trị undefined: dùng trước khi khai báo không báo
 *       lỗi mà cho undefined -> phép tính ra NaN.
 *   Với `const`, khai báo lại sẽ báo ngay khi chạy:
 *     SyntaxError: Identifier 'taxRate' has already been declared
 *   (đã chạy thử thực tế). `let`/`const` cũng có block scope và Temporal Dead
 *   Zone (TDZ): dùng trước dòng khai báo sẽ ném ReferenceError thay vì undefined.
 *
 * LỖI 2 – Thứ tự toán tử:
 *   Trong JavaScript, `*` và `/` được tính trước `+` và `-`; các phép cùng mức
 *   tính từ trái sang phải. Biểu thức mẫu thực chất được tính là:
 *     (baseSalary + (overTimeHours * bonusRate)) - (baseSalary * taxRate)
 *   tức là đúng công thức về mặt số học; con số sai 4015 đến từ LỖI 1.
 *   Tuy vậy biểu thức dài không có ngoặc khiến người đọc khó kiểm tra ý đồ và
 *   dễ sai khi sửa (ví dụ đổi thành thuế trên tổng thu nhập). Vì vậy cần thêm
 *   ngoặc đơn và tách thành các biến trung gian có tên rõ nghĩa.
 *
 * =====================================================================
 * 2. THIẾT KẾ – BẢNG KHAI BÁO BIẾN
 * ---------------------------------------------------------------------
 * | Biến           | Khai báo | Lý do                                          |
 * |----------------|----------|------------------------------------------------|
 * | TAX_RATE       | const    | Thuế suất cố định; const chặn việc ghi đè      |
 * | baseSalary     | const    | Dữ liệu đầu vào, không thay đổi trong phép tính |
 * | overTimeHours  | const    | Dữ liệu đầu vào                                |
 * | bonusRate      | const    | Dữ liệu đầu vào (hệ số tăng ca)                |
 * | overtimePay    | const    | Kết quả trung gian, tính 1 lần                 |
 * | taxAmount      | const    | Kết quả trung gian, tính 1 lần                 |
 * | finalSalary    | let      | Thay đổi dần bằng += và -=                     |
 *
 * Công thức:
 *   Lương tăng ca   = Số giờ tăng ca × Hệ số tăng ca
 *   Tiền thuế       = Lương cơ bản × Thuế suất
 *   Lương thực nhận = (Lương cơ bản + Lương tăng ca) − Tiền thuế
 * ===================================================================== */

// ===================== 3. TRIỂN KHAI =====================
const TAX_RATE = 0.1;

// Làm tròn 2 chữ số thập phân. Number.EPSILON bù sai số dấu phẩy động,
// ví dụ 1.005 * 100 = 100.49999..., nếu thiếu EPSILON sẽ làm tròn sai thành 1.00.
const roundMoney = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function assertValidNumber(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} phải là số hữu hạn (nhận được: ${String(value)})`);
  }
  if (value < 0) {
    throw new RangeError(`${name} không được âm (nhận được: ${value})`);
  }
  if (value > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`${name} vượt giới hạn số an toàn (Number.MAX_SAFE_INTEGER)`);
  }
}

function calculateSalary(baseSalary, overTimeHours, bonusRate, taxRate = TAX_RATE) {
  assertValidNumber("Lương cơ bản", baseSalary);
  assertValidNumber("Số giờ tăng ca", overTimeHours);
  assertValidNumber("Hệ số tăng ca", bonusRate);
  if (typeof taxRate !== "number" || !(taxRate >= 0 && taxRate <= 1)) {
    throw new RangeError(`Thuế suất phải trong khoảng 0–1 (nhận được: ${String(taxRate)})`);
  }

  const overtimePay = overTimeHours * bonusRate;
  const taxAmount = baseSalary * taxRate;

  // Lương thực nhận = (Lương cơ bản + Lương tăng ca) − Tiền thuế
  let finalSalary = baseSalary;
  finalSalary += overtimePay;
  finalSalary -= taxAmount;

  // Cách viết một dòng tương đương, ngoặc đơn thể hiện rõ thứ tự:
  //   (baseSalary + (overTimeHours * bonusRate)) - (baseSalary * taxRate)

  return {
    overtimePay: roundMoney(overtimePay),
    taxAmount: roundMoney(taxAmount),
    finalSalary: roundMoney(finalSalary),
  };
}

// ===================== CHẠY VỚI DỮ LIỆU ĐỀ BÀI =====================
const baseSalary = 5000;
const overTimeHours = 10;
const bonusRate = 1.5;

const result = calculateSalary(baseSalary, overTimeHours, bonusRate);
console.log("=== DỮ LIỆU ĐỀ BÀI ===");
console.log("Lương tăng ca: " + result.overtimePay.toFixed(2));
console.log("Tiền thuế: " + result.taxAmount.toFixed(2));
console.log("Lương thực nhận: " + result.finalSalary.toFixed(2));

// ===================== 4. KIỂM THỬ =====================
function runTests() {
  const cases = [
    { name: "Dữ liệu đề bài",               args: [5000, 10, 1.5],                 expected: 4515 },
    { name: "Không tăng ca",                args: [5000, 0, 1.5],                  expected: 4500 },
    { name: "Thập phân",                    args: [1234.56, 2.5, 10.1],            expected: 1136.35 },
    { name: "Sai số dấu phẩy động 0.1+0.2", args: [0.1, 0.2, 1, 0],                expected: 0.3 },
    { name: "Làm tròn 1.005",               args: [1.005, 0, 0, 0],                expected: 1.01 },
    { name: "Giá trị lớn",                  args: [9_000_000_000_000, 100, 1_000_000], expected: 8_100_100_000_000 },
    { name: "Thuế suất 0",                  args: [5000, 10, 1.5, 0],              expected: 5015 },
    { name: "Thuế suất 20% (truyền vào)",   args: [5000, 10, 1.5, 0.2],            expected: 4015 },
  ];

  const errorCases = [
    { name: "Lương cơ bản âm",         args: [-5000, 10, 1.5] },
    { name: "Giờ tăng ca âm",          args: [5000, -10, 1.5] },
    { name: "Hệ số âm",                args: [5000, 10, -1.5] },
    { name: "Lương dạng chuỗi",        args: ["5000", 10, 1.5] },
    { name: "Lương NaN",               args: [NaN, 10, 1.5] },
    { name: "Lương Infinity",          args: [Infinity, 10, 1.5] },
    { name: "Thuế suất > 1",           args: [5000, 10, 1.5, 1.5] },
    { name: "Vượt MAX_SAFE_INTEGER",   args: [2 ** 60, 0, 0] },
  ];

  let passed = 0;
  const total = cases.length + errorCases.length;

  console.log("\n=== KIỂM THỬ KẾT QUẢ ===");
  cases.forEach(({ name, args, expected }) => {
    const { finalSalary } = calculateSalary(...args);
    const ok = finalSalary === expected;
    if (ok) passed += 1;
    console.log(`${ok ? "ĐẠT" : "SAI"}  ${name}: ${finalSalary.toFixed(2)} (mong đợi ${expected.toFixed(2)})`);
  });

  console.log("\n=== KIỂM THỬ DỮ LIỆU KHÔNG HỢP LỆ ===");
  errorCases.forEach(({ name, args }) => {
    try {
      calculateSalary(...args);
      console.log(`SAI  ${name}: không báo lỗi`);
    } catch (error) {
      passed += 1;
      console.log(`ĐẠT  ${name}: ${error.name} – ${error.message}`);
    }
  });

  console.log(`\nKết quả: ${passed}/${total} ca kiểm thử đạt`);
}

runTests();
