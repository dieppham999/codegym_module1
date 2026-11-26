// WeatherSync – IoT Error Handling
// Chạy: node weather_dashboard.js   (hoặc dán vào DevTools > Console)

// ===================== DỮ LIỆU MẪU (theo đề bài) =====================
const sensorData = [
  { id: "S1", temp: 32.5, humidity: 80 },
  { id: "S2", temp: null, humidity: 90 },
  { id: "S3", temp: 35.1, humidity: 75 },
  { id: "S4", temp: 40.2 },
  "Tôi là hacker, tôi gửi chuỗi thay vì object",
  { id: "S5", temp: 28.0, humidity: 60 },
];

// ===================== DỮ LIỆU EDGE CASES =====================
// JSON không biểu diễn được undefined, NaN, Infinity nên các ca đó được thêm bằng JS.
const edgeCaseData = [
  { id: "E01", temp: -50, humidity: 40 },          // đúng ngưỡng dưới -> hợp lệ
  { id: "E02", temp: 100, humidity: 10 },          // đúng ngưỡng trên -> hợp lệ
  { id: "E03", temp: -50.1, humidity: 40 },        // dưới ngưỡng -> lỗi nghiệp vụ
  { id: "E04", temp: 100.5, humidity: 40 },        // trên ngưỡng -> lỗi nghiệp vụ
  { id: "E05", temp: "25.5", humidity: 50 },       // nhiệt độ dạng chuỗi
  { id: "E06", temp: undefined, humidity: 50 },    // nhiệt độ undefined
  { id: "E07", temp: NaN, humidity: 50 },          // NaN
  { id: "E08", temp: Infinity, humidity: 50 },     // Infinity
  { id: "E09", temp: -Infinity, humidity: 50 },    // -Infinity
  { id: "E10", humidity: 50 },                     // thiếu trường temp
  { id: "E11", temp: 20, humidity: "80%" },        // độ ẩm sai kiểu
  { id: "E12", temp: 20, humidity: 120 },          // độ ẩm vượt 100%
  { temp: 25, humidity: 50 },                      // thiếu id
  null,                                            // phần tử null
  undefined,                                       // phần tử undefined
  42,                                              // số thay vì object
  [25, 50],                                        // mảng thay vì object
  { id: "E13", temp: true, humidity: 50 },         // boolean
  { id: "E14", temp: 0, humidity: 0 },             // 0 là hợp lệ (falsy nhưng đúng)
];

// ===================== CẤU HÌNH NGHIỆP VỤ =====================
const TEMP_MIN = -50;
const TEMP_MAX = 100;
const REQUIRED_FIELDS = ["id", "temp", "humidity"];

// Lỗi dữ liệu đầu vào (sai kiểu, thiếu trường) -> ghi console.warn.
// Lỗi nghiệp vụ (vượt ngưỡng) và lỗi không lường trước -> ghi console.error.
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// Kiểm tra giá trị là số hữu hạn: loại null, undefined, chuỗi, boolean, NaN, ±Infinity.
const isFiniteNumber = (v) => typeof v === "number" && Number.isFinite(v);

// ===================== VALIDATION =====================
function validateSensor(sensor) {
  // 1. Phải là object thật (typeof null === "object" và mảng cũng là "object")
  if (sensor === null || typeof sensor !== "object" || Array.isArray(sensor)) {
    const kind = sensor === null ? "null" : Array.isArray(sensor) ? "array" : typeof sensor;
    throw new ValidationError(`Dữ liệu không phải object cảm biến (nhận được: ${kind})`);
  }

  // 2. Đủ trường bắt buộc
  const missing = REQUIRED_FIELDS.filter((field) => !(field in sensor));
  if (missing.length > 0) {
    throw new ValidationError(`Thiếu trường bắt buộc: ${missing.join(", ")}`);
  }

  // 3. id hợp lệ
  if (typeof sensor.id !== "string" || sensor.id.trim() === "") {
    throw new ValidationError("ID cảm biến không hợp lệ");
  }

  // 4. Nhiệt độ: kiểm tra kiểu TRƯỚC khi gọi toFixed()
  if (!isFiniteNumber(sensor.temp)) {
    throw new ValidationError(`Nhiệt độ không hợp lệ: ${String(sensor.temp)} (kiểu ${typeof sensor.temp})`);
  }

  // 5. Độ ẩm
  if (!isFiniteNumber(sensor.humidity)) {
    throw new ValidationError(`Độ ẩm không hợp lệ: ${String(sensor.humidity)} (kiểu ${typeof sensor.humidity})`);
  }
  if (sensor.humidity < 0 || sensor.humidity > 100) {
    throw new ValidationError(`Độ ẩm ngoài khoảng 0–100%: ${sensor.humidity}`);
  }

  // 6. Ngưỡng nghiệp vụ: chủ động ném lỗi (đúng ngưỡng -50 và 100 vẫn chấp nhận)
  if (sensor.temp < TEMP_MIN || sensor.temp > TEMP_MAX) {
    throw new Error(`Nhiệt độ ${sensor.temp}°C vượt ngưỡng an toàn [${TEMP_MIN}, ${TEMP_MAX}]`);
  }
}

// Lấy ID để ghi log, kể cả khi dữ liệu hỏng
function getSensorLabel(sensor, index) {
  if (sensor !== null && typeof sensor === "object" && typeof sensor.id === "string" && sensor.id.trim() !== "") {
    return sensor.id;
  }
  return `không xác định (vị trí #${index})`;
}

// ===================== XỬ LÝ CHÍNH =====================
function processWeatherData(dataList) {
  console.log("--- BẮT ĐẦU XỬ LÝ DỮ LIỆU ---");
  const summary = { ok: 0, warning: 0, error: 0 };

  if (!Array.isArray(dataList)) {
    console.error(`[LỖI] Danh sách cảm biến không phải mảng (nhận được: ${typeof dataList})`);
    console.log("--- HOÀN THÀNH XỬ LÝ DỮ LIỆU ---");
    return summary;
  }

  dataList.forEach((sensor, index) => {
    const label = getSensorLabel(sensor, index);

    // try...catch BÊN TRONG vòng lặp: lỗi của 1 cảm biến chỉ dừng cảm biến đó,
    // forEach vẫn tiếp tục với các cảm biến còn lại.
    try {
      validateSensor(sensor);
      const formattedTemp = sensor.temp.toFixed(1); // an toàn: temp chắc chắn là number
      console.log(`Cảm biến ${sensor.id}: Nhiệt độ là ${formattedTemp}°C, độ ẩm ${sensor.humidity}%`);
      summary.ok++;
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn(`[CẢNH BÁO] Cảm biến ${label}: ${error.message}`);
        summary.warning++;
      } else {
        console.error(`[LỖI] Cảm biến ${label}: ${error.message}`);
        summary.error++;
      }
    } finally {
      // finally luôn chạy, dù try thành công hay catch bắt lỗi
      console.log(`Đã quét qua cảm biến ${label}`);
    }
  });

  console.log(`Tổng kết: ${summary.ok} hợp lệ, ${summary.warning} cảnh báo dữ liệu, ${summary.error} lỗi nghiệp vụ`);
  console.log("--- HOÀN THÀNH XỬ LÝ DỮ LIỆU ---");
  return summary;
}

// ===================== CHẠY =====================
if (typeof module !== "undefined" && require.main === module) {
  console.log("===== DỮ LIỆU ĐỀ BÀI =====");
  processWeatherData(sensorData);

  console.log("\n===== DỮ LIỆU EDGE CASES =====");
  processWeatherData(edgeCaseData);

  console.log("\n===== DANH SÁCH SAI CẤU TRÚC =====");
  processWeatherData("không phải mảng");
} else if (typeof window !== "undefined") {
  processWeatherData(sensorData);
  processWeatherData(edgeCaseData);
}

if (typeof module !== "undefined") module.exports = { processWeatherData, validateSensor, ValidationError };
