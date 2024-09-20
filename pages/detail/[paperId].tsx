import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchPapersByID } from '@/lib/api';
import PaperDetail from '@/app/components/PaperDetail';

const PaperDetailPage: React.FC = () => {
  const router = useRouter();
  const { paper_id } = router.query;
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paper_id) return;

    const getPaper = async () => {
      try {
        const data = await fetchPapersByID(paper_id as string);
        console.log('data:', data);
        setPaper(data);
      } catch (err) {
        console.error('Failed to fetch paper:', err);
      }
    };

    getPaper();
  }, [paper_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">未找到论文。</p>
      </div>
    );
  }

  return (
      <PaperDetail
        paper_id={paper.paper_id}
        title={paper.title}
        abstract={paper.abstract}
        translatedAbstract={paper.translated_abstract}
        authors={paper.authors}
        institution={paper.institutions}
        tags={paper.tags}
        date={paper.publication_date}
        downloadUrl={paper.url}
        arxivId={paper.arxiv_id}
        repoUrl={paper.code_url}
      />
  );
};

export default PaperDetailPage;