export interface PaperDetailProps {
    title: string;
    abstract: string;
    translatedAbstract: string;
    authors: string[];
    institution: string[];
    tags: string[];
    date: string;
    downloadUrl: string;
  }
export interface PaperMain {
    id: string;
    cover: string;
    title: string;
    authors: string;
    institution: string[];
    tags: string[];
    date: string;
    abstract: string;
    topic: string;
    url: string;
}
