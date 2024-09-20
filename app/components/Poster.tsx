import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { QRCode } from 'react-qrcode-logo'; 
interface PosterProps {
  title: string;
  authors: string[];
  tags: string[];
  presenter: string;
  date: string;
  journalName: string;
  publicationDate: string;
  sciCategory: string;
  url:string;
}

const Poster: React.FC<PosterProps> = ({ title, authors, tags, presenter, date, journalName, publicationDate, sciCategory,url }) => {
  const posterRef = useRef<HTMLDivElement>(null);

  const generateImage = () => {
    if (posterRef.current) {
      html2canvas(posterRef.current, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'cover.png';
        link.click();
      });
    }
  };

  const tagColors = [
    'bg-red-200 text-red-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
  ];

  const getTitleFontSize = (title: string) => {
    if (title.length > 20) return 'text-4xl';
    if (title.length > 10) return 'text-5xl';
    return 'text-6xl';
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={posterRef}
        className="poster-container w-[960px] h-[540px] p-10 border-4 border-gray-400 bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg shadow-lg relative box-border"
      >
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold text-gray-700" style={{ fontFamily: 'Arial, sans-serif', color: '#2c3e50' }}>{journalName}</p>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Arial, sans-serif', color: '#34495e' }}>{publicationDate}</p>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'Arial, sans-serif', color: '#34495e' }}>{sciCategory}</p>
        </div>
        <h1 className={`${getTitleFontSize(title)} mb-8 text-center font-bold text-gray-800`}>{title}</h1>
        <p className="text-xl mb-6 text-center text-gray-600 line-clamp-2 overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>{authors}</p>
        <div className="flex justify-center items-center mb-8">
          <div className="text-center text-xl text-gray-700">
            {tags.map((tag, index) => (
              <span key={tag} className={`inline-block ${tagColors[index % tagColors.length]} px-3 py-1 rounded-full text-sm mr-2 mb-2`}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gray-200 flex items-center justify-center">
          <QRCode value={url} size={96} />
        </div>
        <div className="absolute bottom-10 right-10 text-right text-xl text-gray-700">
          <p>{presenter}</p>
          <p>{date}</p>
        </div>
      </div>
      <div className="mt-5 flex space-x-4">
        <button onClick={generateImage} className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition-colors duration-200">保存</button>
      </div>
    </div>
  );
};

export default Poster;
