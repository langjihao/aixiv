export const fetchPaperById = async (paperId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/papers/id/${paperId}`);
    if (!response.ok) {
      throw new Error('获取论文失败');
    }
    const data = await response.json();
    return data;
  };