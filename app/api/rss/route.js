import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: '缺少 URL 参数' }, { status: 400 });
  }

  try {
    const response = await axios.get(url);
    return new NextResponse(response.data, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    return NextResponse.json({ error: '无法获取 RSS 源' }, { status: 500 });
  }
}