import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.NEXT_PUBLIC_ELSEVIER_API_KEY || '';

async function fetchElsevierDataByPII( PII: string) {
  try {
    const response = await axios.get(`https://api.elsevier.com/content/article/pii/${PII}`, {
      headers: {
        'Accept': 'application/json',
        'X-ELS-APIKey': API_KEY
      }
    });

    // 打印响应数据
    console.log(JSON.stringify(response.data, null, 2));

    // 这里可以添加更多的数据处理逻辑
    // 例如：提取特定字段，格式化数据等
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

// 调用函数
export default fetchElsevierDataByPII;