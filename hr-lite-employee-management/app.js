// HR-Lite – quản lý nhân sự bằng JavaScript thuần.
// Nạp bằng <script defer> nên DOM đã sẵn sàng khi file này chạy.

// ===== Dữ liệu =====
let employees = [
  { id: 1, name: "Nguyễn Văn An", position: "Developer", salary: 15000000 },
  { id: 2, name: "Trần Thị Bình", position: "Tester", salary: 12000000 },
  { id: 3, name: "Lê Minh Châu", position: "HR", salary: 10000000 },
];
let nextId = 4;
let keyword = "";

// ===== DOM =====
const form = document.querySelector("#employee-form");
const formTitle = document.querySelector("#form-title");
const idInput = document.querySelector("#employee-id");
const nameInput = document.querySelector("#employee-name");
const positionInput = document.querySelector("#employee-position");
const salaryInput = document.querySelector("#employee-salary");
const formError = document.querySelector("#form-error");
const submitBtn = document.querySelector("#submit-btn");
const cancelBtn = document.querySelector("#cancel-edit");
const searchInput = document.querySelector("#search");
const list = document.querySelector("#employee-list");
const totalEl = document.querySelector("#total-salary");
const emptyMsg = document.querySelector("#empty-message");

// ===== Tiện ích =====
const formatMoney = (n) => n.toLocaleString("vi-VN") + " ₫";

// Chống XSS khi đưa dữ liệu người dùng nhập vào innerHTML.
const escapeHtml = (str) =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function validate(name, salaryText) {
  if (name === "") return "Tên nhân viên không được để trống.";
  if (salaryText === "") return "Vui lòng nhập lương.";
  const salary = Number(salaryText);
  if (!Number.isFinite(salary)) return "Lương phải là một số.";
  if (salary < 0) return "Lương không được âm.";
  return "";
}

// ===== Render =====
function render() {
  // filter(): tìm kiếm theo tên, không phân biệt hoa/thường
  const visible = employees.filter((e) => e.name.toLowerCase().includes(keyword));

  // map(): tạo HTML cho từng dòng
  list.innerHTML = visible
    .map(
      (e) => `
      <tr>
        <td>${escapeHtml(e.name)}</td>
        <td>${escapeHtml(e.position || "—")}</td>
        <td>${formatMoney(e.salary)}</td>
        <td>
          <button type="button" class="btn-edit" data-action="edit" data-id="${e.id}">Sửa</button>
          <button type="button" class="btn-delete" data-action="delete" data-id="${e.id}">Xóa</button>
        </td>
      </tr>`
    )
    .join("");

  emptyMsg.hidden = visible.length > 0;

  // reduce(): tổng quỹ lương của toàn bộ nhân viên
  const total = employees.reduce((sum, e) => sum + e.salary, 0);
  totalEl.textContent = formatMoney(total);
}

function resetForm() {
  form.reset();
  idInput.value = "";
  formError.textContent = "";
  formTitle.textContent = "Thêm nhân viên";
  submitBtn.textContent = "Thêm";
  cancelBtn.hidden = true;
}

// ===== Sự kiện =====
form.addEventListener("submit", (event) => {
  event.preventDefault(); // không tải lại trang

  const name = nameInput.value.trim();
  const position = positionInput.value.trim();
  const salaryText = salaryInput.value.trim();

  const error = validate(name, salaryText);
  if (error) {
    formError.textContent = error;
    return;
  }

  const salary = Number(salaryText);
  const editingId = Number(idInput.value);

  if (editingId) {
    // map(): cập nhật nhân viên đang sửa
    employees = employees.map((e) => (e.id === editingId ? { ...e, name, position, salary } : e));
  } else {
    // push(): thêm nhân viên mới
    employees.push({ id: nextId++, name, position, salary });
  }

  resetForm();
  render();
});

searchInput.addEventListener("input", (event) => {
  keyword = event.target.value.trim().toLowerCase();
  render();
});

// Event delegation: một listener cho mọi nút Sửa/Xóa trong bảng.
list.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);

  if (btn.dataset.action === "delete") {
    const emp = employees.find((e) => e.id === id);
    if (!confirm(`Xóa nhân viên "${emp.name}"?`)) return;
    // filter(): xóa nhân viên
    employees = employees.filter((e) => e.id !== id);
    if (Number(idInput.value) === id) resetForm();
    render();
  }

  if (btn.dataset.action === "edit") {
    const emp = employees.find((e) => e.id === id);
    idInput.value = emp.id;
    nameInput.value = emp.name;
    positionInput.value = emp.position;
    salaryInput.value = emp.salary;
    formError.textContent = "";
    formTitle.textContent = "Sửa nhân viên";
    submitBtn.textContent = "Cập nhật";
    cancelBtn.hidden = false;
    nameInput.focus();
  }
});

cancelBtn.addEventListener("click", resetForm);

render();
