export const fetchPaperById = async (paperId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/papers/id/${paperId}`);
    if (!response.ok) {
      throw new Error('获取论文失败');
    }
    const data = await response.json();
    return data;
  };

export const fetchPapersByTopic = async (activeTab: string) => {
    try {
      console.log('开始获取论文数据');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/papers/topic/${activeTab}`);
      if (!response.ok) {
        throw new Error('获取论文失败');
      }
      const data = await response.json();
      console.log('获取到的数据:', data);

      return data;
    } catch (err) {
      console.error('获取论文时出错:', err);
      return [];
    }
  };