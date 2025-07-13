import { supabaseClient } from './supabaseClient.js';

// DOM元素
const sections = document.querySelectorAll('.section');

const totalVisitsEl = document.getElementById('totalVisits');
const totalDrawsEl = document.getElementById('totalDraws');
const firstPrizesEl = document.getElementById('firstPrizes');
const uniqueUsersEl = document.getElementById('uniqueUsers');
const visitorsTable = document.getElementById('visitorsTable').querySelector('tbody');
const searchVisitors = document.getElementById('searchVisitors');
const filterDate = document.getElementById('filterDate');
const savePrizesBtn = document.getElementById('savePrizes');

// 初始化地图
let map = null;

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupNav();
    loadDashboardData();
    loadVisitorRecords();
    loadPrizeSettings();
    setupEventListeners();
});

// 初始化高德地图
function initMap() {
    map = new AMap.Map('visitorMap', {
        zoom: 4,
        center: [105.000, 35.000], // 中国中心点
        viewMode: '2D'
    });
}

// 侧边栏切换功能
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle?.addEventListener('click', () => {
  sidebar.classList.toggle('closed');
});

// 设置事件监听器
function setupEventListeners() {
    // 搜索和筛选事件
    searchVisitors.addEventListener('input', loadVisitorRecords);
    filterDate.addEventListener('change', loadVisitorRecords);

    // 保存奖品设置
    savePrizesBtn.addEventListener('click', savePrizeSettings);
}

// 加载仪表盘数据
async function loadDashboardData() {
    try {
        // 获取访问记录总数
        const { count: visitsCount } = await supabaseClient
            .from('visitor_logs')
            .select('*', { count: 'exact', head: true });

        // 获取抽奖记录总数
        const { count: drawsCount } = await supabaseClient
            .from('lottery_records')
            .select('*', { count: 'exact', head: true });

        // 获取一等奖中奖次数
        const { count: firstPrizeCount } = await supabaseClient
            .from('lottery_records')
            .select('*', { count: 'exact', head: true })
            .eq('prizeId', 1);

        // 获取独立用户数
        const { data: uniqueIps } = await supabaseClient
            .from('visitor_logs')
            .select('ip', { count: 'exact', head: true })
            .distinct('ip');

        // 更新UI
        totalVisitsEl.textContent = visitsCount || 0;
        totalDrawsEl.textContent = drawsCount || 0;
        firstPrizesEl.textContent = firstPrizeCount || 0;
        uniqueUsersEl.textContent = uniqueIps.length || 0;

        // 加载访问者位置数据
        loadVisitorLocations();
    } catch (error) {
        console.error('加载仪表盘数据失败:', error);
    }
}

// 加载访问者位置数据并在地图上标记
async function loadVisitorLocations() {
    try {
        const { data } = await supabaseClient
            .from('visitor_logs')
            .select('latitude, longitude, ip')
            .neq('latitude', '')
            .neq('longitude', '');

        // 添加标记到地图
        data.forEach(visitor => {
            if (visitor.latitude && visitor.longitude) {
                new AMap.Marker({
                    position: [visitor.longitude, visitor.latitude],
                    map: map,
                    title: visitor.ip
                });
            }
        });
    } catch (error) {
        console.error('加载访问者位置失败:', error);
    }
}

// 加载访问记录
async function loadVisitorRecords() {
    try {
        const searchTerm = searchVisitors.value.toLowerCase();
        const dateFilter = filterDate.value;
        let query = supabaseClient.from('visitor_logs').select('*').order('created_at', { ascending: false });

        // 应用日期筛选
        if (dateFilter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query = query.gte('created_at', today.toISOString());
        } else if (dateFilter === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(0, 0, 0, 0);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query = query.gte('created_at', yesterday.toISOString()).lt('created_at', today.toISOString());
        } else if (dateFilter === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query = query.gte('created_at', weekAgo.toISOString());
        }

        // 获取数据
        const { data } = await query;

        // 渲染表格
        visitorsTable.innerHTML = '';
        if (data && data.length > 0) {
            data.forEach(visitor => {
                if (!searchTerm || visitor.ip.toLowerCase().includes(searchTerm) || visitor.address.toLowerCase().includes(searchTerm)) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${new Date(visitor.created_at).toLocaleString()}</td>
                        <td>${visitor.ip}</td>
                        <td>${visitor.address || '未知'}</td>
                        <td>${visitor.longitude}, ${visitor.latitude}</td>
                        <td>${visitor.type === 'lottery' ? '抽奖' : '访问'}</td>
                    `;
                    visitorsTable.appendChild(row);
                }
            });
        } else {
            visitorsTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">暂无访问记录</td></tr>';
        }
    } catch (error) {
        console.error('加载访问记录失败:', error);
        visitorsTable.innerHTML = '<tr><td colspan="5" style="text-align: center;">加载失败，请重试</td></tr>';
    }
}

// 加载奖品设置
async function loadPrizeSettings() {
    try {
        const { data } = await supabaseClient.from('prizes').select('*').order('id');

        if (data && data.length > 0) {
            data.forEach(prize => {
                document.querySelector(`.prize-name[data-id="${prize.id}"]`).value = prize.name;
                document.querySelector(`.prize-img[data-id="${prize.id}"]`).value = prize.img_url;
                document.querySelector(`.prize-prob[data-id="${prize.id}"]`).value = prize.probability;
            });
        } else {
            // 如果没有数据，加载默认值
            const defaultPrizes = [
                { id: 1, name: '一等奖: 10元红包', img_url: 'https://i.postimg.cc/C1b4fnZ4/prize1.png', probability: 5 },
                { id: 2, name: '二等奖: 5元红包', img_url: 'https://i.postimg.cc/5tkgV87Q/prize2.png', probability: 10 },
                { id: 3, name: '三等奖:优惠券', img_url: 'https://i.postimg.cc/ydXLZ8bL/prize3.png', probability: 20 },
                { id: 4, name: '四等奖:谢谢参与', img_url: 'https://i.postimg.cc/KjK1w5QH/prize4.png', probability: 30 },
                { id: 5, name: '五等奖:再接再厉', img_url: 'https://i.postimg.cc/sf8c6Qyb/prize5.png', probability: 35 }
            ];

            defaultPrizes.forEach(prize => {
                document.querySelector(`.prize-name[data-id="${prize.id}"]`).value = prize.name;
                document.querySelector(`.prize-img[data-id="${prize.id}"]`).value = prize.img_url;
                document.querySelector(`.prize-prob[data-id="${prize.id}"]`).value = prize.probability;
            });
        }
    } catch (error) {
        console.error('加载奖品设置失败:', error);
    }
}

// 保存奖品设置
async function savePrizeSettings() {
    try {
        // 获取所有奖品输入
        const prizes = [];
        for (let i = 1; i <= 5; i++) {
            const name = document.querySelector(`.prize-name[data-id="${i}"]`).value;
            const imgUrl = document.querySelector(`.prize-img[data-id="${i}"]`).value;
            const probability = parseInt(document.querySelector(`.prize-prob[data-id="${i}"]`).value) || 0;

            if (!name || !imgUrl || isNaN(probability)) {
                alert('请填写所有奖品信息');
                return;
            }

            prizes.push({
                id: i,
                name,
                img_url: imgUrl,
                probability
            });
        }

        // 验证概率总和是否为100%
        const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
        if (totalProbability !== 100) {
            alert(`奖品概率总和必须为100%，当前为${totalProbability}%`);
            return;
        }

        // 保存到数据库
        for (const prize of prizes) {
            const { error } = await supabaseClient
                .from('prizes')
                .upsert(prize)
                .eq('id', prize.id);

            if (error) throw error;
        }

        alert('奖品设置保存成功！');
    } catch (error) {
        console.error('保存奖品设置失败:', error);
        alert('保存失败，请重试');
    }
}