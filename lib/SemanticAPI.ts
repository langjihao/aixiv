import { createClient } from '@supabase/supabase-js';
import { getAiTranslation,getAiTags } from './AIprocess';
import { storePaperData,fetchPaperByID,fetchPaperBySemanticID } from './DataBase';
const API_BASE_URL = process.env.NEXT_PUBLIC_S2_BASE_URL || 'https://api.semanticscholar.org/graph/v1';


const DEFAULT_FIELDS = `
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
  tldr
`.replace(/\s+/g, '');

export const searchPaperBypaperId = async (
  semantic_id: string,
  fields: string = DEFAULT_FIELDS
) => {
  const paper = await fetchPaperBySemanticID(semantic_id);
  if (paper) {
    return paper;
  } else {
    const url = `${API_BASE_URL}/paper/${semantic_id}?fields=${fields}`;

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
    await storePaperData(data);
    return data;
  }
};
// 补全
export const searchPapersByQuery = async(query: string) => {
    const url = `${API_BASE_URL}/paper/autocomplete?query=${query}`;
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'         
        },
    });
    if (!response.ok) {
        throw new Error(`Error fetching paper details: ${response.statusText}`);
      }
    
      const data = await response.json();
      return data;
};
export const searchPapersByTitle = async(query: string) => {
    const url = `${API_BASE_URL}/paper/search?query=${query}&offset=0&limit=10&fields=${DEFAULT_FIELDS}`;
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
      console.log(data);
      return data;
} 

