import React from 'react';

interface PaperDetailProps {
  title: string;
  date: string;
  authors: string;
  institution: string;
  tags: string[];
  abstract: string;
  translatedAbstract: string;
  downloadUrl: string;
  arxivId: string;
  repoUrl: string;
}

const PaperDetail: React.FC<PaperDetailProps> = ({
  title,
  date,
  authors,
  institution,
  tags,
  abstract,
  translatedAbstract,
  downloadUrl,
  arxivId,
  repoUrl,
}) => {
  return (
    <div className="container mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold mb-8 text-center border-b-2 pb-4">{title}</h1>
        <div className="flex flex-col md:flex-row justify-between mb-8 border-b-2 pb-4">
          <div className="md:w-2/3">
            <p className="text-gray-700 mb-2"><strong>日期:</strong> {date}</p>
            <p className="text-gray-700 mb-2"><strong>作者:</strong> {authors}</p>
            <p className="text-gray-700 mb-2"><strong>机构:</strong> {institution}</p>
          </div>
          <div className="md:w-1/3 flex flex-col items-start">
  <div className="flex flex-wrap">
    {tags.map(tag => (
      <span key={tag} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2 border border-gray-300 shadow-sm">
        {tag}
      </span>
    ))}
  </div>
</div>
        </div>
        <div className="flex flex-col md:flex-row">
  <div className="md:w-1/2 md:pr-4 mb-8 md:mb-0 border-b-2 md:border-b-0 md:border-r-2 pb-4 md:pb-0 max-h-96 overflow-y-auto">
    <h2 className="text-2xl font-semibold mb-4">摘要</h2>
    <p className="text-gray-900 leading-relaxed">{abstract}</p>
  </div>
  <div className="md:w-1/2 md:pl-4 max-h-96 overflow-y-auto">
    <h2 className="text-2xl font-semibold mb-4">摘要翻译</h2>
    <p className="text-gray-900 leading-relaxed">{translatedAbstract}</p>
  </div>
</div>
        <div className="flex justify-center mt-8">
        <a
  href={downloadUrl}
  className="block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-blue-700 transition-colors duration-200 shadow-md mr-4 mb-4"
>
  去Arxiv查看
</a>
<a
  href={`https://arxiv.org/pdf/${arxivId}`}
  className="block bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-green-700 transition-colors duration-200 shadow-md mr-4 mb-4"
  download
>
  PDF
</a>
<a
  href={`https://arxiv.org/html/${arxivId}?_immersive_translate_auto_translate=1`}
  className="block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-purple-700 transition-colors duration-200 shadow-md mr-4 mb-4"
>
  沉浸式翻译
</a>
<a
  href={repoUrl}
  className="block bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-red-700 transition-colors duration-200 shadow-md mr-4 mb-4"
>
  GitHub
</a>

        </div>
      </div>
    </div>
  );
};

export default PaperDetail;