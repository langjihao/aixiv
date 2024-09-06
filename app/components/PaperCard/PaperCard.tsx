import PaperList from "./PaperList";
import PaperGrid from "./PaperGrid";
import React, { useEffect, useState } from 'react';
import PaperModal from '../PaperModal/PaperModal';
interface PaperCardProps {
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
  viewMode: 'grid' | 'list';

}

const PaperCard: React.FC<PaperCardProps> = ({
  id,
  cover,
  title,
  authors,
  institution,
  tags,
  date,
  abstract,
  topic,
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
          id={id}
          cover={cover}
          title={title}
          authors={authors}
          institution={institution}
          tags={tags}
          date={date}
          abstract={abstract}
          topic={topic}
          url={url}
        />
      ) : (
          <PaperList
            id={id}
            title={title}
            authors={authors}
            institution={institution}
            tags={tags}
            date={date}
            abstract={abstract}
            topic={topic}
            url={url}
          />
      )}
    </>
  );
};

export default PaperCard;