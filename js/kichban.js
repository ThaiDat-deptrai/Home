(function() {
    'use strict';

    // ===== HÀM XÓA DẤU TIẾNG VIỆT =====
    function removeAccents(str) {
        const map = {
            'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
            'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
            'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
            'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
            'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
            'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
            'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
            'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
            'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
            'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
            'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
            'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
            'đ': 'd',
            'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
            'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
            'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
            'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
            'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
            'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
            'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
            'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
            'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
            'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
            'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
            'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
            'Đ': 'D'
        };
        return str.replace(/[^a-zA-Z0-9 ]/g, function(ch) {
            return map[ch] || ch;
        });
    }

    // ===== CHUẨN HÓA TÊN KỊCH BẢN =====
    function normalizeSceneName(name) {
        return removeAccents(name).toUpperCase().replace(/ /g, '_');
    }

    // ===== HÀM LẤY DANH SÁCH THIẾT BỊ ĐỘNG =====
    function getAllDevices() {
        const base = [
            { room: 'phong-ngu-1', name: 'Đèn ngủ', type: 'light' },
            { room: 'phong-ngu-1', name: 'Đèn tủ', type: 'light' },
            { room: 'phong-ngu-1', name: 'Đèn giường', type: 'light' },
            { room: 'phong-ngu-1', name: 'Đèn cây', type: 'light' },
            { room: 'phong-ngu-2', name: 'Đèn học', type: 'light' },
            { room: 'phong-ngu-2', name: 'Đèn ngủ', type: 'light' },
            { room: 'phong-ngu-2', name: 'Đèn decor', type: 'light' },
            { room: 'phong-trung-tam', name: 'Đèn trần', type: 'light' },
            { room: 'phong-trung-tam', name: 'Đèn trang trí', type: 'light' },
            { room: 'phong-trung-tam', name: 'Đèn thờ', type: 'light' },
            { room: 'phong-khach', name: 'Đèn chùm', type: 'light' }
        ];

        let custom = [];
        try {
            custom = JSON.parse(localStorage.getItem('customSwitches')) || [];
        } catch { custom = []; }

        const customDevices = custom.map(sw => ({
            room: sw.room,
            name: sw.name,
            type: 'custom'
        }));

        const all = [...base];
        customDevices.forEach(cd => {
            const exists = all.some(d => d.room === cd.room && d.name === cd.name);
            if (!exists) all.push(cd);
        });
        return all;
    }

    // ===== LOAD CÀI ĐẶT =====
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
    loadSettings();

    // ===== QUẢN LÝ KỊCH BẢN =====
    let scenes = JSON.parse(localStorage.getItem('scenes')) || [];

    function saveScenes() {
        localStorage.setItem('scenes', JSON.stringify(scenes));
        window.dispatchEvent(new Event('storage'));
    }

    // ===== GỬI CẤU HÌNH XUỐNG MASTER =====
    function sendSceneConfigToMaster(sceneData) {
        if (typeof window.sendSceneConfig === 'function') {
            // Chuẩn hóa tên trước khi gửi
            const normalizedData = {
                ...sceneData,
                name: normalizeSceneName(sceneData.name)
            };
            window.sendSceneConfig(normalizedData);
            console.log('📤 Đã gửi cấu hình kịch bản xuống Master');
            return true;
        } else {
            console.warn('⚠️ Chưa kết nối MQTT, không gửi được cấu hình');
            return false;
        }
    }

    function renderScenes() {
        const container = document.getElementById('sceneList');
        if (scenes.length === 0) {
            container.innerHTML =
                `<div class="empty-msg">Chưa có kịch bản nào. Nhấn <i class="fas fa-plus"></i> để tạo mới.</div>`;
            return;
        }
        container.innerHTML = '';
        scenes.forEach((scene, index) => {
            const card = document.createElement('div');
            card.className = 'scene-card';
            card.innerHTML = `
                <div class="top">
                    <i class="fas ${scene.icon || 'fa-film'}"></i>
                    <h3>${scene.name}</h3>
                </div>
                <div class="actions">
                    <button class="run" data-index="${index}"><i class="fas fa-play"></i> Chạy</button>
                    <button class="edit" data-index="${index}"><i class="fas fa-edit"></i> Sửa</button>
                    <button class="delete" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('.run').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.index);
                runScene(idx);
            });
        });
        container.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.dataset.index);
                openEditModal(idx);
            });
        });
        container.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('Bạn có chắc muốn xóa kịch bản này?')) {
                    const idx = parseInt(this.dataset.index);
                    scenes.splice(idx, 1);
                    saveScenes();
                    renderScenes();
                    showToast('Đã xóa kịch bản');
                }
            });
        });
    }

    function runScene(index) {
        const scene = scenes[index];
        if (!scene) return;
        showToast(`✅ Đã chạy kịch bản "${scene.name}"`);
        localStorage.setItem('lastScene', JSON.stringify(scene));
        window.dispatchEvent(new Event('storage'));
        
        if (typeof window.applyScene === 'function') {
            // Chuẩn hóa tên trước khi gửi
            const normalizedScene = {
                ...scene,
                name: normalizeSceneName(scene.name)
            };
            window.applyScene(normalizedScene);
        } else {
            console.warn('⚠️ index.js chưa load, chỉ gửi tên kịch bản');
        }
    }

    // ===== MODAL =====
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const sceneName = document.getElementById('sceneName');
    const sceneIconSelect = document.getElementById('sceneIconSelect');
    const deviceCheckboxes = document.getElementById('deviceCheckboxes');
    const form = document.getElementById('sceneForm');
    let editingIndex = null;

    function openModal(title, data = null) {
        modalTitle.textContent = title;
        sceneName.value = data ? data.name : '';
        sceneIconSelect.value = data ? data.icon : 'fa-film';
        const allDevices = getAllDevices();
        deviceCheckboxes.innerHTML = '';
        allDevices.forEach((dev, i) => {
            const checked = data && data.devices && data.devices.some(d => d.name === dev.name && d.room === dev.room);
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${i}" ${checked ? 'checked' : ''}>
                ${dev.name} (${dev.room})
            `;
            deviceCheckboxes.appendChild(label);
        });
        modalOverlay.classList.add('active');
        editingIndex = data ? scenes.indexOf(data) : null;
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        form.reset();
        editingIndex = null;
    }

    document.getElementById('addSceneBtn').addEventListener('click', () => openModal('Tạo kịch bản mới'));
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = sceneName.value.trim();
        if (!name) return alert('Vui lòng nhập tên kịch bản');
        const icon = sceneIconSelect.value;
        const allDevices = getAllDevices();
        const selectedCheckboxes = deviceCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
        const devices = [];
        selectedCheckboxes.forEach(cb => {
            const idx = parseInt(cb.value);
            const dev = allDevices[idx];
            devices.push({ name: dev.name, room: dev.room, state: true });
        });
        if (devices.length === 0) return alert('Vui lòng chọn ít nhất một thiết bị');

        const newScene = { name, icon, devices };

        if (editingIndex !== null) {
            scenes[editingIndex] = newScene;
        } else {
            scenes.unshift(newScene);
        }
        saveScenes();
        renderScenes();
        closeModal();
        showToast(editingIndex !== null ? 'Đã cập nhật kịch bản' : 'Đã thêm kịch bản mới');

        // ===== GỬI CẤU HÌNH XUỐNG MASTER NGAY KHI TẠO =====
        sendSceneConfigToMaster(newScene);
    });

    function openEditModal(index) {
        const scene = scenes[index];
        if (scene) openModal('Sửa kịch bản', scene);
    }

    // ===== TOAST =====
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.7); backdrop-filter: blur(10px);
            color: white; padding: 14px 28px; border-radius: 40px;
            font-size: 16px; font-weight: 500; z-index: 9999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            animation: fadeInDown 0.4s ease;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = '0.4s';
            setTimeout(() => toast.remove(), 500);
        }, 2500);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);

    renderScenes();

    window.addEventListener('storage', function(e) {
        if (e.key === 'customSwitches') {
            // Cập nhật danh sách thiết bị khi có thay đổi
        }
    });
})();
