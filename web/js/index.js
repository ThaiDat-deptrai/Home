(function() {
    'use strict';

    // ===== DANH SÁCH THIẾT BỊ CỐ ĐỊNH =====
    const baseDevices = {
        'phong-ngu-1': [
            { name: 'Đèn ngủ', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn tủ', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn giường', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn cây', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' }
        ],
        'phong-ngu-2': [
            { name: 'Đèn học', icon: 'fa-lamp', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn ngủ', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn decor', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' }
        ],
        'phong-trung-tam': [
            { name: 'Đèn trần', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn trang trí', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' },
            { name: 'Đèn thờ', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' }
        ],
        'phong-khach': [
            { name: 'Đèn chùm', icon: 'fa-lightbulb', status: 'Đang tắt', on: false, type: 'light' }
        ]
    };

    // ===== KỊCH BẢN MẶC ĐỊNH =====
    const scenesPreset = {
        movie: {
            name: 'Xem phim',
            devices: [
                { room: 'phong-ngu-1', name: 'Đèn ngủ', state: false },
                { room: 'phong-ngu-1', name: 'Đèn tủ', state: false },
                { room: 'phong-ngu-1', name: 'Đèn giường', state: false },
                { room: 'phong-ngu-1', name: 'Đèn cây', state: false },
                { room: 'phong-ngu-2', name: 'Đèn học', state: false },
                { room: 'phong-ngu-2', name: 'Đèn ngủ', state: false },
                { room: 'phong-ngu-2', name: 'Đèn decor', state: false },
                { room: 'phong-trung-tam', name: 'Đèn trần', state: false },
                { room: 'phong-trung-tam', name: 'Đèn trang trí', state: false },
                { room: 'phong-trung-tam', name: 'Đèn thờ', state: false },
                { room: 'phong-khach', name: 'Đèn chùm', state: false }
            ]
        },
        sleep: {
            name: 'Đi ngủ',
            devices: [
                { room: 'phong-ngu-1', name: 'Đèn ngủ', state: true },
                { room: 'phong-ngu-1', name: 'Đèn tủ', state: false },
                { room: 'phong-ngu-1', name: 'Đèn giường', state: true },
                { room: 'phong-ngu-1', name: 'Đèn cây', state: false },
                { room: 'phong-ngu-2', name: 'Đèn học', state: false },
                { room: 'phong-ngu-2', name: 'Đèn ngủ', state: true },
                { room: 'phong-ngu-2', name: 'Đèn decor', state: false },
                { room: 'phong-trung-tam', name: 'Đèn trần', state: false },
                { room: 'phong-trung-tam', name: 'Đèn trang trí', state: false },
                { room: 'phong-trung-tam', name: 'Đèn thờ', state: false },
                { room: 'phong-khach', name: 'Đèn chùm', state: false }
            ]
        },
        leave: {
            name: 'Rời nhà',
            devices: [
                { room: 'phong-ngu-1', name: 'Đèn ngủ', state: false },
                { room: 'phong-ngu-1', name: 'Đèn tủ', state: false },
                { room: 'phong-ngu-1', name: 'Đèn giường', state: false },
                { room: 'phong-ngu-1', name: 'Đèn cây', state: false },
                { room: 'phong-ngu-2', name: 'Đèn học', state: false },
                { room: 'phong-ngu-2', name: 'Đèn ngủ', state: false },
                { room: 'phong-ngu-2', name: 'Đèn decor', state: false },
                { room: 'phong-trung-tam', name: 'Đèn trần', state: false },
                { room: 'phong-trung-tam', name: 'Đèn trang trí', state: false },
                { room: 'phong-trung-tam', name: 'Đèn thờ', state: false },
                { room: 'phong-khach', name: 'Đèn chùm', state: false }
            ]
        },
        party: {
            name: 'Tiệc tùng',
            devices: [
                { room: 'phong-ngu-1', name: 'Đèn ngủ', state: true },
                { room: 'phong-ngu-1', name: 'Đèn tủ', state: true },
                { room: 'phong-ngu-1', name: 'Đèn giường', state: true },
                { room: 'phong-ngu-1', name: 'Đèn cây', state: true },
                { room: 'phong-ngu-2', name: 'Đèn học', state: true },
                { room: 'phong-ngu-2', name: 'Đèn ngủ', state: true },
                { room: 'phong-ngu-2', name: 'Đèn decor', state: true },
                { room: 'phong-trung-tam', name: 'Đèn trần', state: true },
                { room: 'phong-trung-tam', name: 'Đèn trang trí', state: true },
                { room: 'phong-trung-tam', name: 'Đèn thờ', state: true },
                { room: 'phong-khach', name: 'Đèn chùm', state: true }
            ]
        }
    };

    // ===== CẤU HÌNH MQTT =====
    const mqttConfig = {
        broker: "wss://130d14182c00498e952cad93f9325420.s1.eu.hivemq.cloud:8884/mqtt",
        username: "Dut09",
        password: "Dat1020192020",
        clientId: "WebDashboard_" + Math.random().toString(16).substr(2, 8)
    };

    // ===== MAPPING ROOM & DEVICE (TIẾNG VIỆT) =====
    const topicMapping = {
        'phong-ngu-1': {
            'Đèn ngủ': { cmd: 'nha/phong-ngu-1/den-ngu/cmd', state: 'nha/phong-ngu-1/den-ngu/state' },
            'Đèn tủ': { cmd: 'nha/phong-ngu-1/den-tu/cmd', state: 'nha/phong-ngu-1/den-tu/state' },
            'Đèn giường': { cmd: 'nha/phong-ngu-1/den-giuong/cmd', state: 'nha/phong-ngu-1/den-giuong/state' },
            'Đèn cây': { cmd: 'nha/phong-ngu-1/den-cay/cmd', state: 'nha/phong-ngu-1/den-cay/state' }
        },
        'phong-ngu-2': {
            'Đèn học': { cmd: 'nha/phong-ngu-2/den-hoc/cmd', state: 'nha/phong-ngu-2/den-hoc/state' },
            'Đèn ngủ': { cmd: 'nha/phong-ngu-2/den-ngu/cmd', state: 'nha/phong-ngu-2/den-ngu/state' },
            'Đèn decor': { cmd: 'nha/phong-ngu-2/den-decor/cmd', state: 'nha/phong-ngu-2/den-decor/state' }
        },
        'phong-trung-tam': {
            'Đèn trần': { cmd: 'nha/phong-trung-tam/den-tran/cmd', state: 'nha/phong-trung-tam/den-tran/state' },
            'Đèn trang trí': { cmd: 'nha/phong-trung-tam/den-trang-tri/cmd', state: 'nha/phong-trung-tam/den-trang-tri/state' },
            'Đèn thờ': { cmd: 'nha/phong-trung-tam/den-tho/cmd', state: 'nha/phong-trung-tam/den-tho/state' }
        },
        'phong-khach': {
            'Đèn chùm': { cmd: 'nha/phong-khach/den-chum/cmd', state: 'nha/phong-khach/den-chum/state' }
        }
    };

    // ===== BIẾN TOÀN CỤC =====
    let roomDevices = {};
    let mqttClient = null;
    let mqttConnected = false;

    const roomGrid = document.getElementById('roomGrid');
    const deviceGrid = document.getElementById('deviceGrid');
    const roomTitle = document.getElementById('roomTitle');
    const appContainer = document.getElementById('appContainer');
    const myScenesContainer = document.getElementById('myScenesContainer');

    // ===== HÀM LẤY CÔNG TẮC TỪ LOCALSTORAGE =====
    function getCustomSwitches() {
        try {
            return JSON.parse(localStorage.getItem('customSwitches')) || [];
        } catch { return []; }
    }

    // ===== KHỞI TẠO roomDevices =====
    function buildRoomDevices() {
        roomDevices = JSON.parse(JSON.stringify(baseDevices));
        const switches = getCustomSwitches();
        switches.forEach(sw => {
            const room = sw.room;
            if (!roomDevices[room]) roomDevices[room] = [];
            const exists = roomDevices[room].some(d => d.name === sw.name);
            if (!exists) {
                roomDevices[room].push({
                    name: sw.name,
                    icon: sw.icon || 'fa-lightbulb',
                    status: sw.on ? 'Đang bật' : 'Đang tắt',
                    on: sw.on || false,
                    type: 'custom'
                });
            }
        });
    }

    // ===== HÀM ÁP DỤNG KỊCH BẢN (CÁCH MỚI - CHỈ GỬI TÊN) =====
    function applyScene(sceneData) {
        if (!sceneData || !sceneData.name) {
            showToast('⚠️ Kịch bản không hợp lệ');
            return;
        }

        // 1. Cập nhật giao diện (bật/tắt ảo trên web)
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

        // 2. Cập nhật giao diện
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

        // 3. Gửi tên kịch bản qua MQTT (CHỈ 1 GÓI DUY NHẤT)
        sendSceneCommand(sceneData.name);

        showToast(`✅ Đã chạy kịch bản "${sceneData.name}"`);
    }

    // ===== GỬI LỆNH KỊCH BẢN QUA MQTT =====
    function sendSceneCommand(sceneName) {
        if (!mqttConnected || !mqttClient) {
            console.warn('⚠️ MQTT chưa kết nối, không gửi được lệnh kịch bản');
            return;
        }

        // Chuyển tên kịch bản thành mã (ví dụ: "Xem phim" -> "XEM_PHIM")
        const sceneCode = sceneName.toUpperCase().replace(/ /g, '_');
        // Một số trường hợp đặc biệt
        const sceneMap = {
            'XEM_PHIM': 'XEM_PHIM',
            'ĐI_NGỦ': 'DI_NGU',
            'RỜI_NHÀ': 'ROI_NHA',
            'TIỆC_TÙNG': 'TIEC_TUNG'
        };
        const finalCode = sceneMap[sceneCode] || sceneCode;

        const payload = JSON.stringify({ scene: finalCode });
        const topic = "nha/kich-ban/lenh";
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = topic;
        mqttClient.send(msg);
        console.log(`📤 Sent MQTT Scene: ${topic} -> ${payload}`);
    }

    // ===== GỬI LỆNH MQTT CHO TỪNG THIẾT BỊ (GIỮ NGUYÊN CHO TOGGLE) =====
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
    function renderDevices(roomKey) {
        const devices = roomDevices[roomKey];
        if (!devices || devices.length === 0) {
            deviceGrid.innerHTML = '<p style="color:#4a5a7a;padding:20px;">Phòng này chưa có thiết bị.</p>';
            return;
        }
        let html = '';
        devices.forEach((dev, index) => {
            const statusText = dev.on ? 'Đang bật' : 'Đang tắt';
            const toggleClass = dev.on ? 'active' : '';
            html += `
                <div class="device-card" data-device-index="${index}" data-room="${roomKey}">
                    <div class="device-icon"><i class="fas ${dev.icon}"></i></div>
                    <div class="device-name">${dev.name}</div>
                    <div class="device-status">${statusText}</div>
                    <div class="toggle-wrapper">
                        <button class="toggle ${toggleClass}" data-index="${index}" data-room="${roomKey}"></button>
                    </div>
                </div>
            `;
        });
        deviceGrid.innerHTML = html;

        deviceGrid.querySelectorAll('.toggle').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const room = this.dataset.room;
                const idx = parseInt(this.dataset.index);
                const dev = roomDevices[room][idx];
                dev.on = !dev.on;
                dev.status = dev.on ? 'Đang bật' : 'Đang tắt';
                renderDevices(room);
                highlightRoom(room);

                // ===== GỬI LỆNH MQTT CHO TỪNG THIẾT BỊ =====
                sendMQTTCommand(room, dev.name, dev.on);

                if (dev.type === 'custom') {
                    updateCustomSwitchState(room, dev.name, dev.on);
                }
                if (localStorage.getItem('soundEnabled') !== 'false') playClickSound();
            });
        });
    }

    function updateCustomSwitchState(room, name, state) {
        let switches = getCustomSwitches();
        const sw = switches.find(s => s.room === room && s.name === name);
        if (sw) {
            sw.on = state;
            localStorage.setItem('customSwitches', JSON.stringify(switches));
            window.dispatchEvent(new Event('storage'));
        }
    }

    function highlightRoom(roomKey) {
        roomGrid.querySelectorAll('.room-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.room === roomKey);
        });
    }

    function handleRoomClick(roomKey) {
        const roomName = {
            'phong-ngu-1': 'Phòng ngủ 1',
            'phong-ngu-2': 'Phòng ngủ 2',
            'phong-trung-tam': 'Phòng trung tâm',
            'phong-khach': 'Phòng khách'
        }[roomKey] || roomKey;
        roomTitle.textContent = roomName;
        renderDevices(roomKey);
        highlightRoom(roomKey);
    }

    // ===== LOAD KỊCH BẢN TỪ localStorage =====
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

    // ===== SỰ KIỆN CHO CÁC KỊCH BẢN NHANH =====
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

    // ===== SỰ KIỆN CHO PHÒNG =====
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
        allTopics.forEach(topic => {
            mqttClient.subscribe(topic);
            console.log(`📡 Subscribed: ${topic}`);
        });
    }

    function handleMQTTMessage(topic, payload) {
        try {
            const data = JSON.parse(payload);
            // Tìm device từ topic
            for (const room in topicMapping) {
                for (const deviceName in topicMapping[room]) {
                    if (topicMapping[room][deviceName].state === topic) {
                        const device = roomDevices[room]?.find(d => d.name === deviceName);
                        if (device) {
                            device.on = data.state || false;
                            device.status = device.on ? 'Đang bật' : 'Đang tắt';
                            // Cập nhật giao diện nếu đang hiển thị phòng này
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
    }

    // ===== LẮNG NGHE SỰ KIỆN STORAGE =====
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
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `position: fixed; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); color: white; padding: 14px 28px; border-radius: 40px; font-size: 16px; font-weight: 500; z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.2); animation: fadeInDown 0.4s ease;`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.4s'; setTimeout(() => toast.remove(), 500); }, 2500);
    }

    function playClickSound() {
        try { const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); osc.frequency.value = 800; osc.type = 'sine'; gain.gain.value = 0.1; osc.start(); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05); osc.stop(audioCtx.currentTime + 0.05); } catch(e) {}
    }

    const styleAnim = document.createElement('style');
    styleAnim.textContent = `@keyframes fadeInDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`;
    document.head.appendChild(styleAnim);

    // Bắt đầu
    init();
})();