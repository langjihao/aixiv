import React, { useEffect, useState } from 'react';
import PaperDetail from '../PaperDetail';
import { fetchPaperById } from '../../../lib/api';

interface PaperPreviewModalProps {
  onClose: () => void;
  paperId: string;
}

const PaperModal: React.FC<PaperPreviewModalProps> = ({
  onClose,
  paperId,
}) => {
  const [paper, setPaper] = useState<any>(null);

  useEffect(() => {
    console.log('useEffect triggered');
    console.log('paperId:', paperId);
    if (!paperId) return;
    const getPaper = async () => {
      try {
        const data = await fetchPaperById(paperId as string);
        console.log('data:', data);
        setPaper(data);
      } catch (err) {
        console.error('Failed to fetch paper:', err);
      }
    };

    getPaper();
  }, [paperId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl max-h-screen overflow-y-auto flex flex-row" onClick={(e) => e.stopPropagation()}>
          {paper ? (
            <PaperDetail
              title={paper.paper_title}
              abstract={paper.paper_abstract}
              translatedAbstract={paper.translated_abstract}
              authors={paper.paper_authors.split(',')}
              institution={JSON.parse(paper.institution_list)}
              tags={JSON.parse(paper.tags)}
              date={paper.publish_time}
              downloadUrl={paper.paper_url}
              arxivId={paper.arxiv_id}
              repoUrl={paper.repo_url}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
  );
};

export default PaperModal;