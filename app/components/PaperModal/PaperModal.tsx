import React, { useEffect, useState } from 'react';
import PaperDetail from '../PaperDetail';
import { fetchPapersByID } from '../../../lib/api';
interface PaperPreviewModalProps  {
  paper_id:string;
  onClose: () => void;
}

const PaperModal: React.FC<PaperPreviewModalProps> = ({
  paper_id,
  onClose

}) => {
  const [paper, setPaper] = useState<any>(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl max-h-screen overflow-y-auto flex flex-row" onClick={(e) => e.stopPropagation()}>
          {paper ? (
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
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
  );
};

export default PaperModal;