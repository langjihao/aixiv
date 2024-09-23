import React from 'react';

interface LinkHandlerProps {
  url: string;
  isExternal?: boolean; // 是否为外部链接
}

const LinkHandler: React.FC<LinkHandlerProps> = ({ url, isExternal }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (isExternal) {
      e.preventDefault();
      window.open(url, '_blank'); // 在外部浏览器中打开链接
    } else {
      // 在应用内处理跳转逻辑
      // 例如使用 React Router 的 history.push(url)
      console.log('Navigate within app to:', url);
    }
  };

  return (
    <a href={url} onClick={handleClick}>
      {url}
    </a>
  );
};

export default LinkHandler;