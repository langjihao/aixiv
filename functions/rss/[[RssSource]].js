// functions/rss/[[route]].js

export async function onRequest(context) {
  const { request } = context;
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: '缺少 URL 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: '无法获取 RSS 源' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}