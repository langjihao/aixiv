import React from 'react'
import CardView from './CardView'
import ListView from './ListView'
import NetView from './NetView'

interface Paper{
  cover: string;
  title: string;
  authors: string[];
  institutions: string[];
  tags: string[];
  publication_date: string;
}

//为搜索页提供，这个组件提供结果统计，结果展示，结果筛选，结果排序的功能，并为每个结果提供入口
//Input 一个列表
const Index: React.FC = () => {
  return (
    <div>:</div>
  )
}

export default Index;