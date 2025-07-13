// 奖品配置 - 可在此处修改奖品概率
const prizes = [
    { id: 1, name: '一等奖: 10元红包', img: 'https://i.postimg.cc/C1b4fnZ4/prize1.png', probability: 10 },   // 10%概率
    { id: 2, name: '二等奖: 雪王自选', img: 'https://i.postimg.cc/bYHTybfy/prize3.png', probability: 15 },  // 15%概率
    { id: 3, name: '三等奖: 5元红包', img: 'https://i.postimg.cc/3wsBRFwR/prize2.png', probability: 20 },  // 20%概率
    { id: 4, name: '四等奖: 柠檬水一杯', img: 'https://i.postimg.cc/TwHTg1Zp/prize4.png', probability: 25 }, // 25%概率
    { id: 5, name: '五等奖: 谢谢惠顾', img: 'https://i.postimg.cc/QM9mhyhw/hanks.png', probability: 30 }   // 30%概率
];

// DOM元素
const drawBtn = document.getElementById('drawBtn');
const resultModal = document.getElementById('resultModal');
const claimModal = document.getElementById('claimModal');
const resultImg = document.getElementById('resultImg');
const resultName = document.getElementById('resultName');
const confirmBtn = document.getElementById('confirmBtn');
const recordsList = document.getElementById('recordsList');
const closeBtns = document.querySelectorAll('.close-btn');
const claimPrizeImg = document.getElementById('claimPrizeImg');
const claimPrizeName = document.getElementById('claimPrizeName');
const closeClaimBtn = document.getElementById('closeClaimBtn');
const toast = document.getElementById('toast');
const drawCountElement = document.querySelector('.draw-countdown strong');
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// 抽奖记录存储 - 修改为会话存储，页面关闭后自动清空
let lotteryRecords = [];
let remainingDraws = 5; // 默认每日3次抽奖机会
let currentSlide = 0;
const slideWidth = 300; // 奖品项宽度 + 间距

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
    // 从会话存储加载记录和剩余抽奖次数
    const savedRecords = sessionStorage.getItem('lotteryRecords');
    const savedDraws = sessionStorage.getItem('remainingDraws');
    
    if (savedRecords) lotteryRecords = JSON.parse(savedRecords);
    if (savedDraws) remainingDraws = parseInt(savedDraws);
    
    updateDrawCount();
    renderRecords();
    setupEventListeners();
    initCarousel();
    
    // 从URL参数加载测试数据（仅开发时使用）
    if (window.location.search.includes('test=1')) {
        loadTestRecords();
    }
});

// 初始化轮播
function initCarousel() {
    if (!carouselTrack || !prevBtn || !nextBtn) return;
    
    // 设置初始位置
    updateCarouselPosition();
    
    // 自动轮播
    let autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % prizes.length;
        updateCarouselPosition();
    }, 5000);
    
    // 鼠标悬停时暂停自动轮播
    document.querySelector('.prize-carousel').addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // 鼠标离开时恢复自动轮播
    document.querySelector('.prize-carousel').addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % prizes.length;
            updateCarouselPosition();
        }, 5000);
    });
}

// 更新轮播位置
function updateCarouselPosition() {
    if (!carouselTrack) return;
    carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
}

// 设置事件监听器
function setupEventListeners() {
    if (!drawBtn) {
        console.error('抽奖按钮元素未找到');
        return;
    }
    
    // 抽奖按钮
    drawBtn.addEventListener('click', startDraw);
    
    // 结果弹窗确认按钮
    confirmBtn.addEventListener('click', () => {
        hideModal(resultModal);
    });
    
    // 关闭按钮
    closeBtns.forEach(btn => btn.addEventListener('click', () => {
        hideModal(resultModal);
        hideModal(claimModal);
    }));
    
    // 领取弹窗关闭按钮
    if (closeClaimBtn) {
        closeClaimBtn.addEventListener('click', () => {
            hideModal(claimModal);
        });
    }
    
    // 轮播按钮
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + prizes.length) % prizes.length;
            updateCarouselPosition();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % prizes.length;
            updateCarouselPosition();
        });
    }
}

// 显示弹窗
function showModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

// 隐藏弹窗
function hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

// 显示通知提示
function showToast(message, type = 'info') {
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast';
    toast.classList.add(type);
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 更新剩余抽奖次数
function updateDrawCount() {
    if (drawCountElement) {
        drawCountElement.textContent = remainingDraws;
    }
    sessionStorage.setItem('remainingDraws', remainingDraws);
}

// 开始抽奖
function startDraw() {
    console.log('开始抽奖');
    
    // 检查剩余抽奖次数
    if (remainingDraws <= 0) {
        showToast('今日抽奖次数已用完，请明天再来！', 'warning');
        return;
    }
    
    // 禁用按钮防止重复点击
    drawBtn.disabled = true;
    drawBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 抽奖中...';
    
    // 添加抽奖动画效果
    const drawAnimation = document.querySelector('.draw-animation');
    if (drawAnimation) {
        drawAnimation.style.background = 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,255,255,0) 70%)';
    }
    
    // 模拟抽奖过程动画
    setTimeout(() => {
        try {
            // 减少抽奖次数
            remainingDraws--;
            updateDrawCount();
            
            const winningPrize = getRandomPrize();
            console.log('抽中奖品:', winningPrize);
            showResult(winningPrize);
            saveRecord(winningPrize);
            
            // 清除动画
            if (drawAnimation) drawAnimation.style.background = 'none';
        } catch (error) {
            console.error('抽奖过程出错:', error);
            showToast('抽奖过程出错，请重试: ' + error.message, 'error');
        } finally {
            drawBtn.disabled = false;
            drawBtn.innerHTML = '<i class="fas fa-play-circle"></i> 开始抽奖';
            console.log('抽奖按钮状态恢复');
        }
    }, 2000);
}

// 根据概率随机获取奖品
function getRandomPrize() {
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    let random = Math.random() * totalProbability;

    for (const prize of prizes) {
        random -= prize.probability;
        if (random <= 0) {
            return prize;
        }
    }
    return prizes[prizes.length - 1]; // 默认返回最后一个奖品
}

// 显示抽奖结果
function showResult(prize) {
    console.log('显示抽奖结果:', prize);
    resultImg.src = prize.img;
    resultImg.alt = prize.name;
    resultName.textContent = prize.name;
    
    // 显示结果弹窗
    showModal(resultModal);
    
    // 如果是谢谢惠顾，3秒后自动关闭
    if (prize.name.includes('谢谢惠顾')) {
        setTimeout(() => {
            hideModal(resultModal);
        }, 3000);
    }
}

// 保存抽奖记录
function saveRecord(prize) {
    const now = new Date();
    const record = {
        id: Date.now(),
        prizeId: prize.id,
        name: prize.name,
        img: prize.img,
        time: now.toLocaleString()
    };

    lotteryRecords.unshift(record);
    sessionStorage.setItem('lotteryRecords', JSON.stringify(lotteryRecords));
    renderRecords();

    // 发送记录到后端
    sendRecordToBackend(record);
}

// 渲染抽奖记录为行格式
function renderRecords() {
    if (!recordsList) return;
    recordsList.innerHTML = '';

    if (lotteryRecords.length === 0) {
        recordsList.innerHTML = '<p class="no-records"><i class="fas fa-inbox"></i> 暂无抽奖记录</p>';
        return;
    }

    // 创建表头
    const headerRow = document.createElement('div');
    headerRow.className = 'record-header';
    headerRow.innerHTML = `
        <div class="record-col record-time-header">时间</div>
        <div class="record-col record-prize-header">奖品</div>
        <div class="record-col record-action-header">操作</div>
    `;
    recordsList.appendChild(headerRow);

    lotteryRecords.forEach(record => {
        const recordItem = document.createElement('div');
        recordItem.className = 'record-row';
        
        // 判断是否为谢谢惠顾，不显示领取按钮
        const isThankYou = record.name.includes('谢谢惠顾');
        const claimButton = isThankYou ? '' : `<button class="claim-btn" data-id="${record.id}">领取</button>`;
        
        // 提取奖品名称（去除奖项等级前缀）
        const prizeName = record.name.split(':')[1] || record.name;
        
        recordItem.innerHTML = `
            <div class="record-col record-time">${record.time}</div>
            <div class="record-col record-prize">
                <img src="${record.img}" alt="${record.name}">
                <span>${prizeName}</span>
            </div>
            <div class="record-col record-action">${claimButton}</div>
        `;
        recordsList.appendChild(recordItem);

        // 为领取按钮添加事件（仅非谢谢惠顾项）
        if (!isThankYou) {
            recordItem.querySelector('.claim-btn').addEventListener('click', () => {
                // 设置奖品图片和名称
                claimPrizeImg.src = record.img;
                claimPrizeImg.alt = record.name;
                claimPrizeName.textContent = record.name;
                
                // 显示领取弹窗
                showModal(claimModal);
                showToast('请按照指引领取您的奖品', 'success');
            });
        }
    });
}

// 导入Supabase客户端
import { supabaseClient } from './supabaseClient.js';

// 发送记录到Supabase数据库
async function sendRecordToBackend(record) {
    try {
        // 获取IP定位信息
        const locationData = await getLocation();

        // 准备要插入的数据
        const recordData = {
            record_id: record.id.toString(),
            prize_id: record.prizeId,
            prize_name: record.name,
            prize_img: record.img,
            draw_time: record.time,
            ip_address: locationData.ip,
            location: locationData.address,
            longitude: locationData.longitude,
            latitude: locationData.latitude
        };

        // 插入数据到Supabase
        const { error } = await supabaseClient
            .from('lottery_records')
            .insert([recordData]);

        if (error) throw error;
        showToast('抽奖记录已保存', 'success');
    } catch (error) {
        console.error('记录保存错误:', error);
        showToast('记录保存失败: ' + error.message, 'error');
    }
}

// 获取IP定位信息
async function getLocation() {
    try {
        // 使用高德API获取定位
        const response = await fetch(`https://restapi.amap.com/v3/ip?key=a782496f31fd0c379b1c941387e96f07`);
        const data = await response.json();

        return {
            ip: data.ip,
            province: data.province,
            city: data.city,
            district: data.district,
            address: `${data.province}${data.city}${data.district}`,
            longitude: data.rectangle ? data.rectangle.split(';')[0].split(',')[0] : '',
            latitude: data.rectangle ? data.rectangle.split(';')[0].split(',')[1] : ''
        };
    } catch (error) {
        console.error('定位获取失败:', error);
        return { ip: '未知', address: '未知', longitude: '', latitude: '' };
    }
}

// 测试用：加载测试记录
function loadTestRecords() {
    const now = new Date();
    const testRecords = [
        {
            id: Date.now() - 300000,
            prizeId: 3,
            name: '三等奖: 5元红包',
            img: 'https://i.postimg.cc/3wsBRFwR/prize2.png',
            time: new Date(now - 300000).toLocaleString()
        },
        {
            id: Date.now() - 600000,
            prizeId: 5,
            name: '五等奖: 谢谢惠顾',
            img: 'https://i.postimg.cc/QM9mhyhw/hanks.png',
            time: new Date(now - 600000).toLocaleString()
        }
    ];
    lotteryRecords = testRecords;
    renderRecords();
}
