import PaperList from "./PaperList";
import PaperGrid from "./PaperGrid";
import React, { useEffect, useState } from 'react';
import {PaperMain} from '../../../types/DataModel'
interface PaperCardProps extends PaperMain{
  viewMode: 'grid' | 'list';
  score: number;
}

const PaperCard: React.FC<PaperCardProps> = ({
  arxiv_id,
  cover,
  title,
  authors,
  institutions,
  tags,
  score,
  publication_date,
  abstract,
  url,
  viewMode,

}) => {
  const [clientViewMode, setClientViewMode] = useState(viewMode);

  useEffect(() => {
    setClientViewMode(viewMode);
  }, [viewMode]);

  return (
    <>
      {viewMode === 'grid' ? (
        <PaperGrid
          arxiv_id={arxiv_id}
          cover={cover}
          title={title}
          authors={authors}
          institutions={institutions}
          tags={tags}
          publication_date={publication_date}
        />
      ) : (
          <PaperList
            score={score}
            arxiv_id={arxiv_id}
            cover={cover}
            title={title}
            authors={authors}
            institutions={institutions}
            tags={tags}
            publication_date={publication_date}
          />
      )}
    </>
  );
};

export default PaperCard;