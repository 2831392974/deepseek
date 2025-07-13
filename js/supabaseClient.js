// 导入Supabase客户端
import { createClient } from '@supabase/supabase-js';

// 配置Supabase（替换为您的实际信息）
const supabaseUrl = 'https://sncryqjgutdauefdwsqf.supabase.co'; // 替换为第一步获取的URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY3J5cWpndXRkYXVlZmR3c3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjMwMzgsImV4cCI6MjA2Nzg5OTAzOH0.9oLODVtw3hNUtMG-HzwQytRfmtrB-xWSsgrh3rFrXKA'; // 替换为第一步获取的密钥

// 初始化客户端
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 导出客户端实例
export { supabaseClient };
