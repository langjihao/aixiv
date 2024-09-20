import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { userAgent } from "next/server";

export interface PaperDetailProps {
  arxiv_id: string;
  title: string;
  abstract: string;
  translated_abstract: string;
  topic: string;
  url: string;
  code_url: string | null;
  publication_date: string;
  cover: string | null;
  tags: string[];
  institutions: string[] | null;
  authors: string[] | null;
  }
  export interface PaperMain {
    paper_id:string;
    arxiv_id: string;
    title: string;
    abstract: string;
    translated_abstract: string;
    url: string;
    code_url: string | null;
    publication_date: string;
    cover: string | null;
    tags: string[];
    institutions: string[] | null;
    authors: string[] | null;
}
// 定义 Papers 接口
interface PaperSimple {
  title: string;
  publication_date: string;
  venue: string | null;
  authors: string[] | null;
  abstract: string
}

// 定义 UserPaper 接口
export interface UserPaper {
  paper_id: string;
  tags: string[];
  status: number;
  score: number;
  paper_info: PaperSimple; // 嵌套的 Papers 接口
}