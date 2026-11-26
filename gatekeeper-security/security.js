// GateKeeper Security – luồng xác thực 3 bước: prompt -> confirm -> alert.
// Nạp bằng <script defer>: chạy sau khi HTML phân tích xong nên #status đã tồn tại.

const statusEl = document.getElementById("status");

function setStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = type || "";
}

function runSecurityCheck() {
  // Bước 1 – Prompt: trả về chuỗi người dùng nhập, "" nếu OK mà để trống, null nếu Cancel/ESC
  const input = prompt("Mã nhân viên:");

  if (input === null) {
    alert("Truy cập bị từ chối");
    setStatus("Truy cập bị từ chối", "denied");
    return;
  }

  const employeeId = input.trim();
  if (employeeId === "") {
    alert("Truy cập bị từ chối");
    setStatus("Truy cập bị từ chối", "denied");
    return;
  }

  // Bước 2 – Confirm: true khi OK, false khi Cancel/ESC
  const accepted = confirm(`Bạn có chắc chắn muốn sử dụng mã ${employeeId} để đăng nhập không?`);

  // Bước 3 – Alert: thông báo kết quả
  if (accepted) {
    alert("Truy cập thành công!");
    setStatus(`Truy cập thành công! Mã nhân viên: ${employeeId}`, "success");
  } else {
    alert("Hủy đăng nhập");
    setStatus("Hủy đăng nhập", "denied");
  }
}

// defer chỉ bảo đảm HTML đã phân tích xong, KHÔNG bảo đảm trình duyệt đã vẽ.
// prompt() chặn luồng chính, nên phải đợi trình duyệt vẽ xong khung hình đầu tiên:
// requestAnimationFrame chạy ngay TRƯỚC lần vẽ kế tiếp, setTimeout bên trong đẩy
// việc mở hộp thoại ra SAU lần vẽ đó -> người dùng thấy nội dung trước khi prompt hiện.
setStatus("Đang chờ xác thực...");
requestAnimationFrame(() => {
  setTimeout(runSecurityCheck, 0);
});
