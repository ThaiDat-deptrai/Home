(function() {
    'use strict';

    // ===== CÁC BIẾN DOM =====
    const primaryColorPicker = document.getElementById('primaryColorPicker');
    const primaryColorHex = document.getElementById('primaryColorHex');
    const bgUpload = document.getElementById('bgUpload');
    const bgUploadBtn = document.getElementById('bgUploadBtn');
    const bgUrl = document.getElementById('bgUrl');
    const bgApplyUrl = document.getElementById('bgApplyUrl');
    const bgResetBtn = document.getElementById('bgResetBtn');
    const glassBlur = document.getElementById('glassBlur');
    const glassBlurVal = document.getElementById('glassBlurVal');
    const glassOpacity = document.getElementById('glassOpacity');
    const glassOpacityVal = document.getElementById('glassOpacityVal');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const voiceFeedbackToggle = document.getElementById('voiceFeedbackToggle');
    const resetBtn = document.getElementById('resetDefaults');
    const mqttHost = document.getElementById('mqttHost');
    const mqttPort = document.getElementById('mqttPort');
    const mqttUser = document.getElementById('mqttUser');
    const mqttPass = document.getElementById('mqttPass');
    const mqttConnect = document.getElementById('mqttConnect');
    const mqttStatus = document.getElementById('mqttStatus');
    const mqttPing = document.getElementById('mqttPing');
    const refreshRate = document.getElementById('refreshRate');
    const bgScroll = document.getElementById('bgScroll');

    // Công tắc
    const switchListContainer = document.getElementById('switchListContainer');
    const addSwitchBtn = document.getElementById('addSwitchBtn');
    const switchModal = document.getElementById('switchModal');
    const switchModalTitle = document.getElementById('switchModalTitle');
    const switchForm = document.getElementById('switchForm');
    const switchName = document.getElementById('switchName');
    const switchIconSelect = document.getElementById('switchIconSelect');
    const switchRoomSelect = document.getElementById('switchRoomSelect');
    const switchModalCancel = document.getElementById('switchModalCancel');
    let editingSwitchId = null;

    // ===== DANH SÁCH ẢNH =====
    const bgImages = [
        'animal1.jpg', 'animal2.jpg', 'animal3.jpg', 'animal4.jpg',
        'car1.jpg', 'car2.jpg', 'car3.jpg', 'car4.jpg', 'car5.jpg',
        'car6.jpg', 'car7.jpg', 'car8.jpg', 'car9.jpg', 'car10.jpg',
        'porsche.jpg'
    ];

    // ===== QUẢN LÝ CÔNG TẮC =====
    function getSwitches() {
        try {
            return JSON.parse(localStorage.getItem('customSwitches')) || [];
        } catch { return []; }
    }

    function saveSwitches(switches) {
        localStorage.setItem('customSwitches', JSON.stringify(switches));
        renderSwitches();
        window.dispatchEvent(new Event('storage'));
    }

    function renderSwitches() {
        const switches = getSwitches();
        if (switches.length === 0) {
            switchListContainer.innerHTML = '<p style="color:#4a5a7a;font-size:14px;padding:8px 0;">Chưa có công tắc nào.</p>';
            return;
        }
        let html = '';
        switches.forEach((sw, index) => {
            html += `
                <div class="switch-item" data-id="${sw.id || index}">
                    <div class="info">
                        <i class="fas ${sw.icon || 'fa-lightbulb'}"></i>
                        <span>${sw.name}</span>
                        <small>(${sw.room})</small>
                    </div>
                    <div class="actions">
                        <button class="btn btn-secondary" data-action="edit" data-id="${sw.id || index}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger" data-action="delete" data-id="${sw.id || index}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });
        switchListContainer.innerHTML = html;

        switchListContainer.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const switches = getSwitches();
                const sw = switches.find(s => (s.id || s._id) == id);
                if (sw) openSwitchModal(sw);
            });
        });
        switchListContainer.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                if (!confirm('Xóa công tắc này?')) return;
                let switches = getSwitches();
                switches = switches.filter(s => (s.id || s._id) != id);
                saveSwitches(switches);
                showToast('Đã xóa công tắc');
            });
        });
    }

    function openSwitchModal(data = null) {
        if (data) {
            switchModalTitle.textContent = 'Sửa công tắc';
            switchName.value = data.name || '';
            switchIconSelect.value = data.icon || 'fa-lightbulb';
            switchRoomSelect.value = data.room || 'phong-ngu-1';
            editingSwitchId = data.id || data._id;
        } else {
            switchModalTitle.textContent = 'Thêm công tắc mới';
            switchName.value = '';
            switchIconSelect.value = 'fa-lightbulb';
            switchRoomSelect.value = 'phong-ngu-1';
            editingSwitchId = null;
        }
        switchModal.classList.add('active');
    }

    function closeSwitchModal() {
        switchModal.classList.remove('active');
        switchForm.reset();
        editingSwitchId = null;
    }

    addSwitchBtn.addEventListener('click', () => openSwitchModal());
    switchModalCancel.addEventListener('click', closeSwitchModal);
    switchModal.addEventListener('click', function(e) {
        if (e.target === this) closeSwitchModal();
    });

    switchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = switchName.value.trim();
        if (!name) return alert('Vui lòng nhập tên công tắc');
        const icon = switchIconSelect.value;
        const room = switchRoomSelect.value;

        let switches = getSwitches();
        if (editingSwitchId !== null) {
            const index = switches.findIndex(s => (s.id || s._id) == editingSwitchId);
            if (index !== -1) {
                switches[index] = { ...switches[index], name, icon, room };
            }
        } else {
            const newSwitch = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                name,
                icon,
                room,
                on: false
            };
            switches.push(newSwitch);
        }
        saveSwitches(switches);
        closeSwitchModal();
        showToast(editingSwitchId !== null ? 'Đã cập nhật công tắc' : 'Đã thêm công tắc');
    });

    // ===== CÁC HÀM KHÁC =====
    function renderBgThumbs() {
        bgScroll.innerHTML = '';
        const currentBg = localStorage.getItem('bgImage') || '';
        bgImages.forEach(file => {
            const thumb = document.createElement('div');
            thumb.className = 'bg-thumb';
            const path = `image/${file}`;
            thumb.style.backgroundImage = `url(${path})`;
            if (currentBg === path) thumb.classList.add('active');
            thumb.innerHTML = `<div class="check"><i class="fas fa-check"></i></div>`;
            thumb.addEventListener('click', function() {
                applyBg(path);
                document.querySelectorAll('.bg-thumb').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                bgUrl.value = '';
            });
            bgScroll.appendChild(thumb);
        });
    }

    function applyBg(path) {
        document.body.style.backgroundImage = `url(${path})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        try {
            localStorage.setItem('bgImage', path);
        } catch (e) {
            alert('Ảnh quá lớn, vui lòng dùng URL!');
            return;
        }
        showToast('Đã đổi hình nền');
    }

    function applyDarkMode(dark) {
        document.body.classList.toggle('dark-mode', dark);
        if (dark) {
            document.body.style.backgroundColor = '#1a1a2e';
            document.querySelector('.app-container').style.background = 'rgba(0,0,0,0.4)';
            document.querySelector('.app-container').style.borderColor = 'rgba(255,255,255,0.1)';
        } else {
            document.body.style.backgroundColor = '';
            document.querySelector('.app-container').style.background = '';
            document.querySelector('.app-container').style.borderColor = '';
        }
    }

    function loadAllSettings() {
        const primary = localStorage.getItem('primaryColor') || '#2c6bff';
        primaryColorPicker.value = primary;
        primaryColorHex.value = primary;
        document.documentElement.style.setProperty('--primary-color', primary);

        const bg = localStorage.getItem('bgImage');
        if (bg) { applyBg(bg);
            bgUrl.value = bg; }
        renderBgThumbs();

        const blur = localStorage.getItem('glassBlur') || '18';
        glassBlur.value = blur;
        glassBlurVal.textContent = blur + 'px';
        document.documentElement.style.setProperty('--glass-blur', blur + 'px');

        const opacity = localStorage.getItem('glassOpacity') || '25';
        glassOpacity.value = opacity;
        glassOpacityVal.textContent = opacity + '%';
        document.documentElement.style.setProperty('--glass-opacity', (opacity / 100).toString());

        const dark = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.classList.toggle('active', dark);
        applyDarkMode(dark);

        const sound = localStorage.getItem('soundEnabled') !== 'false';
        soundToggle.classList.toggle('active', sound);
        const voice = localStorage.getItem('voiceFeedback') !== 'false';
        voiceFeedbackToggle.classList.toggle('active', voice);

        mqttHost.value = localStorage.getItem('mqttHost') || 'broker.hivemq.com';
        mqttPort.value = localStorage.getItem('mqttPort') || '1883';
        mqttUser.value = localStorage.getItem('mqttUser') || '';
        mqttPass.value = localStorage.getItem('mqttPass') || '';
        const rate = localStorage.getItem('refreshRate') || '5';
        refreshRate.value = rate;

        renderSwitches();
    }

    function saveSetting(key, value) { localStorage.setItem(key, value); }

    // Sự kiện
    primaryColorPicker.addEventListener('input', function() {
        const val = this.value;
        primaryColorHex.value = val;
        document.documentElement.style.setProperty('--primary-color', val);
        saveSetting('primaryColor', val);
    });
    primaryColorHex.addEventListener('change', function() {
        let val = this.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9a-f]{6}$/i.test(val)) {
            primaryColorPicker.value = val;
            document.documentElement.style.setProperty('--primary-color', val);
            saveSetting('primaryColor', val);
        } else { alert('Mã màu không hợp lệ'); }
    });

    bgUploadBtn.addEventListener('click', () => bgUpload.click());
    bgUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1000000) alert('Cảnh báo ảnh > 1MB, khuyên dùng URL!');
        const reader = new FileReader();
        reader.onload = function(ev) {
            const dataUrl = ev.target.result;
            applyBg(dataUrl);
            document.querySelectorAll('.bg-thumb').forEach(el => el.classList.remove('active'));
            bgUrl.value = dataUrl;
        };
        reader.readAsDataURL(file);
        this.value = '';
    });
    bgApplyUrl.addEventListener('click', function() {
        const url = bgUrl.value.trim();
        if (!url) return;
        applyBg(url);
        document.querySelectorAll('.bg-thumb').forEach(el => el.classList.remove('active'));
    });
    bgResetBtn.addEventListener('click', function() {
        if (confirm('Xóa hình nền?')) {
            localStorage.removeItem('bgImage');
            document.body.style.backgroundImage = 'radial-gradient(circle at 20% 30%, #d4e6ff, #b8cff0)';
            document.body.style.backgroundSize = 'auto';
            bgUrl.value = '';
            document.querySelectorAll('.bg-thumb').forEach(el => el.classList.remove('active'));
            showToast('Đã xóa hình nền');
        }
    });

    glassBlur.addEventListener('input', function() {
        const val = this.value;
        glassBlurVal.textContent = val + 'px';
        document.documentElement.style.setProperty('--glass-blur', val + 'px');
        saveSetting('glassBlur', val);
    });
    glassOpacity.addEventListener('input', function() {
        const val = this.value;
        glassOpacityVal.textContent = val + '%';
        document.documentElement.style.setProperty('--glass-opacity', (val / 100).toString());
        saveSetting('glassOpacity', val);
    });

    darkModeToggle.addEventListener('click', function() {
        const active = this.classList.toggle('active');
        applyDarkMode(active);
        saveSetting('darkMode', active);
    });
    soundToggle.addEventListener('click', function() {
        const active = this.classList.toggle('active');
        saveSetting('soundEnabled', active);
    });
    voiceFeedbackToggle.addEventListener('click', function() {
        const active = this.classList.toggle('active');
        saveSetting('voiceFeedback', active);
    });
    mqttConnect.addEventListener('click', function() {
        const host = mqttHost.value.trim();
        const port = mqttPort.value.trim();
        const user = mqttUser.value.trim();
        const pass = mqttPass.value.trim();
        if (!host) return alert('Nhập Host');
        saveSetting('mqttHost', host);
        saveSetting('mqttPort', port);
        saveSetting('mqttUser', user);
        saveSetting('mqttPass', pass);
        mqttStatus.innerHTML = '<span class="status-led yellow"></span> Đang kết nối...';
        setTimeout(() => {
            mqttStatus.innerHTML = '<span class="status-led green"></span> Đã kết nối';
            mqttPing.textContent = 'Ping: ' + (Math.floor(Math.random() * 30) + 10) + ' ms';
            showToast('Kết nối MQTT thành công (giả lập)');
        }, 1500);
    });
    refreshRate.addEventListener('change', function() {
        saveSetting('refreshRate', this.value);
        showToast('Tần suất: ' + this.value + ' giây');
    });
    resetBtn.addEventListener('click', function() {
        if (!confirm('Reset cài đặt gốc?')) return;
        localStorage.clear();
        location.reload();
    });

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `position: fixed; top: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); color: white; padding: 14px 28px; border-radius: 40px; font-size: 16px; font-weight: 500; z-index: 9999; box-shadow: 0 10px 40px rgba(0,0,0,0.2); animation: fadeInDown 0.4s ease;`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = '0.4s';
            setTimeout(() => toast.remove(), 500);
        }, 2500);
    }
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeInDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`;
    document.head.appendChild(style);

    loadAllSettings();
})();