'use client';
import React, { useState } from 'react';
import { fetchPapersfromSupabase } from '@/lib/DataBase';
import { searchPapersBypaperId } from '@/lib/SemanticAPI';

const TestPage: React.FC = () => {
  const [supabasePaperId, setSupabasePaperId] = useState<string>('');
  const [semanticPaperId, setSemanticPaperId] = useState<string>('');
  const [semanticFields, setSemanticFields] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchSupabasePaper = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      console.log(`Fetching paper with ID ${supabasePaperId}`);
      const result = await fetchPapersfromSupabase(supabasePaperId);
      console.log('Fetched data:', result);
      setData(result);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSemanticPaper = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      console.log(`Fetching paper with ID ${semanticPaperId}`);
      const result = await searchPapersBypaperId(semanticPaperId, semanticFields);
      console.log('Fetched data:', result);
      setData(result);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>函数测试页面</h1>
      <div>
        <h2>Supabase Paper</h2>
        <input
          type="text"
          value={supabasePaperId}
          onChange={(e) => setSupabasePaperId(e.target.value)}
          placeholder="输入 Supabase Paper ID"
        />
        <button onClick={handleFetchSupabasePaper}>获取 Supabase Paper</button>
      </div>
      <div>
        <h2>Semantic Scholar Paper</h2>
        <input
          type="text"
          value={semanticPaperId}
          onChange={(e) => setSemanticPaperId(e.target.value)}
          placeholder="Paper ID"
        />
        <input
          type="text"
          value={semanticFields}
          onChange={(e) => setSemanticFields(e.target.value)}
          placeholder="Paper Fields"
        />
        <button onClick={handleFetchSemanticPaper}>获取 Semantic Scholar Paper</button>
      </div>
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error}</div>}
      {data && (
        <div>
          <h2>数据</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestPage;