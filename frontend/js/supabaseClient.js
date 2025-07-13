const supabaseUrl = 'https://sncryqjgutdauefdwsqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY3J5cWpndXRkYXVlZmR3c3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjMwMzgsImV4cCI6MjA2Nzg5OTAzOH0.9oLODVtw3hNUtMG-HzwQytRfmtrB-xWSsgrh3rFrXKA';

// 初始化Supabase客户端
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 导出客户端实例供其他文件使用
export { supabaseClient };

// 注意：这里的API密钥是公开的匿名密钥，仅用于客户端读取操作
const supabaseUrl = 'https://sncryqjgutdauefdwsqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY3J5cWpndXRkYXVlZmR3c3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjMwMzgsImV4cCI6MjA2Nzg5OTAzOH0.9oLODVtw3hNUtMG-HzwQytRfmtrB-xWSsgrh3rFrXKA';

// 初始化Supabase客户端
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// 导出客户端实例供其他文件使用
export { supabaseClient };