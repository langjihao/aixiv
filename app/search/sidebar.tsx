import React, { useState, useEffect } from 'react';
import { Spin, Divider, Tag, Tooltip, Button } from 'antd';
import { CloseOutlined, BookOutlined, TeamOutlined, FieldTimeOutlined, FileTextOutlined, BarChartOutlined, TagOutlined, TranslationOutlined } from '@ant-design/icons';
import { fetchVenue } from '@/lib/Venue';
import { getAiTranslation, getAiTags } from '@/lib/AIprocess';

interface PaperSidebarProps {
  paperData: any;
  isLoading: boolean;
  onClose: () => void;
  navbarHeight: number;
}

const PaperSidebar: React.FC<PaperSidebarProps> = ({ paperData, isLoading, onClose, navbarHeight }) => {
  const [venueInfo, setVenueInfo] = useState<any>(null);
  const [isLoadingVenue, setIsLoadingVenue] = useState(false);
  const [translatedAbstract, setTranslatedAbstract] = useState<string | null>(null);
  const [isLoadingTranslatedAbstract, setIsLoadingTranslatedAbstract] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const fetchVenueInfo = async () => {
      if (paperData && paperData.venue) {
        setIsLoadingVenue(true);
        try {
          const venueData = await fetchVenue(paperData.venue);
          setVenueInfo(venueData.info);
        } catch (error) {
          console.error('Error fetching venue info:', error);
        } finally {
          setIsLoadingVenue(false);
        }
      }
    };

    fetchVenueInfo();
  }, [paperData]);

  useEffect(() => {
    const fetchTranslatedAbstract = async () => {
      if (paperData && paperData.abstract) {
        setIsLoadingTranslatedAbstract(true);
        try {
          const translatedText = await getAiTranslation(paperData.abstract);
          setTranslatedAbstract(translatedText);
        } catch (error) {
          console.error('Error fetching translated abstract:', error);
        } finally {
          setIsLoadingTranslatedAbstract(false);
        }
      }
    };

    fetchTranslatedAbstract();
  }, [paperData]);

  useEffect(() => {
    const fetchTags = async () => {
      if (paperData && paperData.abstract) {
        setIsLoadingTags(true);
        try {
          const aiTags = await getAiTags(paperData.abstract);
          console.log(aiTags);
          setTags(aiTags);
        } catch (error) {
          console.error('Error fetching AI tags:', error);
        } finally {
          setIsLoadingTags(false);
        }
      }
    };

    fetchTags();
  }, [paperData]);

  const parseStringToArray = (input: string): string[] => {
    try {
      const jsonString = input.replace(/'/g, '"');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing string to array:', error);
      return [];
    }
  };

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <h3 className="text-lg font-semibold mb-3 flex items-center text-indigo-700">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
  );

  return (
    <aside
      className="fixed right-0 bg-white p-6 overflow-y-auto border-l border-gray-200 z-50 shadow-lg transition-all duration-300 ease-in-out"
      style={{
        top: `${navbarHeight}px`,
        bottom: '0px',
        width: '32rem',
        transform: isLoading ? 'translateX(100%)' : 'translateX(0)',
      }}
    >
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200"
        onClick={onClose}
      >
        <CloseOutlined className="text-lg" />
      </button>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Spin tip="加载中..." size="large" />
        </div>
      ) : (
        paperData && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">{paperData.title}</h2>

            <section className="bg-indigo-50 p-4 rounded-lg">
              <SectionTitle icon={<TeamOutlined />} title="作者" />
              <div className="flex flex-wrap gap-2">
                {paperData.authors.map((author: any, index: number) => (
                  <Tag key={index} color="purple">{author.name}</Tag>
                ))}
              </div>
            </section>

            <section className="bg-blue-50 p-4 rounded-lg">
              <SectionTitle icon={<TagOutlined />} title="关键词" />
              {isLoadingTags ? (
                <Spin size="small" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-green-50 p-4 rounded-lg">
              <SectionTitle icon={<FileTextOutlined />} title="摘要" />
              <div className="text-gray-700 text-justify mb-4">{paperData.abstract}</div>
              {isLoadingTranslatedAbstract ? (
                <Spin size="small" />
              ) : translatedAbstract && (
                <>
                  <Button 
                    icon={<TranslationOutlined />} 
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="mb-2"
                  >
                    {showTranslation ? '隐藏翻译' : '显示翻译'}
                  </Button>
                  {showTranslation && (
                    <div className="text-gray-600 text-justify italic bg-white p-3 rounded-lg border border-green-200">
                      {translatedAbstract}
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="bg-yellow-50 p-4 rounded-lg">
              <SectionTitle icon={<BookOutlined />} title="发表信息" />
              {isLoadingVenue ? (
                <Spin size="small" />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Tooltip title={paperData.venue}>
                    <p className="truncate"><strong>会议/期刊：</strong> {paperData.venue}</p>
                  </Tooltip>
                  <p><strong>年份：</strong> {paperData.year}</p>
                  {venueInfo?.ccf && <p><strong>CCF等级: </strong> {venueInfo.ccf}</p>}
                  {venueInfo?.sciUp && <p><strong>大类分区：</strong> {venueInfo.sciUp}</p>}
                  {venueInfo?.sciSmall && <p><strong>小类分区：</strong> {venueInfo.sciSmall}</p>}
                  {venueInfo?.sciif && <p><strong>影响因子：</strong> {venueInfo.sciif}</p>}
                  {venueInfo?.sciUpTop && <p><strong>Top：</strong> {venueInfo.sciUpTop}</p>}
                </div>
              )}
            </section>

            <section className="bg-red-50 p-4 rounded-lg">
              <SectionTitle icon={<FieldTimeOutlined />} title="外部 ID" />
              <div className="grid grid-cols-2 gap-2">
                {paperData.externalIds &&
                  Object.entries(paperData.externalIds).map(([key, value]) => (
                    <Tooltip key={key} title={value as string}>
                      <p className="truncate">
                        <span className="font-semibold">{key}：</span>
                        <span className="text-blue-600">{value as string}</span>
                      </p>
                    </Tooltip>
                  ))}
              </div>
            </section>

            <section className="bg-purple-50 p-4 rounded-lg">
              <SectionTitle icon={<BarChartOutlined />} title="统计信息" />
              <div className="flex justify-between">
                <p>
                  <span className="font-semibold">引用数：</span>
                  <span className="text-green-600">{paperData.citationCount}</span>
                </p>
                <p>
                  <span className="font-semibold">参考文献数：</span>
                  <span className="text-blue-600">{paperData.referenceCount}</span>
                </p>
              </div>
            </section>

            <section className="bg-pink-50 p-4 rounded-lg">
              <SectionTitle icon={<TagOutlined />} title="研究领域" />
              <div className="flex flex-wrap gap-2">
                {paperData.fieldsOfStudy &&
                  paperData.fieldsOfStudy.map((field: string, index: number) => (
                    <Tag key={index} color="magenta">{field}</Tag>
                  ))}
              </div>
            </section>

            {paperData.tldr && (
              <section className="bg-orange-50 p-4 rounded-lg">
                <SectionTitle icon={<FileTextOutlined />} title="TLDR" />
                <p className="text-gray-700">{paperData.tldr.text}</p>
              </section>
            )}
          </div>
        )
      )}
    </aside>
  );
};

export default PaperSidebar;
