(function() {
    'use strict';

    // ===== HÀM XÓA DẤU TIẾNG VIỆT =====
    function removeAccents(str) {
        const map = {
            'á':'a','à':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ắ':'a','ằ':'a','ẳ':'a','ẵ':'a','ặ':'a',
            'â':'a','ấ':'a','ầ':'a','ẩ':'a','ẫ':'a','ậ':'a','é':'e','è':'e','ẻ':'e','ẽ':'e','ẹ':'e',
            'ê':'e','ế':'e','ề':'e','ể':'e','ễ':'e','ệ':'e','í':'i','ì':'i','ỉ':'i','ĩ':'i','ị':'i',
            'ó':'o','ò':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ố':'o','ồ':'o','ổ':'o','ỗ':'o','ộ':'o',
            'ơ':'o','ớ':'o','ờ':'o','ở':'o','ỡ':'o','ợ':'o','ú':'u','ù':'u','ủ':'u','ũ':'u','ụ':'u',
            'ư':'u','ứ':'u','ừ':'u','ử':'u','ữ':'u','ự':'u','ý':'y','ỳ':'y','ỷ':'y','ỹ':'y','ỵ':'y',
            'đ':'d','Á':'A','À':'A','Ả':'A','Ã':'A','Ạ':'A','Ă':'A','Ắ':'A','Ằ':'A','Ẳ':'A','Ẵ':'A','Ặ':'A',
            'Â':'A','Ấ':'A','Ầ':'A','Ẩ':'A','Ẫ':'A','Ậ':'A','É':'E','È':'E','Ẻ':'E','Ẽ':'E','Ẹ':'E',
            'Ê':'E','Ế':'E','Ề':'E','Ể':'E','Ễ':'E','Ệ':'E','Í':'I','Ì':'I','Ỉ':'I','Ĩ':'I','Ị':'I',
            'Ó':'O','Ò':'O','Ỏ':'O','Õ':'O','Ọ':'O','Ô':'O','Ố':'O','Ồ':'O','Ổ':'O','Ỗ':'O','Ộ':'O',
            'Ơ':'O','Ớ':'O','Ờ':'O','Ở':'O','Ỡ':'O','Ợ':'O','Ú':'U','Ù':'U','Ủ':'U','Ũ':'U','Ụ':'U',
            'Ư':'U','Ứ':'U','Ừ':'U','Ử':'U','Ữ':'U','Ự':'U','Ý':'Y','Ỳ':'Y','Ỷ':'Y','Ỹ':'Y','Ỵ':'Y','Đ':'D'
        };
        return str.replace(/[^a-zA-Z0-9 ]/g, function(ch) {
            return map[ch] || ch;
        });
    }

    function normalizeSceneName(name) {
        return removeAccents(name).toUpperCase().replace(/ /g, '_');
    }

    // ===== DANH SÁCH THIẾT BỊ CỐ ĐỊNH =====
    const baseDevices = { /* ... giữ nguyên như bạn đã có ... */ };

    // ===== KỊCH BẢN MẶC ĐỊNH =====
    const scenesPreset = { /* ... giữ nguyên ... */ };

    // ===== CẤU HÌNH MQTT =====
    const mqttConfig = { ... };

    // ===== MAPPING ROOM & DEVICE =====
    const topicMapping = { ... };

    // ===== HÀM MAP =====
    function getRoomId(roomName) { ... }
    function getDeviceId(roomName, deviceName) { ... }

    // ===== BIẾN TOÀN CỤC =====
    let roomDevices = {};
    let mqttClient = null;
    let mqttConnected = false;

    const roomGrid = document.getElementById('roomGrid');
    const deviceGrid = document.getElementById('deviceGrid');
    const roomTitle = document.getElementById('roomTitle');
    const appContainer = document.getElementById('appContainer');
    const myScenesContainer = document.getElementById('myScenesContainer');

    // ===== HÀM LẤY CÔNG TẮC =====
    function getCustomSwitches() { ... }

    // ===== KHỞI TẠO roomDevices =====
    function buildRoomDevices() { ... }

    // ===== GỬI CẤU HÌNH KỊCH BẢN =====
    function sendSceneConfig(sceneData) {
        if (!mqttConnected || !mqttClient) {
            console.warn('⚠️ MQTT chưa kết nối, không gửi được cấu hình');
            return false;
        }

        const sceneCode = normalizeSceneName(sceneData.name);
        const actions = sceneData.devices.map(item => ({
            room: getRoomId(item.room),
            device: getDeviceId(item.room, item.name),
            cmd: item.state ? 1 : 0
        }));

        const payload = JSON.stringify({
            name: sceneCode,
            actions: actions
        });

        const topic = "nha/kich-ban/cau-hinh";
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = topic;
        mqttClient.send(msg);
        console.log(`📤 Sent Scene Config: ${topic} -> ${payload}`);
        return true;
    }

    // ===== GỬI LỆNH KỊCH BẢN =====
    function sendSceneCommand(sceneName) {
        if (!mqttConnected || !mqttClient) {
            console.warn('⚠️ MQTT chưa kết nối, không gửi được lệnh');
            return;
        }
        const sceneCode = normalizeSceneName(sceneName);
        const payload = JSON.stringify({ scene: sceneCode });
        const topic = "nha/kich-ban/lenh";
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = topic;
        mqttClient.send(msg);
        console.log(`📤 Sent MQTT Scene: ${topic} -> ${payload}`);
    }

    // ===== ÁP DỤNG KỊCH BẢN =====
    function applyScene(sceneData) {
        if (!sceneData || !sceneData.name) {
            showToast('⚠️ Kịch bản không hợp lệ');
            return;
        }

        if (sceneData.devices) {
            sceneData.devices.forEach(item => {
                const room = item.room;
                const devName = item.name;
                const state = item.state;
                if (roomDevices[room]) {
                    const dev = roomDevices[room].find(d => d.name === devName);
                    if (dev) {
                        dev.on = state;
                        dev.status = state ? 'Đang bật' : 'Đang tắt';
                    }
                }
            });
        }

        const activeRoom = document.querySelector('.room-btn.active');
        if (activeRoom) {
            renderDevices(activeRoom.dataset.room);
        } else {
            const firstRoom = document.querySelector('.room-btn');
            if (firstRoom) {
                firstRoom.classList.add('active');
                renderDevices(firstRoom.dataset.room);
                roomTitle.textContent = firstRoom.textContent;
            }
        }

        sendSceneConfig(sceneData);
        sendSceneCommand(sceneData.name);

        showToast(`✅ Đã chạy kịch bản "${sceneData.name}"`);
    }

    // ===== GỬI LỆNH MQTT CHO TỪNG THIẾT BỊ =====
    function sendMQTTCommand(room, deviceName, state) {
        if (!mqttConnected || !mqttClient) {
            console.warn('⚠️ MQTT chưa kết nối, không gửi được lệnh');
            return;
        }

        const topicMap = topicMapping[room];
        if (!topicMap) {
            console.warn(`⚠️ Không tìm thấy mapping cho phòng: ${room}`);
            return;
        }

        const deviceTopic = topicMap[deviceName];
        if (!deviceTopic) {
            console.warn(`⚠️ Không tìm thấy mapping cho thiết bị: ${deviceName}`);
            return;
        }

        const payload = JSON.stringify({ cmd: state ? 1 : 0 });
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = deviceTopic.cmd;
        mqttClient.send(msg);
        console.log(`📤 Sent MQTT: ${deviceTopic.cmd} -> ${payload}`);
    }

    // ===== RENDER THIẾT BỊ =====
    function renderDevices(roomKey) { /* ... giữ nguyên ... */ }

    function updateCustomSwitchState(room, name, state) { ... }
    function highlightRoom(roomKey) { ... }
    function handleRoomClick(roomKey) { ... }

    // ===== LOAD KỊCH BẢN =====
    function loadMyScenes() {
        const scenes = JSON.parse(localStorage.getItem('scenes')) || [];
        if (scenes.length === 0) {
            myScenesContainer.innerHTML = '<span style="color:#4a5a7a;font-size:14px;">Chưa có kịch bản.</span>';
            return;
        }
        myScenesContainer.innerHTML = '';
        scenes.forEach((scene, index) => {
            const btn = document.createElement('button');
            btn.className = 'my-scene-btn';
            btn.innerHTML = `<i class="fas ${scene.icon || 'fa-film'}"></i> ${scene.name}`;
            btn.dataset.index = index;
            btn.addEventListener('click', function() {
                const sceneObj = scenes[index];
                applyScene(sceneObj);
            });
            myScenesContainer.appendChild(btn);
        });
    }

    // ===== SỰ KIỆN NHANH =====
    document.querySelectorAll('.scene-card').forEach(card => {
        card.addEventListener('click', function() {
            const sceneKey = this.dataset.scene;
            const sceneData = scenesPreset[sceneKey];
            if (sceneData) {
                applyScene(sceneData);
            } else {
                showToast('Không tìm thấy kịch bản');
            }
        });
    });

    // ===== SỰ KIỆN PHÒNG =====
    roomGrid.querySelectorAll('.room-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            handleRoomClick(this.dataset.room);
        });
    });

    // ===== MQTT =====
    function connectMQTT() {
        if (typeof Paho === 'undefined') {
            console.warn('⚠️ Thư viện Paho MQTT chưa được load!');
            setTimeout(connectMQTT, 1000);
            return;
        }

        mqttClient = new Paho.MQTT.Client(mqttConfig.broker, mqttConfig.clientId);

        mqttClient.onConnectionLost = function(response) {
            mqttConnected = false;
            console.log('❌ Mất kết nối MQTT:', response.errorMessage);
            updateMQTTStatus(false);
            setTimeout(connectMQTT, 5000);
        };

        mqttClient.onMessageArrived = function(message) {
            console.log('📨 Received MQTT:', message.destinationName, message.payloadString);
            handleMQTTMessage(message.destinationName, message.payloadString);
        };

        mqttClient.connect({
            userName: mqttConfig.username,
            password: mqttConfig.password,
            useSSL: true,
            onSuccess: function() {
                mqttConnected = true;
                console.log('✅ Đã kết nối HiveMQ Cloud');
                updateMQTTStatus(true);
                subscribeAllTopics();
            },
            onFailure: function(err) {
                mqttConnected = false;
                console.error('❌ Kết nối MQTT thất bại:', err.errorMessage);
                updateMQTTStatus(false);
                setTimeout(connectMQTT, 5000);
            }
        });
    }

    function subscribeAllTopics() {
        const allTopics = [];
        for (const room in topicMapping) {
            for (const device in topicMapping[room]) {
                allTopics.push(topicMapping[room][device].state);
            }
        }
        allTopics.push('nha/kich-ban/phan-hoi');
        allTopics.forEach(topic => {
            mqttClient.subscribe(topic);
            console.log(`📡 Subscribed: ${topic}`);
        });
    }

    function handleMQTTMessage(topic, payload) {
        try {
            const data = JSON.parse(payload);
            if (topic === 'nha/kich-ban/phan-hoi') {
                console.log('📥 Phản hồi từ Master:', data);
                return;
            }
            for (const room in topicMapping) {
                for (const deviceName in topicMapping[room]) {
                    if (topicMapping[room][deviceName].state === topic) {
                        const device = roomDevices[room]?.find(d => d.name === deviceName);
                        if (device) {
                            device.on = data.state || false;
                            device.status = device.on ? 'Đang bật' : 'Đang tắt';
                            const activeRoom = document.querySelector('.room-btn.active');
                            if (activeRoom && activeRoom.dataset.room === room) {
                                renderDevices(room);
                            }
                            console.log(`📥 Cập nhật: ${room} - ${deviceName} -> ${device.on ? 'ON' : 'OFF'}`);
                            return;
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('⚠️ Lỗi parse MQTT message:', e);
        }
    }

    function updateMQTTStatus(connected) {
        const statusEl = document.getElementById('mqttStatus');
        if (statusEl) {
            if (connected) {
                statusEl.innerHTML = '✅ MQTT đã kết nối';
                statusEl.style.color = '#4ade80';
            } else {
                statusEl.innerHTML = '⏳ MQTT đang kết nối...';
                statusEl.style.color = '#f87171';
            }
        }
    }

    // ===== KHỞI TẠO =====
    function init() {
        buildRoomDevices();
        const defaultRoom = 'phong-ngu-1';
        const defaultBtn = roomGrid.querySelector(`.room-btn[data-room="${defaultRoom}"]`);
        if (defaultBtn) {
            defaultBtn.classList.add('active');
            handleRoomClick(defaultRoom);
        }
        loadMyScenes();
        loadSettings();
        connectMQTT();
        
        window.sendSceneConfig = sendSceneConfig;
        window.mqttConnected = () => mqttConnected;
        window.applyScene = applyScene;
    }

    // ===== LẮNG NGHE STORAGE =====
    window.addEventListener('storage', function(e) {
        if (e.key === 'scenes') {
            loadMyScenes();
        }
        if (e.key === 'customSwitches') {
            buildRoomDevices();
            const activeRoom = document.querySelector('.room-btn.active');
            if (activeRoom) renderDevices(activeRoom.dataset.room);
        }
        if (e.key === 'bgImage') updateBackgroundFromStorage();
        if (e.key === 'primaryColor') {
            document.documentElement.style.setProperty('--primary-color', e.newValue);
        }
        if (e.key === 'glassBlur') document.documentElement.style.setProperty('--glass-blur', e.newValue + 'px');
        if (e.key === 'glassOpacity') document.documentElement.style.setProperty('--glass-opacity', e.newValue);
        if (e.key === 'darkMode') location.reload();
    });

    // ===== CÀI ĐẶT GIAO DIỆN =====
    function updateBackgroundFromStorage() {
        const bg = localStorage.getItem('bgImage');
        if (bg) {
            document.body.style.backgroundImage = `url(${bg})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        } else {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.style.background = '';
        }
    }

    function loadSettings() {
        const primary = localStorage.getItem('primaryColor');
        if (primary) document.documentElement.style.setProperty('--primary-color', primary);
        const glassOpacity = localStorage.getItem('glassOpacity');
        if (glassOpacity) document.documentElement.style.setProperty('--glass-opacity', glassOpacity);
        const glassBlur = localStorage.getItem('glassBlur');
        if (glassBlur) document.documentElement.style.setProperty('--glass-blur', glassBlur + 'px');
        updateBackgroundFromStorage();

        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.style.backgroundColor = '#1a1a2e';
            appContainer.style.background = 'rgba(0,0,0,0.4)';
            appContainer.style.borderColor = 'rgba(255,255,255,0.1)';
        } else {
            document.body.style.backgroundColor = '';
            appContainer.style.background = '';
            appContainer.style.borderColor = '';
        }
    }

    // ===== TOAST & ÂM THANH =====
    function showToast(msg) { ... }
    function playClickSound() { ... }

    const styleAnim = document.createElement('style');
    styleAnim.textContent = `@keyframes fadeInDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`;
    document.head.appendChild(styleAnim);

    init();
})();
