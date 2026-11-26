// BurgerTech Self-Service Kiosk
// Nạp bằng <script defer> nên mọi phần tử DOM đã sẵn sàng.

// ===================== DỮ LIỆU & DOM =====================
let cart = [];      // nguồn dữ liệu duy nhất: [{ id, name, price }]
let nextId = 1;

const orderForm = document.getElementById("orderForm");
const foodName = document.getElementById("foodName");
const foodPrice = document.getElementById("foodPrice");
const formError = document.getElementById("formError");
const cartList = document.getElementById("cartList");
const emptyCart = document.getElementById("emptyCart");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const message = document.getElementById("message");

const formatMoney = (n) => n.toLocaleString("vi-VN") + " ₫";

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type;
}

// ===================== HIỂN THỊ =====================
// Tạo <li> cho 1 món bằng createElement (không dùng innerHTML để tránh XSS).
function createCartItem(item) {
  const li = document.createElement("li");
  li.dataset.id = item.id;

  const name = document.createElement("span");
  name.className = "name";
  name.textContent = item.name;

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatMoney(item.price);

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-btn";
  del.textContent = "Xóa";

  li.append(name, price, del);
  return li;
}

// Cập nhật tổng tiền + trạng thái giỏ trống. Gọi sau MỌI thay đổi của cart.
function updateSummary() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalPrice.textContent = formatMoney(total);
  emptyCart.hidden = cart.length > 0;
}

// ===================== NGHIỆP VỤ =====================
function addItem(name, price) {
  const item = { id: nextId++, name, price };
  cart.push(item);
  cartList.appendChild(createCartItem(item));
  updateSummary();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  const li = cartList.querySelector(`li[data-id="${id}"]`);
  if (li) li.remove();
  updateSummary();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  cartList.replaceChildren(); // xóa toàn bộ <li>
  updateSummary();
  showMessage("Đã xóa toàn bộ giỏ hàng.", "warning");
}

function checkout() {
  if (cart.length === 0) {
    showMessage("Giỏ hàng trống, chưa thể thanh toán.", "warning");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  showMessage(`Thanh toán thành công ${cart.length} món, tổng ${formatMoney(total)}. Cảm ơn quý khách!`, "success");
  cart = [];
  cartList.replaceChildren();
  updateSummary();
}

function validate(name, priceText) {
  if (name === "") return "Vui lòng nhập tên món.";
  if (priceText === "") return "Vui lòng nhập giá tiền.";
  const price = Number(priceText);
  if (!Number.isFinite(price)) return "Giá tiền phải là số.";
  if (price <= 0) return "Giá tiền phải lớn hơn 0.";
  if (!Number.isInteger(price)) return "Giá tiền phải là số nguyên (VNĐ).";
  return "";
}

// ===================== FORM EVENT =====================
orderForm.addEventListener("submit", (event) => {
  event.preventDefault(); // chặn hành vi mặc định: gửi form và tải lại trang

  const name = foodName.value.trim();
  const priceText = foodPrice.value.trim();
  const error = validate(name, priceText);

  if (error) {
    formError.textContent = error;
    (name === "" ? foodName : foodPrice).focus();
    return;
  }

  addItem(name, Number(priceText));
  formError.textContent = "";
  showMessage(`Đã thêm "${name}" vào giỏ.`, "success");
  orderForm.reset();
  foodName.focus();
});

// ===================== MOUSE EVENT =====================
// Event Delegation: 1 listener trên <ul> xử lý nút Xóa của mọi <li>, kể cả <li> tạo sau này.
cartList.addEventListener("click", (event) => {
  const btn = event.target.closest(".delete-btn");
  if (!btn) return;
  const li = btn.closest("li");
  removeItem(Number(li.dataset.id)); // xóa theo id nên click liên tục vẫn đúng món
});

// Hover: mouseover/mouseout có nổi bọt (bubbling) nên dùng được Event Delegation.
cartList.addEventListener("mouseover", (event) => {
  const li = event.target.closest("li");
  if (li) li.classList.add("hovered");
});
cartList.addEventListener("mouseout", (event) => {
  const li = event.target.closest("li");
  // Chỉ bỏ màu khi chuột thực sự rời khỏi <li>, không phải chuyển sang phần tử con.
  if (li && !li.contains(event.relatedTarget)) li.classList.remove("hovered");
});

checkoutBtn.addEventListener("click", checkout);

// ===================== KEYBOARD EVENT =====================
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearCart();
    return;
  }

  if (event.key === "Enter") {
    // Đang nhập trong form -> để Enter submit form (thêm món), KHÔNG thanh toán.
    if (event.target.closest("#orderForm")) return;
    // Đang focus một nút -> trình duyệt tự kích hoạt click của nút đó, tránh xử lý 2 lần.
    if (event.target.closest("button")) return;
    if (event.repeat) return; // giữ phím Enter không thanh toán nhiều lần
    checkout();
  }
});

updateSummary();
