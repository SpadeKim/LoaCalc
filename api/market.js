export default async function handler(req, res) {
  // 로스트아크 API 주소
  const url = 'https://developer-lostark.game.onstove.com/markets/items';
  
  // Vercel 환경 변수에서 키를 가져옴 (브라우저에선 안 보임)
  const token = process.env.LOSTARK_API_KEY;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // 클라이언트가 보낸 검색 조건(body)을 그대로 전달
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
}