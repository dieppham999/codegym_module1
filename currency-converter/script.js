// Currency Converter – chuyển đổi tiền tệ theo tỷ giá cho trước.

// Tỷ giá cho trước: số VND tương ứng 1 đơn vị mỗi đồng tiền (giá trị cố định cho bài tập).
// Đổi qua VND làm trung gian nên chỉ cần 1 bảng thay vì bảng cho từng cặp tiền.
const RATES_TO_VND = {
  VND: 1,
  USD: 25000,
  EUR: 27000,
  JPY: 170,
  GBP: 32000,
};

/**
 * Chuyển đổi số tiền giữa 2 đồng tiền.
 * @returns {number} giá trị sau chuyển đổi
 */
function convertCurrency(amount, from, to) {
  if (!(from in RATES_TO_VND) || !(to in RATES_TO_VND)) {
    throw new Error("Đồng tiền không được hỗ trợ.");
  }
  const amountInVnd = amount * RATES_TO_VND[from];
  return amountInVnd / RATES_TO_VND[to];
}

function formatMoney(value, currency) {
  // VND và JPY không dùng phần lẻ; các đồng khác lấy 2 chữ số thập phân
  const digits = currency === "VND" || currency === "JPY" ? 0 : 2;
  return value.toLocaleString("vi-VN", { minimumFractionDigits: digits, maximumFractionDigits: digits }) + " " + currency;
}

// ===================== XỬ LÝ FORM =====================
const form = document.getElementById("converterForm");
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const swapBtn = document.getElementById("swapBtn");
const result = document.getElementById("result");

function showResult(html, isError) {
  result.innerHTML = html;
  result.className = isError ? "error" : "";
}

// Đọc dữ liệu từ form, kiểm tra, tính toán và hiển thị kết quả
function handleConvert(event) {
  event.preventDefault(); // không tải lại trang khi nhấn Convert

  const from = fromSelect.value;
  const to = toSelect.value;
  const amountText = amountInput.value.trim();
  const amount = Number(amountText);

  if (amountText === "") {
    showResult("Vui lòng nhập số tiền.", true);
    return;
  }
  if (!Number.isFinite(amount) || amount < 0) {
    showResult("Số tiền phải là số không âm.", true);
    return;
  }

  const converted = convertCurrency(amount, from, to);
  const rate = convertCurrency(1, from, to);

  showResult(
    `${formatMoney(amount, from)} =<strong>${formatMoney(converted, to)}</strong>` +
      `<small>Tỷ giá: 1 ${from} = ${rate.toLocaleString("vi-VN", { maximumFractionDigits: 6 })} ${to}</small>`,
    false
  );
}

form.addEventListener("submit", handleConvert);

swapBtn.addEventListener("click", () => {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  if (amountInput.value.trim() !== "") form.requestSubmit();
});
