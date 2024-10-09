import { createClient } from '@supabase/supabase-js';
import { UserPaper,DatabaseUserPaper } from '../types/DataModel'
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
      .from('arxiv') 
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
    if (error) {
      console.error('Error fetching paper:', error);
      throw new Error(error.message);
    }
    return paper;
  };
// 通过ID从数据库中查找论文
export const fetchPaperByID = async (paperId: string) => {
  const { data: paper, error } = await supabase
    .from('arxiv')
    .select()
    .eq('paper_id', paperId)
    .single();

  if (error) {
    console.error('Error fetching paper:', error);
    throw new Error(error.message);
  }

  return paper;
};
// 通过SemanticID从数据库中查找论文
export const fetchPaperBySemanticID = async (semanticId: string) => {
  const { data: paper, error } = await supabase
    .from('papers')
    .select()
    .eq('semantic_id', semanticId)
    .single();

    if (error) {
      // 检查错误是否是因为没有找到记录
      if (error.code === 'PGRST116') {
        console.log(`Paper with id ${semanticId} not found in database`);
        return null;
      }
      // 其他类型的错误仍然记录下来
      console.error('Error fetching from database:', error);
      return null;
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
  const { data: user_papers, error } = await supabase
    .from('user_papers')
    .select(`
      paper_id,
      tags,
      status,
      score,
      papers(title,publication_date,venue,authors,abstract)
    `)
    .eq('user_id', user_id)
    .eq('status', status);

  if (error) {
    console.error('Error fetching user library:', error);
    throw new Error(error.message);
  }
  //bug:这里有一个类型注解错误始终无法修正，连表查询的papers被注解为list，
  //但实际上是单个paper对象
  //已经限制supabase外键链接为一对一，
  //但是ts仍然无法识别
  const adjustedPapers: UserPaper[] = (user_papers).map((paper) => {
    return {
      paper_id: paper.paper_id,
      tags: paper.tags,
      status: paper.status,
      score: paper.score,
      title: paper.papers.title,
      publication_date: paper.papers.publication_date,
      venue: paper.papers.venue,
      authors: paper.papers.authors,
      abstract: paper.papers.abstract,
    };
  });
  return adjustedPapers;
};
export const storePaperData = async (paper: any) => {
  try {
    const {
      paperId,
      corpusId,
      externalIds,
      url,
      title,
      abstract,
      venue,
      publicationVenue,
      year,
      referenceCount,
      citationCount,
      influentialCitationCount,
      isOpenAccess,
      openAccessPdf,
      fieldsOfStudy,
      s2FieldsOfStudy,
      publicationTypes,
      publicationDate,
      journal,
      citationStyles,
      authors,
      citations,
      references,
      tldr,
    } = paper;

    const { data, error } = await supabase.from('papers').insert([{
      semantic_id: paperId,
      corpus_id: corpusId,
      arxiv_id: externalIds?.ArXiv,
      doi: externalIds?.DOI,
      external_ids: externalIds,
      url,
      title,
      abstract,
      venue,
      publication_venue: publicationVenue,
      year,
      reference_count: referenceCount,
      citation_count: citationCount,
      influential_citation_count: influentialCitationCount,
      is_open_access: isOpenAccess,
      open_access_pdf: openAccessPdf,
      fields_of_study: fieldsOfStudy,
      s2_fields_of_study: s2FieldsOfStudy,
      publication_types: publicationTypes,
      publication_date: publicationDate,
      journal,
      citation_styles: citationStyles,
      authors,
      citations,
      references_list: references,
      tldr,
    }]);

    if (error) {
      throw error;
    }

    console.log('Paper data stored successfully:', data);
  } catch (error) {
    console.error('Error storing paper data:', error);
  }
};