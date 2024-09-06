import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PaperDetail from '../../app/components/PaperDetail';
import { fetchPaperById } from './api';

const PaperDetailPage: React.FC = () => {
  const router = useRouter();
  const { paperId } = router.query;
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paperId) return;

    const getPaper = async () => {
      try {
        const data = await fetchPaperById(paperId as string);
        setPaper(data);
        setLoading(false);
      } catch (err) {
        setError('获取论文时出错。请稍后再试。');
        setLoading(false);
      }
    };

    getPaper();
  }, [paperId]);

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
    <div className="container mx-auto px-4 py-8">
      <PaperDetail
        title={paper.paper_title}
        abstract={paper.paper_abstract}
        translatedAbstract={paper.translated_abstract}
        authors={paper.paper_authors.split(', ')}
        institution={paper.institution_list.split(', ')}
        tags={paper.tags.split(', ')}
        date={paper.publish_time}
        downloadUrl={paper.paper_url}
      />
    </div>
  );
};

export default PaperDetailPage;