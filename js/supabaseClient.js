// 导入Supabase客户端
import { createClient } from '@supabase/supabase-js';

// 配置Supabase（替换为您的实际信息）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 初始化客户端
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 导出客户端实例
export { supabaseClient };
