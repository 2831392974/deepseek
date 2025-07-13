-- 创建访问日志表
CREATE TABLE visitor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip TEXT,
    address TEXT,
    longitude TEXT,
    latitude TEXT,
    type TEXT CHECK (type IN ('visit', 'lottery')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建抽奖记录表
CREATE TABLE lottery_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id TEXT UNIQUE,
    prize_id INTEGER,
    prize_name TEXT,
    prize_img TEXT,
    draw_time TEXT,
    ip_address TEXT,
    location TEXT,
    longitude TEXT,
    latitude TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建奖品设置表
CREATE TABLE prizes (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    img_url TEXT NOT NULL,
    probability INTEGER NOT NULL CHECK (probability >= 0 AND probability <= 100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 初始化奖品数据
INSERT INTO prizes (id, name, img_url, probability)
VALUES 
(1, '一等奖: 10元红包', 'https://i.postimg.cc/C1b4fnZ4/prize1.png', 5),
(2, '二等奖: 雪王自选', 'https://i.postimg.cc/bYHTybfy/prize3.png', 10),
(3, '三等奖: 5元红包', 'https://i.postimg.cc/3wsBRFwR/prize2.png', 15),
(4, '四等奖: 柠檬水一杯', 'https://i.postimg.cc/TwHTg1Zp/prize4.png', 20),
(5, '五等奖: 谢谢惠顾', 'https://i.postimg.cc/QM9mhyhw/hanks.png', 50);

-- 创建索引提升查询性能
CREATE INDEX idx_visitor_logs_created_at ON visitor_logs(created_at);
CREATE INDEX idx_lottery_records_draw_time ON lottery_records(draw_time);
CREATE INDEX idx_lottery_records_prize_id ON lottery_records(prize_id);