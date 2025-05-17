// 示例数据 - 在实际应用中，这些数据应该从后端API获取
const demoQrcodes = [
    {
        id: 1,
        name: "技术交流群",
        description: "讨论最新的前端和后端技术，分享学习资源和开发经验。每周五有技术分享会。",
        qrcode: "WechatIMG832.jpg",
        avatar: "WechatIMG832.jpg",
        status: "active",
        tags: ["技术", "前端", "后端", "学习"]
    },
    {
        id: 2,
        name: "产品设计群",
        description: "交流产品设计理念，UI/UX设计趋势，以及用户研究方法。",
        qrcode: "WechatIMG832.jpg",
        avatar: "WechatIMG832.jpg",
        status: "active",
        tags: ["设计", "UI", "UX", "产品"]
    },
];

// 存储当前数据和状态
let qrcodes = [...demoQrcodes];
let currentFilter = 'all';
let currentView = 'grid';
let currentEditId = null;

// DOM元素
const qrcodeList = document.getElementById('qrcode-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const addQrcodeBtn = document.getElementById('add-qrcode-btn');
const modal = document.getElementById('qrcode-modal');
const modalTitle = document.getElementById('modal-title');
const qrcodeForm = document.getElementById('qrcode-form');
const closeBtn = document.querySelector('.close-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const filters = document.querySelectorAll('.filter');
const viewOptions = document.querySelectorAll('.view-option');

// 文件上传预览
const qrcodeInput = document.getElementById('group-qrcode');
const avatarInput = document.getElementById('group-avatar');
const qrcodePreview = document.getElementById('qrcode-preview');
const avatarPreview = document.getElementById('avatar-preview');

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderQrcodes();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // 添加二维码按钮
    addQrcodeBtn.addEventListener('click', () => {
        openModal();
    });

    // 关闭模态窗口
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 表单提交
    qrcodeForm.addEventListener('submit', handleFormSubmit);

    // 过滤器点击事件
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentFilter = filter.dataset.filter;
            renderQrcodes();
        });
    });

    // 视图切换事件
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            viewOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            currentView = option.dataset.view;
            qrcodeList.className = `qrcode-container ${currentView}-view`;
            renderQrcodes();
        });
    });

    // 文件上传预览
    qrcodeInput.addEventListener('change', (e) => {
        handleFilePreview(e, qrcodePreview);
    });

    avatarInput.addEventListener('change', (e) => {
        handleFilePreview(e, avatarPreview);
    });
}

// 渲染二维码列表
function renderQrcodes() {
    // 清空列表
    qrcodeList.innerHTML = '';

    // 过滤数据
    let filteredQrcodes = qrcodes;
    if (currentFilter !== 'all') {
        filteredQrcodes = qrcodes.filter(qrcode => qrcode.status === currentFilter);
    }

    // 如果没有数据，显示空状态
    if (filteredQrcodes.length === 0) {
        qrcodeList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <p>没有找到符合条件的群组</p>
            </div>
        `;
        return;
    }

    // 渲染每个二维码卡片
    filteredQrcodes.forEach(qrcode => {
        const card = document.createElement('div');
        card.className = 'qrcode-card';
        card.dataset.id = qrcode.id;

        if (currentView === 'grid') {
            card.innerHTML = `
                <div class="card-header">
                    <img src="${qrcode.avatar}" alt="${qrcode.name}">
                    <div class="card-status status-${qrcode.status}">
                        ${qrcode.status === 'active' ? '活跃' : '非活跃'}
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${qrcode.name}</h3>
                    <p class="card-desc">${qrcode.description}</p>
                    <div class="card-tags">
                        ${qrcode.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-actions">
                        <div class="action-icon view-qr" title="查看二维码">
                            <i class="fas fa-qrcode"></i>
                        </div>
                        <div class="action-icon edit-qr" title="编辑">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-icon delete-qr" title="删除">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="card-header">
                    <img src="${qrcode.avatar}" alt="${qrcode.name}">
                </div>
                <div class="card-body">
                    <h3 class="card-title">${qrcode.name}</h3>
                    <p class="card-desc">${qrcode.description}</p>
                    <div class="card-tags">
                        ${qrcode.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-status status-${qrcode.status}">
                        ${qrcode.status === 'active' ? '活跃' : '非活跃'}
                    </div>
                </div>
                <div class="card-actions">
                    <div class="action-icon view-qr" title="查看二维码">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <div class="action-icon edit-qr" title="编辑">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-icon delete-qr" title="删除">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            `;
        }

        // 添加事件监听器
        qrcodeList.appendChild(card);

        // 查看二维码
        card.querySelector('.view-qr').addEventListener('click', () => {
            viewQrcode(qrcode.id);
        });

        // 编辑二维码
        card.querySelector('.edit-qr').addEventListener('click', () => {
            editQrcode(qrcode.id);
        });

        // 删除二维码
        card.querySelector('.delete-qr').addEventListener('click', () => {
            deleteQrcode(qrcode.id);
        });
    });
}

// 搜索功能
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm === '') {
        qrcodes = [...demoQrcodes];
    } else {
        qrcodes = demoQrcodes.filter(qrcode =>
            qrcode.name.toLowerCase().includes(searchTerm) ||
            qrcode.description.toLowerCase().includes(searchTerm) ||
            qrcode.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    renderQrcodes();
}

// 打开模态窗口
function openModal(editMode = false) {
    modal.style.display = 'flex';
    modalTitle.textContent = editMode ? '编辑群组' : '添加新群组';
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

// 关闭模态窗口
function closeModal() {
    modal.style.display = 'none';
    qrcodeForm.reset();
    qrcodePreview.style.display = 'none';
    avatarPreview.style.display = 'none';
    currentEditId = null;
    document.body.style.overflow = '';
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('group-name').value,
        description: document.getElementById('group-desc').value,
        status: document.getElementById('group-status').value,
        tags: document.getElementById('group-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };

    // 在实际应用中，这里应该处理文件上传
    // 这里我们使用预览图像的src作为示例
    formData.qrcode = qrcodePreview.src || 'https://via.placeholder.com/300/1aad19/FFFFFF?text=新群组';
    formData.avatar = avatarPreview.src || 'https://via.placeholder.com/300/1aad19/FFFFFF?text=新群组';

    if (currentEditId) {
        // 编辑现有群组
        const index = qrcodes.findIndex(qr => qr.id === currentEditId);
        if (index !== -1) {
            qrcodes[index] = { ...qrcodes[index], ...formData };
        }
    } else {
        // 添加新群组
        const newId = Math.max(...qrcodes.map(qr => qr.id), 0) + 1;
        qrcodes.push({
            id: newId,
            ...formData
        });
    }

    // 更新原始数据（在实际应用中，这里应该是API调用）
    demoQrcodes.length = 0;
    demoQrcodes.push(...qrcodes);

    // 关闭模态窗口并重新渲染
    closeModal();
    renderQrcodes();

    // 显示成功消息（可以使用toast或其他通知组件）
    showNotification(currentEditId ? '群组已更新' : '新群组已添加');
}

// 文件上传预览
function handleFilePreview(event, previewElement) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// 查看二维码
function viewQrcode(id) {
    const qrcode = qrcodes.find(qr => qr.id === id);
    if (qrcode) {
        // 创建一个临时模态窗口来显示二维码
        const viewModal = document.createElement('div');
        viewModal.className = 'modal';
        viewModal.style.display = 'flex';

        viewModal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h2>${qrcode.name} - 二维码</h2>
                    <span class="close-btn">&times;</span>
                </div>
                <div class="modal-body" style="text-align: center;">
                    <img src="${qrcode.qrcode}" alt="${qrcode.name} QR Code" style="max-width: 100%; border-radius: 10px;">
                    <p style="margin-top: 15px; color: var(--text-light);">扫描上方二维码加入群组</p>
                </div>
            </div>
        `;

        document.body.appendChild(viewModal);
        document.body.style.overflow = 'hidden';

        // 关闭按钮事件
        viewModal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(viewModal);
            document.body.style.overflow = '';
        });

        // 点击背景关闭
        viewModal.addEventListener('click', (e) => {
            if (e.target === viewModal) {
                document.body.removeChild(viewModal);
                document.body.style.overflow = '';
            }
        });
    }
}

// 编辑二维码
function editQrcode(id) {
    const qrcode = qrcodes.find(qr => qr.id === id);
    if (qrcode) {
        currentEditId = id;

        // 填充表单
        document.getElementById('group-name').value = qrcode.name;
        document.getElementById('group-desc').value = qrcode.description;
        document.getElementById('group-status').value = qrcode.status;
        document.getElementById('group-tags').value = qrcode.tags.join(', ');

        // 显示图片预览
        qrcodePreview.src = qrcode.qrcode;
        qrcodePreview.style.display = 'block';
        avatarPreview.src = qrcode.avatar;
        avatarPreview.style.display = 'block';

        // 打开模态窗口
        openModal(true);
    }
}

// 删除二维码
function deleteQrcode(id) {
    if (confirm('确定要删除这个群组吗？')) {
        qrcodes = qrcodes.filter(qr => qr.id !== id);

        // 更新原始数据（在实际应用中，这里应该是API调用）
        demoQrcodes.length = 0;
        demoQrcodes.push(...qrcodes);

        renderQrcodes();
        showNotification('群组已删除');
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1100;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    // 自动隐藏通知
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';

        // 移除元素
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
