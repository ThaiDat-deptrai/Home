(function() {
    'use strict';

    // ===== CẤU HÌNH MQTT =====
    const mqttConfig = {
        broker: "wss://130d14182c00498e952cad93f9325420.s1.eu.hivemq.cloud:8884/mqtt",
        username: "Dut09",
        password: "Dat1020192020",
        clientId: "TempDashboard_" + Math.random().toString(16).substr(2, 8)
    };

    // ===== DANH SÁCH NHIỆT ĐỘ (MAPPING VỚI TOPIC) =====
    const tempTopics = {
        'Phòng khách': 'nha/phong-khach/nhiet-do',
        'Phòng ngủ 1': 'nha/phong-ngu-1/nhiet-do',
        'Phòng ngủ 2': 'nha/phong-ngu-2/nhiet-do',
        'Phòng trung tâm': 'nha/phong-trung-tam/nhiet-do',
        'Ngoài trời': 'nha/ngoai-troi/nhiet-do'
    };

    // ===== DỮ LIỆU NHIỆT ĐỘ =====
    let tempData = [];
    let mqttClient = null;
    let mqttConnected = false;
    let dataReceived = false;

    function initTempData() {
        tempData = Object.keys(tempTopics).map(label => ({
            label: label,
            value: null,
            topic: tempTopics[label]
        }));
    }
    initTempData();

    // ===== DOM =====
    const gaugeGrid = document.getElementById('gaugeGrid');
    const canvas = document.getElementById('trendChart');
    const ctx = canvas.getContext('2d');

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
            document.body.classList.add('dark-mode');
            document.body.style.background = '#1a1a2e';
            document.querySelector('.app-container').style.background = 'rgba(0,0,0,0.4)';
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    loadSettings();

    // ===== VẼ GAUGE =====
    const circumference = 2 * Math.PI * 48;

    function renderGauges() {
        gaugeGrid.innerHTML = '';
        tempData.forEach((item, idx) => {
            const container = document.createElement('div');
            container.className = 'gauge-item';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 120 120');
            svg.classList.add('gauge-svg');

            const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            bg.setAttribute('cx', '60');
            bg.setAttribute('cy', '60');
            bg.setAttribute('r', '48');
            bg.classList.add('gauge-bg');

            const progress = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            progress.setAttribute('cx', '60');
            progress.setAttribute('cy', '60');
            progress.setAttribute('r', '48');
            progress.classList.add('gauge-progress');
            progress.style.strokeDasharray = circumference;
            progress.style.strokeDashoffset = circumference;

            svg.appendChild(bg);
            svg.appendChild(progress);

            const label = document.createElement('div');
            label.className = 'gauge-label';
            label.textContent = item.label;

            const tempDisplay = document.createElement('div');
            tempDisplay.className = 'gauge-temp';
            if (item.value === null) {
                tempDisplay.innerHTML = `--<span class="unit">°C</span>`;
                tempDisplay.style.opacity = '0.5';
                progress.style.stroke = '#666';
            } else {
                tempDisplay.innerHTML = `${Math.round(item.value)}<span class="unit">°C</span>`;
                tempDisplay.style.opacity = '1';
                let color;
                if (item.value < 20) color = '#00f2fe';
                else if (item.value < 30) color = '#38ef7d';
                else if (item.value < 36) color = '#f5a623';
                else color = '#ff0844';
                progress.style.stroke = color;
                const percent = Math.min(100, Math.max(0, (item.value / 40) * 100));
                const offset = circumference - (percent / 100) * circumference;
                progress.style.strokeDashoffset = offset;
            }

            container.appendChild(svg);
            container.appendChild(label);
            container.appendChild(tempDisplay);

            container._progress = progress;
            container._tempDisplay = tempDisplay;

            gaugeGrid.appendChild(container);
        });
    }

    // ===== VẼ BIỂU ĐỒ XU HƯỚNG =====
    let chartData = [];

    function drawChart() {
        const width = canvas.parentElement.clientWidth - 40;
        const height = 200;
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(2, 2);

        if (!dataReceived || chartData.length === 0) {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#4a5a7a';
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⏳ Đang chờ dữ liệu nhiệt độ...', width / 2, height / 2);
            return;
        }

        const padding = { top: 20, bottom: 30, left: 30, right: 20 };
        const chartWidth = width - padding.left - padding.right;
        const chartHeight = height - padding.top - padding.bottom;

        const allTemps = chartData.map(d => d.value);
        const minTemp = Math.min(...allTemps) - 2;
        const maxTemp = Math.max(...allTemps) + 2;

        ctx.clearRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const y = padding.top + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();
        }

        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#2c6bff';
        ctx.beginPath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 10;

        chartData.forEach((point, i) => {
            const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - ((point.value - minTemp) / (maxTemp - minTemp)) * chartHeight;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        chartData.forEach((point, i) => {
            const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth;
            const y = padding.top + chartHeight - ((point.value - minTemp) / (maxTemp - minTemp)) * chartHeight;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        ctx.fillStyle = '#4a5a7a';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        const step = Math.max(1, Math.floor(chartData.length / 6));
        for (let i = 0; i < chartData.length; i += step) {
            const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth;
            ctx.fillText(chartData[i].time || i + 'h', x, height - 5);
        }

        ctx.textAlign = 'right';
        for (let i = 0; i < 5; i++) {
            const val = minTemp + (maxTemp - minTemp) * (1 - i / 4);
            const y = padding.top + (chartHeight / 4) * i;
            ctx.fillText(Math.round(val) + '°C', padding.left - 8, y + 4);
        }
    }

    // ===== CẬP NHẬT DỮ LIỆU NHIỆT ĐỘ =====
    function updateTemperature(label, value) {
        const item = tempData.find(d => d.label === label);
        if (item) {
            item.value = value;
            dataReceived = true;

            const now = new Date();
            const timeStr = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
            chartData.push({ value: value, time: timeStr });
            if (chartData.length > 24) chartData.shift();

            renderGauges();
            drawChart();
        }
    }

    // ===== GỬI YÊU CẦU NHIỆT ĐỘ ĐẾN MASTER =====
    function requestTemperature() {
        if (!mqttConnected || !mqttClient) {
            console.warn('⚠️ MQTT chưa kết nối, không gửi được yêu cầu');
            return;
        }
        const msg = new Paho.MQTT.Message("{}");
        msg.destinationName = "nha/nhiet-do/yeu-cau";
        mqttClient.send(msg);
        console.log('📤 Đã gửi yêu cầu nhiệt độ đến Master');
        showToast('⏳ Đang lấy dữ liệu nhiệt độ...');
    }

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
                subscribeAllTopics();
                // Sau khi kết nối, tự động yêu cầu nhiệt độ
                setTimeout(requestTemperature, 1000);
            },
            onFailure: function(err) {
                mqttConnected = false;
                console.error('❌ Kết nối MQTT thất bại:', err.errorMessage);
                setTimeout(connectMQTT, 5000);
            }
        });
    }

    function subscribeAllTopics() {
        const topics = Object.values(tempTopics);
        topics.forEach(topic => {
            mqttClient.subscribe(topic);
            console.log(`📡 Subscribed: ${topic}`);
        });
    }

    function handleMQTTMessage(topic, payload) {
        try {
            const data = JSON.parse(payload);
            for (const [label, t] of Object.entries(tempTopics)) {
                if (t === topic) {
                    const temp = parseFloat(data.temperature) || parseFloat(data.temp) || parseFloat(data.value);
                    if (!isNaN(temp)) {
                        updateTemperature(label, temp);
                        console.log(`🌡️ Cập nhật ${label}: ${temp}°C`);
                    }
                    return;
                }
            }
        } catch (e) {
            console.warn('⚠️ Lỗi parse MQTT message:', e);
        }
    }

    // ===== KHỞI TẠO =====
    function init() {
        renderGauges();
        drawChart();
        connectMQTT();

        // Nút Refresh
        document.getElementById('refreshBtn').addEventListener('click', function() {
            this.classList.add('fa-spin');
            requestTemperature();
            setTimeout(() => {
                this.classList.remove('fa-spin');
            }, 3000);
        });

        // Resize biểu đồ
        window.addEventListener('resize', drawChart);
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
        }, 2000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);

    init();
})();
