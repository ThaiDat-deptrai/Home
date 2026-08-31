(function() {
    'use strict';

    // ===== CẤU HÌNH =====
    const mqttConfig = {
        broker: "wss://130d14182c00498e952cad93f9325420.s1.eu.hivemq.cloud:8884/mqtt",
        username: "Dut09",
        password: "Dat1020192020",
        clientId: "Automation_" + Math.random().toString(16).substr(2, 8)
    };

    // ===== DANH SÁCH THIẾT BỊ =====
    const allDevices = [
        { room: 1, roomName: 'Phòng ngủ 1', device: 1, deviceName: 'Đèn ngủ' },
        { room: 1, roomName: 'Phòng ngủ 1', device: 2, deviceName: 'Đèn tủ' },
        { room: 1, roomName: 'Phòng ngủ 1', device: 3, deviceName: 'Đèn giường' },
        { room: 1, roomName: 'Phòng ngủ 1', device: 4, deviceName: 'Đèn cây' },
        { room: 2, roomName: 'Phòng ngủ 2', device: 1, deviceName: 'Đèn học' },
        { room: 2, roomName: 'Phòng ngủ 2', device: 2, deviceName: 'Đèn ngủ' },
        { room: 2, roomName: 'Phòng ngủ 2', device: 3, deviceName: 'Đèn decor' },
        { room: 3, roomName: 'Phòng trung tâm', device: 1, deviceName: 'Đèn trần' },
        { room: 3, roomName: 'Phòng trung tâm', device: 2, deviceName: 'Đèn trang trí' },
        { room: 3, roomName: 'Phòng trung tâm', device: 3, deviceName: 'Đèn thờ' },
        { room: 4, roomName: 'Phòng khách', device: 1, deviceName: 'Đèn chùm' }
    ];

    // ===== BIẾN TOÀN CỤC =====
    let mqttClient = null;
    let mqttConnected = false;
    let rules = [];
    let editingId = null;

    // ===== DOM =====
    const ruleList = document.getElementById('ruleList');
    const ruleModal = document.getElementById('ruleModal');
    const ruleForm = document.getElementById('ruleForm');
    const deviceGrid = document.getElementById('deviceGrid');
    const typeGroup = document.getElementById('typeGroup');
    const timeConfig = document.getElementById('timeConfig');
    const timerConfig = document.getElementById('timerConfig');
    const intervalConfig = document.getElementById('intervalConfig');
    const modalTitle = document.getElementById('modalTitle');
    const addRuleBtn = document.getElementById('addRuleBtn');
    const modalCancel = document.getElementById('ruleModalCancel');
    const mqttStatus = document.getElementById('mqttStatus');

    // ===== RENDER DANH SÁCH THIẾT BỊ (modal) =====
    function renderDeviceGrid() {
        deviceGrid.innerHTML = '';
        allDevices.forEach((dev, idx) => {
            const label = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = idx;
            cb.checked = true;
            label.appendChild(cb);
            label.appendChild(document.createTextNode(`${dev.roomName} - ${dev.deviceName}`));
            deviceGrid.appendChild(label);
        });
    }

    // ===== LOAD RULES =====
    function loadRules() {
        try {
            rules = JSON.parse(localStorage.getItem('automationRules')) || [];
        } catch {
            rules = [];
        }
        renderRules();
    }

    function saveRules() {
        localStorage.setItem('automationRules', JSON.stringify(rules));
        renderRules();
        syncToMaster();
    }

    // ===== GỬI LÊN MASTER =====
    function syncToMaster() {
        if (!mqttConnected || !mqttClient) return;
        const payload = JSON.stringify({ rules: rules });
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = "nha/tu-dong-hoa/danh-sach";
        mqttClient.send(msg);
    }

    function sendActionToMaster(action, data) {
        if (!mqttConnected || !mqttClient) return;
        const payload = JSON.stringify({ action: action, data: data });
        const msg = new Paho.MQTT.Message(payload);
        msg.destinationName = "nha/tu-dong-hoa/lenh";
        mqttClient.send(msg);
    }

    // ===== RENDER RULES =====
    function renderRules() {
        if (rules.length === 0) {
            ruleList.innerHTML = `<div class="empty-msg">Chưa có quy tắc nào. Nhấn <i class="fas fa-plus"></i> để tạo mới.</div>`;
            return;
        }
        ruleList.innerHTML = '';
        rules.forEach((rule) => {
            const card = document.createElement('div');
            card.className = 'rule-card';
            card.id = `rule-${rule.id}`;

            // Tạo tên quy tắc
            let actionLabel = rule.action ? 'Bật' : 'Tắt';
            let typeLabel = '';
            let typeClass = '';
            let detailHTML = '';
            let devicesHTML = '';

            // Danh sách thiết bị
            if (rule.devices && rule.devices.length > 0) {
                devicesHTML = rule.devices.map(d => {
                    const dev = allDevices.find(x => x.room === d.room && x.device === d.device);
                    return dev ? `<span class="badge">${dev.roomName} - ${dev.deviceName}</span>` : '';
                }).join('');
            }

            if (rule.type === 'time') {
                typeLabel = '🕐 Giờ cố định';
                typeClass = 'time';
                detailHTML = `Bật ${rule.schedule.on} - Tắt ${rule.schedule.off} • ${rule.repeat === 'daily' ? 'Hàng ngày' : 'Một lần'}`;
            } else if (rule.type === 'timer') {
                typeLabel = '⏱️ Hẹn giờ';
                typeClass = 'timer';
                detailHTML = `${actionLabel} sau ${rule.duration} phút`;
            } else if (rule.type === 'interval') {
                typeLabel = '🔄 Lặp chu kỳ';
                typeClass = 'interval';
                detailHTML = `Bật ${rule.interval.on}s - Tắt ${rule.interval.off}s • ${rule.repeat === 'always' ? '24/7' : 'Hàng ngày'}`;
            }

            card.innerHTML = `
                <div class="top">
                    <div class="info">
                        <div class="rule-name">
                            <span class="rule-type-badge ${typeClass}">${typeLabel}</span>
                            ${actionLabel} thiết bị
                        </div>
                        <div class="rule-detail">${detailHTML}</div>
                        <div class="rule-devices">${devicesHTML}</div>
                    </div>
                    <div class="actions">
                        <button class="delete-btn" data-id="${rule.id}" title="Xóa"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="bottom">
                    <div class="toggle-wrapper">
                        <span>${rule.enabled ? 'Bật' : 'Tắt'}</span>
                        <div class="toggle-switch ${rule.enabled ? 'active' : ''}" data-id="${rule.id}"></div>
                    </div>
                </div>
            `;
            ruleList.appendChild(card);

            // Toggle
            card.querySelector('.toggle-switch').addEventListener('click', function() {
                const id = this.dataset.id;
                const rule = rules.find(r => r.id === id);
                if (rule) {
                    rule.enabled = !rule.enabled;
                    saveRules();
                    sendActionToMaster('toggle', { id: rule.id, enabled: rule.enabled });
                }
            });

            // Xóa
            card.querySelector('.delete-btn').addEventListener('click', function() {
                const id = this.dataset.id;
                if (confirm('Xóa quy tắc này?')) {
                    const rule = rules.find(r => r.id === id);
                    if (rule) sendActionToMaster('delete', { id: rule.id });
                    rules = rules.filter(r => r.id !== id);
                    saveRules();
                    showToast('Đã xóa quy tắc');
                }
            });
        });
    }

    // ===== MODAL =====
    function openModal(ruleData = null) {
        renderDeviceGrid();
        if (ruleData) {
            modalTitle.textContent = 'Sửa quy tắc';
            // Chọn thiết bị đã lưu
            if (ruleData.devices) {
                const cbs = deviceGrid.querySelectorAll('input[type="checkbox"]');
                cbs.forEach((cb, idx) => {
                    const dev = allDevices[idx];
                    cb.checked = ruleData.devices.some(d => d.room === dev.room && d.device === dev.device);
                });
            }
            // Loại
            document.querySelector(`input[name="type"][value="${ruleData.type}"]`).checked = true;
            toggleType(ruleData.type);
            if (ruleData.type === 'time') {
                document.getElementById('ruleOnTime').value = ruleData.schedule.on || '06:30';
                document.getElementById('ruleOffTime').value = ruleData.schedule.off || '22:00';
                document.getElementById('ruleRepeat').value = ruleData.repeat || 'daily';
            } else if (ruleData.type === 'timer') {
                document.querySelector(`input[name="timerAction"][value="${ruleData.action}"]`).checked = true;
                document.getElementById('ruleDuration').value = ruleData.duration || 30;
            } else if (ruleData.type === 'interval') {
                document.getElementById('ruleOnDuration').value = ruleData.interval.on || 5;
                document.getElementById('ruleOffDuration').value = ruleData.interval.off || 10;
                document.getElementById('ruleIntervalRepeat').value = ruleData.repeat || 'always';
            }
            editingId = ruleData.id;
        } else {
            modalTitle.textContent = 'Thêm quy tắc tự động';
            // Reset form
            document.querySelector('input[name="type"][value="time"]').checked = true;
            toggleType('time');
            document.getElementById('ruleOnTime').value = '06:30';
            document.getElementById('ruleOffTime').value = '22:00';
            document.getElementById('ruleRepeat').value = 'daily';
            document.querySelector('input[name="timerAction"][value="1"]').checked = true;
            document.getElementById('ruleDuration').value = 30;
            document.getElementById('ruleOnDuration').value = 5;
            document.getElementById('ruleOffDuration').value = 10;
            document.getElementById('ruleIntervalRepeat').value = 'always';
            // Chọn tất cả thiết bị
            deviceGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
            editingId = null;
        }
        ruleModal.classList.add('active');
    }

    function closeModal() {
        ruleModal.classList.remove('active');
        ruleForm.reset();
        editingId = null;
    }

    function toggleType(type) {
        timeConfig.style.display = type === 'time' ? 'block' : 'none';
        timerConfig.style.display = type === 'timer' ? 'block' : 'none';
        intervalConfig.style.display = type === 'interval' ? 'block' : 'none';
    }

    // Sự kiện modal
    addRuleBtn.addEventListener('click', () => openModal());
    modalCancel.addEventListener('click', closeModal);
    ruleModal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Sự kiện type radio
    typeGroup.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleType(this.value);
        });
    });

    // Submit form
    ruleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Lấy thiết bị được chọn
        const cbs = deviceGrid.querySelectorAll('input[type="checkbox"]:checked');
        if (cbs.length === 0) {
            alert('Vui lòng chọn ít nhất một thiết bị');
            return;
        }
        const devices = [];
        cbs.forEach(cb => {
            const idx = parseInt(cb.value);
            devices.push({ room: allDevices[idx].room, device: allDevices[idx].device });
        });

        const type = document.querySelector('input[name="type"]:checked').value;
        let rule = {
            id: editingId || Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            devices: devices,
            type: type,
            enabled: true
        };

        if (type === 'time') {
            rule.action = 1; // default
            rule.schedule = {
                on: document.getElementById('ruleOnTime').value + ':00',
                off: document.getElementById('ruleOffTime').value + ':00'
            };
            rule.repeat = document.getElementById('ruleRepeat').value;
        } else if (type === 'timer') {
            rule.action = parseInt(document.querySelector('input[name="timerAction"]:checked').value);
            rule.duration = parseInt(document.getElementById('ruleDuration').value);
        } else if (type === 'interval') {
            rule.action = 1; // default
            rule.interval = {
                on: parseInt(document.getElementById('ruleOnDuration').value),
                off: parseInt(document.getElementById('ruleOffDuration').value)
            };
            rule.repeat = document.getElementById('ruleIntervalRepeat').value;
        }

        if (editingId) {
            const index = rules.findIndex(r => r.id === editingId);
            if (index !== -1) {
                const oldRule = rules[index];
                rules[index] = { ...oldRule, ...rule };
                sendActionToMaster('update', { oldId: oldRule.id, rule: rules[index] });
            }
        } else {
            rules.push(rule);
            sendActionToMaster('add', rule);
        }

        saveRules();
        closeModal();
        showToast(editingId ? 'Đã cập nhật quy tắc' : 'Đã thêm quy tắc mới');
    });

    // ===== MQTT =====
    function connectMQTT() {
        if (typeof Paho === 'undefined') {
            setTimeout(connectMQTT, 1000);
            return;
        }
        mqttClient = new Paho.MQTT.Client(mqttConfig.broker, mqttConfig.clientId);
        mqttClient.onConnectionLost = function(response) {
            mqttConnected = false;
            updateMQTTStatus(false);
            setTimeout(connectMQTT, 5000);
        };
        mqttClient.onMessageArrived = function(message) {
            handleMQTTMessage(message.destinationName, message.payloadString);
        };
        mqttClient.connect({
            userName: mqttConfig.username,
            password: mqttConfig.password,
            useSSL: true,
            onSuccess: function() {
                mqttConnected = true;
                updateMQTTStatus(true);
                mqttClient.subscribe('nha/tu-dong-hoa/phan-hoi');
            },
            onFailure: function() {
                mqttConnected = false;
                updateMQTTStatus(false);
                setTimeout(connectMQTT, 5000);
            }
        });
    }

    function handleMQTTMessage(topic, payload) {
        try {
            const data = JSON.parse(payload);
            if (topic === 'nha/tu-dong-hoa/phan-hoi') {
                console.log('📥 Phản hồi từ Master:', data);
                if (data.status === 'ok') showToast('✅ Đã đồng bộ với Master');
            }
        } catch (e) {}
    }

    function updateMQTTStatus(connected) {
        if (mqttStatus) {
            mqttStatus.innerHTML = connected ? '✅ MQTT đã kết nối' : '⏳ MQTT đang kết nối...';
            mqttStatus.style.color = connected ? '#4ade80' : '#f87171';
        }
    }

    // ===== TOAST =====
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `position: fixed; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); color: white; padding: 14px 28px; border-radius: 40px; font-size: 16px; font-weight: 500; z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.2); animation: fadeInDown 0.4s ease;`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = '0.4s'; setTimeout(() => toast.remove(), 500); }, 2500);
    }

    // ===== KHỞI TẠO =====
    function init() {
        loadRules();
        connectMQTT();
        loadSettings();

        window.addEventListener('storage', function(e) {
            if (e.key === 'automationRules') loadRules();
        });
    }

    // ===== LOAD CÀI ĐẶT GIAO DIỆN =====
    function loadSettings() {
        const primary = localStorage.getItem('primaryColor');
        if (primary) document.documentElement.style.setProperty('--primary-color', primary);
        const glassOpacity = localStorage.getItem('glassOpacity');
        if (glassOpacity) document.documentElement.style.setProperty('--glass-opacity', glassOpacity);
        const glassBlur = localStorage.getItem('glassBlur');
        if (glassBlur) document.documentElement.style.setProperty('--glass-blur', glassBlur + 'px');
        const bg = localStorage.getItem('bgImage');
        if (bg) {
            document.body.style.backgroundImage = `url(${bg})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
        }
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.style.background = '#1a1a2e';
            document.querySelector('.app-container').style.background = 'rgba(0,0,0,0.4)';
        }
    }

    init();
})();