// FastGuard – logic xác thực người chơi HeroQuest.
// Được nạp bằng <script src="app.js" defer>, nên DOM đã sẵn sàng khi chạy.

/**
 * Chuẩn hóa và kiểm tra tên từ prompt().
 * @param {string|null} input giá trị prompt() trả về
 * @returns {string|null} tên đã trim nếu hợp lệ, ngược lại null
 */
function validateName(input) {
  if (input === null) return null;          // Cancel / ESC
  const name = input.trim();
  if (name === "") return null;             // rỗng hoặc toàn dấu cách
  return name;
}

function setStatus(text, state) {
  const status = document.getElementById("status");
  status.textContent = text;
  status.className = state || "";
}

function lockGame() {
  document.getElementById("game-content").hidden = true;
  document.getElementById("retry").hidden = false;
}

function unlockGame(name) {
  document.getElementById("welcome").textContent = "Chào mừng, " + name + "!";
  document.getElementById("game-content").hidden = false;
  document.getElementById("retry").hidden = true;
}

function runGate() {
  lockGame();
  setStatus("Đang chờ xác thực người chơi...");

  const name = validateName(prompt("Nhập tên người chơi:"));
  if (name === null) {
    alert("Tên không hợp lệ. Vui lòng nhập tên (không để trống).");
    setStatus("Tên không hợp lệ. Truy cập bị dừng.", "denied");
    return;
  }

  const isAdult = confirm("Chào " + name + ", bạn đã đủ 18 tuổi chưa?");
  if (!isAdult) {
    alert("Từ chối truy cập: nội dung chỉ dành cho người từ 18 tuổi.");
    setStatus("Từ chối truy cập.", "denied");
    return;
  }

  alert("Chào mừng " + name + " đến với HeroQuest!");
  setStatus("Đã xác nhận. Chúc bạn chơi vui!", "granted");
  unlockGame(name);
}

if (typeof document !== "undefined") {
  document.getElementById("retry").addEventListener("click", runGate);
  // Nhường một nhịp để trình duyệt vẽ giao diện cơ bản trước khi bật hộp thoại.
  setTimeout(runGate, 100);
}

if (typeof module !== "undefined") module.exports = { validateName };
