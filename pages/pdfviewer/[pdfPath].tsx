// Core viewer
import { Worker, Viewer } from '@react-pdf-viewer/core';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
// import { highlightPlugin } from '@react-pdf-viewer/highlight';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
const router = useRouter();
const PdfViewer = () => {
    const { pdfPath } = router.query;
    const [pdfFile, setPdfFile] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = () => {// 修改为以下行
            setPdfFile(fileReader.result ? fileReader.result as string : null as any);
          };
        fileReader.readAsDataURL(file);
      }
    };
  
    return (
      <div>
        <h1>PDF Viewer</h1>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        {pdfFile && (
          <div style={{ marginTop: '20px', height: '600px' }}>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
              <Viewer fileUrl={pdfFile} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          </div>
        )}
      </div>
    );
  };
  
  export default PdfViewer;

  //后续整成可以标注的,改成根据所传路径直接打开文件的