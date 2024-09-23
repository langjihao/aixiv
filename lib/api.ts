import { createClient } from '@supabase/supabase-js';
import { UserPaper } from './DataModel'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// export const fetchPaperByArxivId = async (arxiv_id: string) => {
//   const { data: paper, error } = await supabase
//   .from('arxiv') // 修改为查询 arxiv 数据表
//   .select()
//   .eq('arxiv_id',arxiv_id )
//   .single();
// if (error) {
//   console.error('Error fetching paper:', error);
//   throw new Error(error.message);
// }
// console.log('papers_info:',paper)
// return paper;
// };
// 暂时修改成获取全部文章的
export const fetchPapersByTopic = async (activeTab: string) => {
    const { data: paper, error } = await supabase
      .from('papers') 
      .select(`
        paper_id,
        arxiv_id,
        title,
        publication_date,
        authors,
        institutions,
        tags,
        abstract,
        cover,
        translated_abstract,
        url,
        code_url
        `)
    console.log(paper)
    if (error) {
      console.error('Error fetching paper:', error);
      throw new Error(error.message);
    }
    return paper;
  };
// 通过ID从数据库中查找论文
export const fetchPapersByID = async (paperId: string) => {
  const { data: paper, error } = await supabase
    .from('papers')
    .select()
    .eq('paper_id', paperId)
    .single();

  if (error) {
    console.error('Error fetching paper:', error);
    throw new Error(error.message);
  }

  return paper;
};
// 将论文添加到个人图书馆中
export const addPapertoUserLibrary = async (paper : UserPaper) => {
  const { data, error } = await supabase
  .from('user_papers') // 假设这是用户库的表名
  .insert([paper]); // 插入用户和论文的关联

if (error) {
  console.error('Error adding paper to user library:', error);
  throw new Error(error.message);
}

return data; // 返回插入的数据
};
// 查询个人图书馆
export const fetchUserLibrary = async (user_id: string, status: number) => {
  const { data: papers, error } = await supabase
    .from('user_papers')
    .select(`
      paper_id,
      tags,
      status,
      score,
      papers(title,publication_date,venue,authors,abstract)
      `)
    .eq('user_id', user_id) // 添加第一个查询条件
    .eq('status', status); // 添加第二个查询条件
  
  if (error) {
    console.error('Error fetching user library:', error);
    throw new Error(error.message);
  }
  // 转换 papers 为符合 UserPaper 接口的格式
  const formattedPapers = papers.map((paper: any) => ({
    paper_id: paper.paper_id,
    tags: paper.tags,
    status: paper.status,
    score: paper.score,
    paper_info: paper.papers, // 将 papers 转为 paper_info
  }));

  return formattedPapers;
};
