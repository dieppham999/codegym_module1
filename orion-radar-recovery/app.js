// Orion Radar Recovery – Canvas + requestAnimationFrame + cleanData + try...catch

const SIZE = 600;               // kích thước nội bộ của canvas
const CENTER = SIZE / 2;
const RADAR_R = SIZE / 2 - 10;
const PLANE_R = 6;              // bán kính máy bay (vùng click)
const ERROR_RATE = 0.3;

// ===================== VALIDATION =====================

const isValidCoord = (v) => typeof v === "number" && Number.isFinite(v); // loại null, undefined, NaN, Infinity, chuỗi

/**
 * Kiểm tra và lọc dữ liệu từ API trước khi render.
 * Không bao giờ ném lỗi: dữ liệu hỏng bị bỏ qua và ghi console.warn.
 * @returns {{ planes: Array<{id:string,x:number,y:number}>, rejected: number }}
 */
function cleanData(raw) {
  if (!Array.isArray(raw)) {
    console.warn("[Radar] Dữ liệu API sai cấu trúc, mong đợi mảng nhưng nhận:", raw);
    return { planes: [], rejected: 0 };
  }

  const planes = [];
  let rejected = 0;

  raw.forEach((item, index) => {
    // try...catch BÊN TRONG vòng lặp: lỗi của 1 phần tử không ảnh hưởng phần tử khác
    try {
      if (item === null || typeof item !== "object" || Array.isArray(item)) {
        throw new TypeError(`phần tử không phải object (${item === null ? "null" : typeof item})`);
      }
      const { id, x, y } = item;
      if (typeof id !== "string" && typeof id !== "number") throw new TypeError("thiếu hoặc sai kiểu id");
      if (!("x" in item) || !("y" in item)) throw new TypeError("thiếu tọa độ x/y");
      if (!isValidCoord(x) || !isValidCoord(y)) throw new RangeError(`tọa độ không hợp lệ x=${String(x)}, y=${String(y)}`);
      if (Math.hypot(x - CENTER, y - CENTER) > RADAR_R) throw new RangeError(`ngoài phạm vi radar (${x.toFixed(1)}, ${y.toFixed(1)})`);

      planes.push({ id: String(id), x, y });
    } catch (err) {
      rejected++;
      console.warn(`[Radar] Bỏ qua phần tử #${index}: ${err.message}`, item);
    }
  });

  return { planes, rejected };
}

// ===================== API GIẢ LẬP =====================

const BAD_VALUES = [
  () => null,
  () => undefined,
  (p) => ({ ...p, x: NaN }),
  (p) => ({ ...p, y: Infinity }),
  (p) => ({ ...p, x: -Infinity }),
  (p) => ({ ...p, x: String(p.x) }),          // sai kiểu: chuỗi
  (p) => ({ id: p.id, x: p.x }),              // thiếu y
  (p) => ({ x: p.x, y: p.y }),                // thiếu id
  (p) => ({ ...p, x: null }),
  (p) => ({ ...p, x: undefined }),
  () => "PLANE-???",                          // sai kiểu: chuỗi thay vì object
  () => 42,
  (p) => [p.x, p.y],                          // sai cấu trúc: mảng
  (p) => ({ ...p, x: 9999 }),                 // ngoài phạm vi
];

let fleet = [];

function createFleet(count) {
  fleet = Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (RADAR_R - 20);
    return {
      id: `OR-${String(i + 1).padStart(3, "0")}`,
      x: CENTER + Math.cos(angle) * dist,
      y: CENTER + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
    };
  });
}

function moveFleet() {
  fleet.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (Math.hypot(p.x - CENTER, p.y - CENTER) > RADAR_R - 10) { p.vx *= -1; p.vy *= -1; }
  });
}

/** Trả về snapshot "từ API", trong đó khoảng ERROR_RATE phần tử bị hỏng. */
function fetchRadarData(mode) {
  if (mode === "broken") {
    const samples = [null, undefined, "500 Internal Server Error", { data: [] }, 404];
    return samples[Math.floor(Math.random() * samples.length)];
  }
  return fleet.map((p) => {
    const clean = { id: p.id, x: p.x, y: p.y };
    if (Math.random() >= ERROR_RATE) return clean;
    const corrupt = BAD_VALUES[Math.floor(Math.random() * BAD_VALUES.length)];
    return corrupt(clean);
  });
}

// ===================== TRÌNH DUYỆT =====================

if (typeof document !== "undefined") {
  const canvas = document.querySelector("#radar");
  const ctx = canvas.getContext("2d");
  const stats = document.querySelector("#stats");

  let mode = "dynamic";
  let planes = [];
  let rejected = 0;
  let selectedId = null;
  let sweep = 0;
  let lastFetch = 0;
  let fps = 0;
  let lastFrame = performance.now();
  const FETCH_INTERVAL = 1000; // ms: tần suất "gọi API"

  function setMode(newMode) {
    mode = newMode;
    selectedId = null;
    createFleet(mode === "stress" ? 500 : 50);
    lastFetch = 0;
    document.querySelectorAll("button[data-mode]").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  }

  function drawBackground() {
    ctx.fillStyle = "#04140a";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = "#1d5c36";
    ctx.lineWidth = 1;
    [1, 2, 3, 4].forEach((k) => {
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, (RADAR_R / 4) * k, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(CENTER - RADAR_R, CENTER); ctx.lineTo(CENTER + RADAR_R, CENTER);
    ctx.moveTo(CENTER, CENTER - RADAR_R); ctx.lineTo(CENTER, CENTER + RADAR_R);
    ctx.stroke();
  }

  function drawSweep() {
    const grad = ctx.createLinearGradient(CENTER, CENTER, CENTER + Math.cos(sweep) * RADAR_R, CENTER + Math.sin(sweep) * RADAR_R);
    grad.addColorStop(0, "rgba(80,255,140,0.6)");
    grad.addColorStop(1, "rgba(80,255,140,0)");
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.arc(CENTER, CENTER, RADAR_R, sweep - 0.35, sweep);
    ctx.closePath();
    ctx.fillStyle = "rgba(80,255,140,0.12)";
    ctx.fill();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CENTER, CENTER);
    ctx.lineTo(CENTER + Math.cos(sweep) * RADAR_R, CENTER + Math.sin(sweep) * RADAR_R);
    ctx.stroke();
  }

  function drawPlanes() {
    planes.forEach((p) => {
      try {
        const selected = p.id === selectedId;
        ctx.beginPath();
        ctx.arc(p.x, p.y, selected ? PLANE_R + 2 : PLANE_R, 0, Math.PI * 2);
        ctx.fillStyle = selected ? "#ff3030" : "#50ff8c";
        ctx.fill();
        if (selected) {
          ctx.fillStyle = "#ff8080";
          ctx.font = "13px Consolas, monospace";
          ctx.fillText(p.id, p.x + 10, p.y - 8);
        }
      } catch (err) {
        console.warn(`[Radar] Lỗi khi vẽ máy bay ${p && p.id}:`, err);
      }
    });
  }

  function loop(now) {
    try {
      fps = Math.round(1000 / Math.max(1, now - lastFrame));
      lastFrame = now;

      moveFleet();
      if (now - lastFetch > FETCH_INTERVAL) {
        lastFetch = now;
        const result = cleanData(fetchRadarData(mode));
        planes = result.planes;
        rejected = result.rejected;
      }

      sweep = (sweep + 0.03) % (Math.PI * 2);
      drawBackground();
      drawSweep();
      drawPlanes();

      const sel = selectedId ? ` | Đang chọn: ${selectedId}` : "";
      stats.textContent = `Hợp lệ: ${planes.length} | Bị loại: ${rejected} | FPS: ${fps}${sel}`;
    } catch (err) {
      console.warn("[Radar] Lỗi trong khung hình, bỏ qua và tiếp tục:", err);
    }
    requestAnimationFrame(loop); // luôn lên lịch khung tiếp theo, kể cả khi khung này lỗi
  }

  canvas.addEventListener("click", (event) => {
    // Chuyển tọa độ chuột (CSS px) sang tọa độ nội bộ canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);

    // Duyệt ngược để ưu tiên máy bay vẽ sau cùng (nằm trên)
    const hit = [...planes].reverse().find((p) => {
      const d = Math.sqrt((mouseX - p.x) ** 2 + (mouseY - p.y) ** 2);
      return d <= PLANE_R + 2;
    });
    selectedId = hit ? hit.id : null;
  });

  document.querySelectorAll("button[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  setMode("dynamic");
  requestAnimationFrame(loop);
}

if (typeof module !== "undefined") module.exports = { cleanData, createFleet, fetchRadarData };
