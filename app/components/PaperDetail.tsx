import React, { useState } from 'react';
import Poster from './Poster';
import { useUser,SignIn } from '@clerk/nextjs'; 
import { addPapertoUserLibrary } from '@/lib/api'
import { UserPaper } from '@/lib/DataModel';
import LinkHandler from './LinkHandler';
interface PaperDetailProps {
  paper_id:string;
  title: string;
  date: string;
  authors: string[] | null;
  institution: string[] | null;
  tags: string[] | null;
  abstract: string;
  translatedAbstract: string;
  downloadUrl: string;
  arxivId: string;
  repoUrl: string | null;
}

const PaperDetail: React.FC<PaperDetailProps> = ({
  paper_id,
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
  const { isSignedIn, user } = useUser();
  const [wantToRead, setWantToRead] = useState(false); // 状态管理
  const handleWantToRead = () => {
    setWantToRead(!wantToRead);
    if(wantToRead==true && user!=null){
      const collectedPaper : UserPaper = {
        paper_id:paper_id,
        user_id:user.id,
        tags:[],
        score:0,
        status:0,
        arxiv_id:arxivId,
        comment:''
      };
      addPapertoUserLibrary(collectedPaper);
    }else{
      console.log(1)
    }
  };
  const authorinfo = authors?authors:[];
  const tagsinfo = tags?tags:[];
  const [showPoster, setShowPoster] = useState(false);
  const collectionArea = (
    <div>
      {wantToRead ? (
        <a onClick={() => handleWantToRead()}
          className="block bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-red-700 transition-colors duration-200 shadow-md mr-4 mb-4 cursor-pointer"> {/* 添加 cursor-pointer */}
          已想读
        </a>
      ) : (
        <a onClick={() => handleWantToRead()}
          className="block bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-red-700 transition-colors duration-200 shadow-md mr-4 mb-4 cursor-pointer"> {/* 添加 cursor-pointer */}
          想读
        </a>
      )}
    </div>
  );
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
              {tagsinfo.map(tag => (
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
          <LinkHandler
            url={downloadUrl}
            isExternal={true}
            className="block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-blue-700 transition-colors duration-200 shadow-md mr-4 mb-4"
          >
            去Arxiv查看
          </LinkHandler>
          <LinkHandler // 将 PDF 链接替换为 LinkHandler
            url={`https://arxiv.org/pdf/${arxivId}`}
            isExternal={true}
            className="block bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-green-700 transition-colors duration-200 shadow-md mr-4 mb-4"
          >
            PDF
          </LinkHandler>
          <LinkHandler // 将沉浸式翻译链接替换为 LinkHandler
            url={`https://arxiv.org/html/${arxivId}?_immersive_translate_auto_translate=1`}
            isExternal={true}
            className="block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-purple-700 transition-colors duration-200 shadow-md mr-4 mb-4"
          >
            沉浸式翻译
          </LinkHandler>
          {isSignedIn && collectionArea }
          {repoUrl && (
            <LinkHandler // 将 GitHub 链接替换为 LinkHandler
              url={repoUrl}
              isExternal={true}
              className="block bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-red-700 transition-colors duration-200 shadow-md mr-4 mb-4"
            >
              GitHub
            </LinkHandler>
          )}

          <button
            onClick={() => setShowPoster(!showPoster)}
            className="block bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold text-center hover:bg-red-700 transition-colors duration-200 shadow-md mr-4 mb-4"
          >
            PPT封面
          </button>
        </div>
        {showPoster && (
          <div className="mt-8">
            <Poster
              title={title}
              authors={authorinfo}
              tags={tags?tags:[]}
              presenter="郎吉豪"  // 这里可以根据需要传递实际的讲述人
              date={date}
              journalName="Medical Image Analysis"
              publicationDate="2023"
              sciCategory="SCI-I"
              url={downloadUrl}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default PaperDetail;