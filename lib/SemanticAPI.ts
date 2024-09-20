import { createClient } from '@supabase/supabase-js';
import { getAiTranslation,getAiTags } from './AIprocess';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_BASE_URL = process.env.NEXT_PUBLIC_S2_BASE_URL || 'https://api.semanticscholar.org/graph/v1';

// interface Author {
//     authorId: string;
//     name: string;
//   }
  
//   interface Paper {
//     paperId: string;
//     title?: string;
//     url?: string;
//     year?: number;
//     authors?: Author[];
//     // 其他字段根据需要添加
//   }
const storePaperData = async (paper: any) => {
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
        const { data, error } = await supabase.from('papers').insert({
          paper_id: paperId,
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
        });
    
        if (error) {
          throw error;
        }
    
        console.log('Paper data stored successfully:', data);
      } catch (error) {
        console.error('Error storing paper data:', error);
      }
    };
export const searchPapersBypaperId = async(paperId: string, fields: string) => {

//   const fieldsParam = fields.join(',');
  const url = `${API_BASE_URL}/paper/${paperId}?fields=${fields}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_S2_API_KEY || '',            
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching paper details: ${response.statusText}`);
  }

  const data = await response.json();
  data.translated_abstract = getAiTranslation(data.abstract);
  data.tags = getAiTags(data.abstract);
  storePaperData(data);
  return data;
}