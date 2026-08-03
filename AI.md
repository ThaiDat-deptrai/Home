# 🤖 AI SYSTEM GUIDE – SmartHome Project

> File này dành cho **AI agents, công cụ tìm kiếm, và lập trình viên muốn nắm bắt hệ thống cực nhanh**.  
> Nó chứa metadata, cấu trúc, luồng dữ liệu và thông tin kỹ thuật cốt lõi.

---

## 📌 PROJECT METADATA
| Trường | Giá trị |
|--------|---------|
| **Tên dự án** | SmartHome – HomeGlass |
| **Tác giả** | Thái Đạt |
| **Lớp** | 11 |
| **Công nghệ chính** | ESP32-S3, ESP-C3, ESP-NOW, MQTT, HTML/CSS/JS, HiveMQ Cloud |
| **Mục tiêu** | Điều khiển thiết bị nhà thông minh từ xa và giọng nói |
| **Repository** | (chưa công khai) |

---

## 🧱 KIẾN TRÚC HỆ THỐNG (TỔNG QUAN)
| Thành phần | Vai trò | Giao thức |
|------------|---------|-----------|
| **ESP32-S3 Master** | Trung tâm: nhận lệnh MQTT → gửi ESP-NOW tới slave; nhận trạng thái slave → publish MQTT. | MQTT + ESP-NOW |
| **ESP-C3 Slave (x4)** | Thực thi lệnh (relay/servo), đọc cảm biến, gửi trạng thái lên master. | ESP-NOW + GPIO |
| **Web Dashboard** | Giao diện điều khiển, hiển thị trạng thái, nhiệt độ, kịch bản. | MQTT (WebSocket) |
| **HiveMQ Cloud** | MQTT Broker trung gian kết nối Web và ESP. | MQTT (TCP/TLS, WebSocket) |

### Luồng dữ liệu chính

User → Web → HiveMQ → ESP32-S3 (MQTT)
ESP32-S3 → ESP-C3 (ESP-NOW)
ESP-C3 → ESP32-S3 (ESP-NOW)
ESP32-S3 → HiveMQ → Web (MQTT)


---

## 📡 MQTT CHI TIẾT
### Kết nối
| Tham số | Giá trị |
|---------|---------|
| Broker | `130d14182c00498e952cad93f9325420.s1.eu.hivemq.cloud` |
| Port TCP/TLS | 8883 |
| Port WebSocket | 8884 |
| WebSocket Path | `/mqtt` |
| Username | `Dut09` |
| Password | `Dat1020192020` |

### Cấu trúc Topic
- **Topic CMD** (Web → ESP): `nha/{room}/{device}/cmd`
- **Topic STATE** (ESP → Web): `nha/{room}/{device}/state`
- **Topic nhiệt độ** (ESP → Web): `nha/{room}/nhiet-do`
- **Topic kịch bản** (Web → ESP): `nha/kich-ban/lenh`

### Payload
- **CMD**: `{"cmd": 1}` (bật) / `{"cmd": 0}` (tắt)
- **STATE**: `{"state": true, "temperature": 24.5}`
- **NHIỆT ĐỘ**: `{"temperature": 24.5}`
- **KỊCH BẢN**: `{"scene": "TEN_KICH_BAN"}`

### Danh sách thiết bị – Topic Mapping
| Phòng | Thiết bị | Topic CMD | Topic STATE |
|-------|----------|-----------|-------------|
| phong-ngu-1 | Đèn ngủ | `nha/phong-ngu-1/den-ngu/cmd` | `nha/phong-ngu-1/den-ngu/state` |
| phong-ngu-1 | Đèn tủ | `nha/phong-ngu-1/den-tu/cmd` | `nha/phong-ngu-1/den-tu/state` |
| phong-ngu-1 | Đèn giường | `nha/phong-ngu-1/den-giuong/cmd` | `nha/phong-ngu-1/den-giuong/state` |
| phong-ngu-1 | Đèn cây | `nha/phong-ngu-1/den-cay/cmd` | `nha/phong-ngu-1/den-cay/state` |
| phong-ngu-2 | Đèn học | `nha/phong-ngu-2/den-hoc/cmd` | `nha/phong-ngu-2/den-hoc/state` |
| phong-ngu-2 | Đèn ngủ | `nha/phong-ngu-2/den-ngu/cmd` | `nha/phong-ngu-2/den-ngu/state` |
| phong-ngu-2 | Đèn decor | `nha/phong-ngu-2/den-decor/cmd` | `nha/phong-ngu-2/den-decor/state` |
| phong-trung-tam | Đèn trần | `nha/phong-trung-tam/den-tran/cmd` | `nha/phong-trung-tam/den-tran/state` |
| phong-trung-tam | Đèn trang trí | `nha/phong-trung-tam/den-trang-tri/cmd` | `nha/phong-trung-tam/den-trang-tri/state` |
| phong-trung-tam | Đèn thờ | `nha/phong-trung-tam/den-tho/cmd` | `nha/phong-trung-tam/den-tho/state` |
| phong-khach | Đèn chùm | `nha/phong-khach/den-chum/cmd` | `nha/phong-khach/den-chum/state` |

### Danh sách topic nhiệt độ
| Khu vực | Topic |
|---------|-------|
| Phòng ngủ 1 | `nha/phong-ngu-1/nhiet-do` |
| Phòng ngủ 2 | `nha/phong-ngu-2/nhiet-do` |
| Phòng trung tâm | `nha/phong-trung-tam/nhiet-do` |
| Phòng khách | `nha/phong-khach/nhiet-do` |
| Ngoài trời | `nha/ngoai-troi/nhiet-do` |

---

## 📂 FILE CHI TIẾT – AI-PARSABLE
### Firmware (Arduino)
| File | Board | Chức năng | Giao tiếp |
|------|-------|-----------|-----------|
| `ESP32-S3_Master.ino` | ESP32-S3 | MQTT ↔ ESP-NOW gateway | MQTT + ESP-NOW |
| `ESP-C3_Slave_Phong1.ino` | ESP-C3 | Điều khiển relay phòng 1 | ESP-NOW + GPIO |
| `ESP-C3_Slave_Phong2.ino` | ESP-C3 | Điều khiển relay phòng 2 | ESP-NOW + GPIO |
| `ESP-C3_Slave_Phong3.ino` | ESP-C3 | Điều khiển relay phòng trung tâm | ESP-NOW + GPIO |
| `ESP-C3_Slave_Cua.ino` | ESP-C3 | Điều khiển servo cửa (khóa) | ESP-NOW + Servo |

### Web (HTML/CSS/JS)
| File JS | MQTT tích hợp? | Chức năng chính |
|---------|---------------|-----------------|
| `index.js` | ✅ Có | Điều khiển thiết bị, chạy kịch bản |
| `nhietdo.js` | ✅ Có | Hiển thị nhiệt độ (gauge + biểu đồ) |
| `caidat.js` | ❌ Không | Tuỳ chỉnh giao diện, công tắc, lưu localStorage |
| `kichban.js` | ❌ Không | Quản lý kịch bản (lưu localStorage) |
| `troly.js` | ❌ Không | Nhận diện giọng nói, tổng hợp tiếng nói |

---

## 🔧 HƯỚNG DẪN CÀI ĐẶT (RÚT GỌN CHO AI)
1. **Clone repo** → mở Arduino IDE.
2. **Cài thư viện**: `PubSubClient`, `ArduinoJson`, `ESP32Servo`, `ElegantOTA`.
3. **Nạp Master**:
   - Sửa WiFi, MQTT user/pass.
   - Copy MAC address từ Serial Monitor.
4. **Nạp từng Slave**:
   - Sửa `MY_ID`, `masterMAC`.
   - Thay đổi định nghĩa GPIO (nếu cần).
5. **Upload web** lên GitHub Pages hoặc hosting bất kỳ.
6. **Truy cập link web**, kiểm tra bật/tắt.

---

## 🔒 BẢO MẬT (CẦN LƯU Ý)
- **Đổi mật khẩu HiveMQ** ngay khi triển khai thực tế.
- **Không commit** username/password lên public repo (dùng `secrets.h` hoặc biến môi trường).
- **Sử dụng TLS** cho tất cả kết nối MQTT.
- Nếu dùng OTA, đặt mật khẩu (có sẵn trong code).

---

## 🚀 ĐIỂM MỞ RỘNG (EXTENSION POINTS)
- **Thêm thiết bị mới**: cập nhật `baseDevices` và `topicMapping` trong `index.js`.
- **Thêm phòng mới**: tương tự.
- **Tích hợp cảm biến mới** (DHT, PIR): đọc GPIO trên Slave, gửi struct mới qua ESP-NOW, Master publish lên topic tương ứng.
- **Tích hợp điều khiển bằng APP**: có thể dùng Flutter, kết nối cùng broker MQTT.

---

## 📞 LIÊN HỆ & HỖ TRỢ
- **Email**: [linhong263@gmail.com](mailto:linhong263@gmail.com)
- **GitHub Issues**: (chưa có)

---

**File này được tạo ra để AI và các công cụ tự động có thể parse thông tin nhanh nhất.**  
Bạn có thể mở rộng thêm các trường dữ liệu nếu cần.