const { createClient } = require('@supabase/supabase-js');

// 初始化Supabase客户端 - 使用服务端密钥
const supabaseUrl = 'https://zgbvcuyquvfljthljvdb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // 使用环境变量存储密钥
const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = async (req, res) => {
    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '方法不允许，仅支持POST' });
    }

    try {
        const data = req.body;

        // 验证必要字段
        if (!data.id || !data.prizeId || !data.time) {
            return res.status(400).json({ error: '缺少必要的抽奖记录字段' });
        }

        // 保存抽奖记录到数据库
        const { error: recordError } = await supabase
            .from('lottery_records')
            .insert([{
                record_id: data.id,
                prize_id: data.prizeId,
                prize_name: data.name,
                prize_img: data.img,
                draw_time: data.time,
                ip_address: data.ip,
                location: data.address,
                longitude: data.longitude,
                latitude: data.latitude
            }]);

        if (recordError) throw recordError;

        // 记录访问日志
        const { error: logError } = await supabase
            .from('visitor_logs')
            .insert([{
                ip: data.ip,
                address: data.address,
                longitude: data.longitude,
                latitude: data.latitude,
                type: 'lottery', // 标记为抽奖类型访问
                created_at: new Date().toISOString()
            }]);

        if (logError) throw logError;

        return res.status(200).json({ success: true, message: '记录保存成功' });
    } catch (error) {
        console.error('保存记录错误:', error);
        return res.status(500).json({ error: '服务器错误，记录保存失败' });
    }
}