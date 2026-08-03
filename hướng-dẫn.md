# 🏠 DỰ ÁN SMART HOME - HOMEGLASS

**Tác giả**: Thái Đạt  
**Lớp**: 11  
**Công nghệ**: ESP32-S3, ESP-C3, ESP-NOW, MQTT, HTML/CSS/JS, HiveMQ Cloud

---

## 📌 MỤC LỤC
- [Tổng quan](#-tổng-quan)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Thông tin MQTT](#-thông-tin-mqtt)
- [Chi tiết các file](#-chi-tiết-các-file)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Cách vận hành](#-cách-vận-hành)
- [Bảo mật](#-bảo-mật)
- [Ghi chú mở rộng](#-ghi-chú-mở-rộng)
- [Hỗ trợ](#-hỗ-trợ)

---

## 📖 TỔNG QUAN
Dự án là một hệ thống **Smart Home (Nhà thông minh)** hoàn chỉnh, cho phép người dùng điều khiển các thiết bị điện (đèn, quạt, cửa...) từ bất kỳ đâu thông qua **Web Dashboard** và **Trợ lý giọng nói**.

### 🎯 Mục tiêu
- Điều khiển thiết bị từ xa qua Internet (dùng 4G/WiFi khác).
- Điều khiển tại nhà qua WiFi LAN.
- Tự động hóa thông qua cảm biến (PIR, ánh sáng, nhiệt độ...).
- Cập nhật firmware không dây (OTA).
- Giao diện đẹp, dễ dùng, hỗ trợ chế độ tối và tùy chỉnh hình nền.

---

## 🧠 KIẾN TRÚC HỆ THỐNG

### Sơ đồ tổng quan

☁️ HiveMQ Cloud
(MQTT Broker)
│
┌──────────────┼──────────────┐
│ │ │
📱 Web 📡 ESP32-S3 📱 App (Future)
(GitHub Pages) (MASTER) (Flutter)
│ │ │
└──────────────┼──────────────┘
│
Router WiFi
("Đừng có hỏi")
│
┌──────────────┼──────────────┐
│ │ │
ESP-C3 ESP-C3 ESP-C3
(Phòng 1) (Phòng 2) (Cửa)
│ │ │
🔌 Relay 🔌 Relay 🔌 Relay
💡 Đèn 💡 Đèn 🚪 Khóa


### Vai trò các thành phần
| Thành phần         | Vai trò                                                                 | Giao thức          |
|--------------------|-------------------------------------------------------------------------|--------------------|
| **ESP32-S3 (Master)** | Nhận lệnh từ MQTT → Gửi ESP-NOW đến các Slave. Nhận trạng thái từ Slave → Publish lên MQTT. | MQTT, ESP-NOW      |
| **ESP-C3 (Slave)**   | Nhận lệnh từ Master → Điều khiển Servo/Relay. Đọc cảm biến → Gửi lên Master. | ESP-NOW, GPIO      |
| **Web Dashboard**    | Giao diện điều khiển, hiển thị trạng thái.                               | MQTT (WebSocket)   |
| **HiveMQ Cloud**     | Trung tâm MQTT, kết nối Web và ESP.                                     | MQTT               |

---

## 📁 CẤU TRÚC THƯ MỤC

SmartHome_Project/
├── README.md # File này
├── firmware/ # Code cho ESP
│ ├── ESP32-S3_Master/ # Code Master
│ │ └── ESP32-S3_Master.ino
│ └── ESP-C3_Slave/ # Code Slave (dùng chung, đổi ID)
│ ├── ESP-C3_Slave_Phong1.ino
│ ├── ESP-C3_Slave_Phong2.ino
│ ├── ESP-C3_Slave_Phong3.ino
│ └── ESP-C3_Slave_Cua.ino
├── web/ # Giao diện Web
│ ├── index.html # Trang chủ
│ ├── caidat.html # Cài đặt
│ ├── kichban.html # Quản lý kịch bản
│ ├── nhietdo.html # Nhiệt độ
│ ├── troly.html # Trợ lý giọng nói
│ ├── css/
│ │ ├── index.css
│ │ ├── caidat.css
│ │ ├── kichban.css
│ │ ├── nhietdo.css
│ │ └── troly.css
│ ├── js/
│ │ ├── index.js # ✅ Đã tích hợp MQTT
│ │ ├── caidat.js # ❌ Không cần MQTT
│ │ ├── kichban.js # ❌ Không cần MQTT
│ │ ├── nhietdo.js # ✅ Đã tích hợp MQTT
│ │ └── troly.js # ❌ Không cần MQTT
│ └── image/ # Ảnh nền
│ ├── animal1.jpg
│ ├── car1.jpg
│ └── ...
└── docs/ # Tài liệu mở rộng (nếu có)


---

## 📡 THÔNG TIN MQTT

### Cấu hình kết nối (HiveMQ Cloud)
| Tham số                 | Giá trị                                                              |
|-------------------------|----------------------------------------------------------------------|
| **Host (Server)**       | `130d14182c00498e952cad93f9325420.s1.eu.hivemq.cloud`              |
| **Port (TCP/TLS - ESP)**| `8883`                                                               |
| **Port (WebSocket - Web)**| `8884`                                                             |
| **Path (WebSocket)**    | `/mqtt`                                                              |
| **Username**            | `Dut09`                                                              |
| **Password**            | `Dat1020192020`                                                      |

### 📋 Danh sách Topic (PHÒNG NGỦ 1)
| Thiết bị        | Topic CMD (Web → ESP)                        | Topic STATE (ESP → Web)                      |
|-----------------|----------------------------------------------|----------------------------------------------|
| Đèn ngủ         | `nha/phong-ngu-1/den-ngu/cmd`               | `nha/phong-ngu-1/den-ngu/state`             |
| Đèn tủ          | `nha/phong-ngu-1/den-tu/cmd`                | `nha/phong-ngu-1/den-tu/state`              |
| Đèn giường      | `nha/phong-ngu-1/den-giuong/cmd`            | `nha/phong-ngu-1/den-giuong/state`          |
| Đèn cây         | `nha/phong-ngu-1/den-cay/cmd`               | `nha/phong-ngu-1/den-cay/state`             |

### 📋 Danh sách Topic (PHÒNG NGỦ 2)
| Thiết bị        | Topic CMD (Web → ESP)                        | Topic STATE (ESP → Web)                      |
|-----------------|----------------------------------------------|----------------------------------------------|
| Đèn học         | `nha/phong-ngu-2/den-hoc/cmd`               | `nha/phong-ngu-2/den-hoc/state`             |
| Đèn ngủ         | `nha/phong-ngu-2/den-ngu/cmd`               | `nha/phong-ngu-2/den-ngu/state`             |
| Đèn decor       | `nha/phong-ngu-2/den-decor/cmd`             | `nha/phong-ngu-2/den-decor/state`           |

### 📋 Danh sách Topic (PHÒNG TRUNG TÂM)
| Thiết bị        | Topic CMD (Web → ESP)                        | Topic STATE (ESP → Web)                      |
|-----------------|----------------------------------------------|----------------------------------------------|
| Đèn trần        | `nha/phong-trung-tam/den-tran/cmd`          | `nha/phong-trung-tam/den-tran/state`        |
| Đèn trang trí   | `nha/phong-trung-tam/den-trang-tri/cmd`     | `nha/phong-trung-tam/den-trang-tri/state`   |
| Đèn thờ         | `nha/phong-trung-tam/den-tho/cmd`           | `nha/phong-trung-tam/den-tho/state`         |

### 📋 Danh sách Topic (PHÒNG KHÁCH)
| Thiết bị        | Topic CMD (Web → ESP)                        | Topic STATE (ESP → Web)                      |
|-----------------|----------------------------------------------|----------------------------------------------|
| Đèn chùm        | `nha/phong-khach/den-chum/cmd`              | `nha/phong-khach/den-chum/state`            |

### 📋 Danh sách Topic (NHIỆT ĐỘ)
| Khu vực             | Topic (ESP → Web)                            |
|---------------------|----------------------------------------------|
| Phòng ngủ 1         | `nha/phong-ngu-1/nhiet-do`                  |
| Phòng ngủ 2         | `nha/phong-ngu-2/nhiet-do`                  |
| Phòng trung tâm     | `nha/phong-trung-tam/nhiet-do`              |
| Phòng khách         | `nha/phong-khach/nhiet-do`                  |
| Ngoài trời          | `nha/ngoai-troi/nhiet-do`                   |

### 📋 Topic KỊCH BẢN
| Chức năng                     | Topic                     | Payload                  |
|-------------------------------|---------------------------|--------------------------|
| Chạy kịch bản (Web → ESP)     | `nha/kich-ban/lenh`       | `{"scene": "DI_NGU"}`    |

### 📦 Payload mẫu
- **Lệnh bật/tắt (Web → ESP):**
```json
{ "cmd": 1 }   // Bật
{ "cmd": 0 }   // Tắt
{ "state": true, "temperature": 24.5 }
{ "temperature": 24.5 }

📄 CHI TIẾT CÁC FILE
1. index.js (Trang chủ - ĐÃ CÓ MQTT)
Chức năng:

Hiển thị danh sách phòng và thiết bị.

Bật/tắt thiết bị → Gửi MQTT (topic .../cmd).

Nhận trạng thái từ ESP (topic .../state) → Cập nhật giao diện.

Hiển thị kịch bản đã lưu → Khi chạy, gửi tên kịch bản lên MQTT (topic nha/kich-ban/lenh).

MQTT: ✅ Đã tích hợp (kết nối, subscribe, publish).

Mapping topic:const topicMapping = {
    'phong-ngu-1': {
        'Đèn ngủ': { cmd: 'nha/phong-ngu-1/den-ngu/cmd', state: 'nha/phong-ngu-1/den-ngu/state' },
        // ...
    }
};

2. nhietdo.js (Nhiệt độ - ĐÃ CÓ MQTT)
Chức năng:

Hiển thị nhiệt độ dạng gauge và biểu đồ.

Subscribe các topic .../nhiet-do.

Khi nhận dữ liệu → Cập nhật gauge và biểu đồ.

Nếu chưa có dữ liệu → Hiển thị -- °C.

MQTT: ✅ Đã tích hợp (kết nối, subscribe).

Cấu hình:
const tempTopics = {
    'Phòng khách': 'nha/phong-khach/nhiet-do',
    'Phòng ngủ 1': 'nha/phong-ngu-1/nhiet-do',
    // ...
};

3. caidat.js (Cài đặt - KHÔNG CẦN MQTT)
Chức năng:

Quản lý giao diện: màu chủ đạo, hình nền, độ mờ, chế độ tối.

Quản lý công tắc tùy chỉnh (thêm, sửa, xóa).

Cài đặt âm thanh, tần suất cập nhật.

Reset cài đặt về mặc định.

MQTT: ❌ Không cần (chỉ dùng localStorage).

4. kichban.js (Kịch bản - KHÔNG CẦN MQTT)
Chức năng:

Tạo, sửa, xóa kịch bản.

Lưu vào localStorage (key: scenes).

Khi chạy, chỉ lưu tên kịch bản vào localStorage để index.js đọc và gửi MQTT.

MQTT: ❌ Không cần (chỉ lưu dữ liệu).

5. troly.js (Trợ lý giọng nói - KHÔNG CẦN MQTT)
Chức năng:

Nhận diện giọng nói (Speech Recognition).

Phản hồi bằng giọng nói (Speech Synthesis).

Xử lý lệnh cơ bản: "Bật đèn", "Tắt đèn", "Nhiệt độ", "Xem phim"...

MQTT: ❌ Không cần (chỉ xử lý giọng nói, không gửi MQTT trực tiếp).

🔧 HƯỚNG DẪN CÀI ĐẶT
1. Clone dự án

git clone https://github.com/your-username/SmartHome_Project.git
cd SmartHome_Project

3. Cài thư viện
Vào Sketch → Include Library → Manage Libraries, cài các thư viện sau:

PubSubClient

ArduinoJson

ESP32Servo

ElegantOTA (nếu dùng OTA)

4. Nạp code cho ESP32-S3 Master
Mở firmware/ESP32-S3_Master/ESP32-S3_Master.ino.

Sửa thông tin WiFi và MQTT.

Chọn board ESP32S3 Dev Module.

Bấm Upload.

Mở Serial Monitor (115200) → Copy MAC Address (để dùng cho Slave).

5. Nạp code cho ESP-C3 Slave
Mở firmware/ESP-C3_Slave/ESP-C3_Slave_Phong1.ino.

Sửa MY_ID, masterMAC[] (lấy từ Serial Monitor của Master).

Sửa WiFi và MQTT (nếu cần).

Chọn board ESP32C3 Dev Module.

Bấm Upload.

Làm tương tự cho các Slave khác (đổi ID).

6. Upload Web lên GitHub Pages
Tạo repository mới trên GitHub (public).

Upload toàn bộ thư mục web/ lên.

Vào Settings → Pages, chọn branch main, lưu.

Lấy link: https://<username>.github.io/<repo>/.

7. Kiểm tra
Mở link GitHub trên điện thoại (dùng 4G hoặc WiFi).

Bấm nút bật/tắt → Quan sát relay/servo trên ESP-C3.

Mở trang nhietdo.html → Chờ dữ liệu từ ESP.

🚀 CÁCH VẬN HÀNH
Điều khiển thiết bị
Mở Web Dashboard (link GitHub).

Chọn phòng → Bấm toggle (bật/tắt).

Lệnh được gửi qua MQTT → ESP32-S3 nhận → ESP-NOW → ESP-C3 thực thi.

Chạy kịch bản
Tạo kịch bản ở kichban.html.

Về index.html, chạy kịch bản.

Web gửi tên kịch bản lên MQTT (nha/kich-ban/lenh).

ESP32-S3 nhận → Tự động quyết định bật/tắt thiết bị.

Xem nhiệt độ
Mở nhietdo.html.

Web subscribe các topic .../nhiet-do.

Khi ESP gửi dữ liệu → Gauge và biểu đồ cập nhật.

Trợ lý giọng nói
Mở troly.html.

Nhấn nút micro → Nói lệnh.

Lệnh được xử lý, phản hồi bằng giọng nói.

🔒 BẢO MẬT
Đổi mật khẩu HiveMQ Cloud ngay sau khi test.

Không share username/password công khai.

Sử dụng TLS/SSL (Port 8883, 8884) cho mọi kết nối MQTT.

Nếu dùng OTA, đặt mật khẩu cho OTA (đã có trong code).

📝 GHI CHÚ MỞ RỘNG
Thêm thiết bị mới
Thêm vào baseDevices trong index.js.

Thêm mapping vào topicMapping.

Nạp lại web và code ESP.

Thêm phòng mới
Thêm vào baseDevices.

Thêm mapping vào topicMapping.

Thêm vào roomMapping (nếu cần).

Nạp lại web và code ESP.

Tích hợp cảm biến (DHT, PIR...)
Code ESP-C3 đọc cảm biến.

Gửi lên Master qua ESP-NOW (dùng struct mới).

Master publish lên MQTT.

Web subscribe và hiển thị.

🆘 HỖ TRỢ
Email: linhong263@gmail.com

GitHub Issues: https://github.com/your-username/SmartHome_Project/issues (nếu có)

Made with ❤️ by Thái Đạt
Lớp 11 - Yêu thích IoT và Lập trình nhúng