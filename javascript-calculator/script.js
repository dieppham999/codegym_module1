// JavaScript Calculator
// Phần 1: máy tính 2 số (4 hàm + 1 hàm dùng chung)
// Phần 2 (mở rộng): máy tính bàn phím có biểu thức, ngoặc, %, Ans, lịch sử

// Làm tròn hiển thị để tránh kết quả kiểu 0.1 + 0.2 = 0.30000000000000004
const tidy = (n) => parseFloat(n.toPrecision(12));

// =====================================================================
// PHẦN 1 – MÁY TÍNH 2 SỐ
// =====================================================================
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const basicResult = document.getElementById("basicResult");

// Đọc và kiểm tra dữ liệu từ form. Trả về { a, b } hoặc ném lỗi.
function readNumbers() {
  const text1 = num1Input.value.trim();
  const text2 = num2Input.value.trim();
  if (text1 === "" || text2 === "") throw new Error("Vui lòng nhập đủ 2 số.");
  const a = Number(text1);
  const b = Number(text2);
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error("Dữ liệu nhập phải là số.");
  return { a, b };
}

// ----- 4 hàm riêng cho 4 phép tính (yêu cầu cơ bản) -----
function add() {
  const { a, b } = readNumbers();
  return a + b;
}
function subtract() {
  const { a, b } = readNumbers();
  return a - b;
}
function multiply() {
  const { a, b } = readNumbers();
  return a * b;
}
function divide() {
  const { a, b } = readNumbers();
  if (b === 0) throw new Error("Không thể chia cho 0.");
  return a / b;
}

// ----- Mở rộng 1: MỘT hàm duy nhất xử lý cả 4 phép tính -----
const OPERATIONS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => {
    if (b === 0) throw new Error("Không thể chia cho 0.");
    return a / b;
  },
};

function calculate(operator) {
  const { a, b } = readNumbers();
  const operation = OPERATIONS[operator];
  if (!operation) throw new Error(`Phép tính không hỗ trợ: ${operator}`);
  return operation(a, b);
}

// Gắn sự kiện: Event Delegation trên khối nút, gọi hàm dùng chung calculate()
// (4 hàm add/subtract/multiply/divide vẫn giữ lại để minh họa yêu cầu cơ bản)
document.querySelector(".ops").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-op]");
  if (!button) return;
  const op = button.dataset.op;
  try {
    const result = tidy(calculate(op));
    const { a, b } = readNumbers();
    basicResult.textContent = `${a} ${op === "-" ? "−" : op} ${b} = ${result}`;
    basicResult.classList.remove("error");
  } catch (error) {
    basicResult.textContent = error.message;
    basicResult.classList.add("error");
  }
});

// Không cho Enter trong ô nhập submit form (form không có nút submit)
document.getElementById("basicForm").addEventListener("submit", (event) => event.preventDefault());

// =====================================================================
// PHẦN 2 – MÁY TÍNH NÂNG CAO (mở rộng 2)
// =====================================================================

// ----- Bộ phân tích biểu thức (không dùng eval) -----
// Ngữ pháp (thứ tự ưu tiên tăng dần):
//   expression = term   { ("+" | "-") term }
//   term       = factor { ("×" | "÷") factor }
//   factor     = "-" factor | postfix
//   postfix    = primary [ "%" ]
//   primary    = number | "(" expression ")"
function tokenize(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < text.length && /[0-9.]/.test(text[j])) j++;
      const raw = text.slice(i, j);
      if ((raw.match(/\./g) || []).length > 1) throw new Error("Số không hợp lệ");
      tokens.push({ type: "num", value: Number(raw) });
      i = j;
    } else if ("+-×÷()%".includes(ch)) {
      tokens.push({ type: "op", value: ch });
      i++;
    } else {
      throw new Error("Ký tự không hợp lệ");
    }
  }
  return tokens;
}

function evaluate(text) {
  const tokens = tokenize(text);
  let pos = 0;
  const peek = () => tokens[pos];
  const take = () => tokens[pos++];
  const isOp = (v) => peek() && peek().type === "op" && peek().value === v;

  function expression() {
    let value = term();
    while (isOp("+") || isOp("-")) {
      const op = take().value;
      const right = term();
      value = op === "+" ? value + right : value - right;
    }
    return value;
  }
  function term() {
    let value = factor();
    while (isOp("×") || isOp("÷")) {
      const op = take().value;
      const right = factor();
      if (op === "÷" && right === 0) throw new Error("Không thể chia cho 0");
      value = op === "×" ? value * right : value / right;
    }
    return value;
  }
  function factor() {
    if (isOp("-")) { take(); return -factor(); }
    return postfix();
  }
  function postfix() {
    let value = primary();
    while (isOp("%")) { take(); value /= 100; }
    return value;
  }
  function primary() {
    const token = take();
    if (!token) throw new Error("Biểu thức chưa hoàn chỉnh");
    if (token.type === "num") return token.value;
    if (token.value === "(") {
      const value = expression();
      if (!isOp(")")) throw new Error("Thiếu dấu )");
      take();
      return value;
    }
    throw new Error("Biểu thức không hợp lệ");
  }

  const result = expression();
  if (pos < tokens.length) throw new Error("Biểu thức không hợp lệ");
  if (!Number.isFinite(result)) throw new Error("Kết quả quá lớn");
  return tidy(result);
}

// ----- Trạng thái & hiển thị -----
const expressionEl = document.getElementById("expression");
const outputEl = document.getElementById("output");
const historyEl = document.getElementById("history");

let input = "";        // biểu thức đang nhập
let ans = 0;           // kết quả gần nhất
let justEvaluated = false;

function render(previewOnly) {
  outputEl.classList.remove("error");
  outputEl.textContent = input === "" ? "0" : input;
  if (previewOnly) return;
  expressionEl.innerHTML = "&nbsp;";
}

function showError(message) {
  outputEl.textContent = message;
  outputEl.classList.add("error");
  justEvaluated = true;
  input = "";
}

function addHistory(expr, result) {
  const li = document.createElement("li");
  const left = document.createElement("span");
  const right = document.createElement("span");
  left.textContent = expr + " =";
  right.textContent = result;
  li.append(left, right);
  li.dataset.value = String(result);
  historyEl.prepend(li);
}

const OPERATORS = "+-×÷";

function press(key) {
  if (key === "AC") {
    input = "";
    justEvaluated = false;
    render();
    return;
  }

  if (key === "CE") {
    input = justEvaluated ? "" : input.slice(0, -1);
    justEvaluated = false;
    render(true);
    return;
  }

  if (key === "=") {
    if (input === "") return;
    // Tự đóng các ngoặc còn mở, giống máy tính trực tuyến
    const open = (input.match(/\(/g) || []).length - (input.match(/\)/g) || []).length;
    const expr = input + ")".repeat(Math.max(0, open));
    try {
      const result = evaluate(expr);
      expressionEl.textContent = expr + " =";
      addHistory(expr, result);
      ans = result;
      input = String(result);
      outputEl.classList.remove("error");
      outputEl.textContent = input;
      justEvaluated = true;
    } catch (error) {
      expressionEl.textContent = expr + " =";
      showError(error.message);
    }
    return;
  }

  // Sau khi bấm "=": gõ số -> bắt đầu phép tính mới; gõ toán tử -> tính tiếp trên kết quả
  if (justEvaluated) {
    if (!OPERATORS.includes(key) && key !== "%") input = "";
    expressionEl.textContent = `Ans = ${ans}`;
    justEvaluated = false;
  }

  if (key === "Ans") {
    input += String(ans);
  } else if (OPERATORS.includes(key)) {
    const last = input.slice(-1);
    if (input === "" && key !== "-") input = "0";
    // Thay toán tử cuối nếu bấm 2 toán tử liên tiếp (riêng "-" cho phép số âm sau × ÷ hoặc "(")
    if (OPERATORS.includes(last) && !(key === "-" && "×÷".includes(last))) input = input.slice(0, -1);
    input += key;
  } else if (key === ".") {
    const lastNumber = input.split(/[+\-×÷()%]/).pop();
    if (lastNumber.includes(".")) return;          // 1 số chỉ có 1 dấu chấm
    input += lastNumber === "" ? "0." : ".";
  } else {
    input += key;                                    // số, (, ), %
  }
  render(true);
}

// Click trên bàn phím ảo (Event Delegation)
document.getElementById("keypad").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-key]");
  if (button) press(button.dataset.key);
});

// Click vào lịch sử để dùng lại kết quả
historyEl.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return;
  input = li.dataset.value;
  justEvaluated = false;
  render(true);
});

// Bàn phím thật (bỏ qua khi đang gõ trong ô input của phần cơ bản)
document.addEventListener("keydown", (event) => {
  if (event.target.closest("input")) return;
  const map = { "*": "×", "/": "÷", "x": "×", Enter: "=", "=": "=", Backspace: "CE", Escape: "AC", Delete: "AC" };
  const key = map[event.key] || event.key;
  if (/^[0-9.]$/.test(key) || "+-×÷()%".includes(key) || ["=", "CE", "AC"].includes(key)) {
    if (key.length > 0) {
      event.preventDefault();
      press(key);
    }
  }
});

// Xuất hàm để kiểm thử bằng Node.js (không ảnh hưởng trình duyệt)
if (typeof module !== "undefined") module.exports = { evaluate };
