import React, { useState, useEffect } from 'react';

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAzMjMxOTYifQ.nxAftR5TwFQLido8LhWsy8GSEB0d6v266tHgvaPQjo4YyMBSUKIU4HykviDzw_A2_f2T9GWEWxTBP6vyDYlVgIRu-z_aZCucRdMn8joW-FLbeG0YxVYX4st-CFy30uvo0PfhQ2PoYSTCNQoqxm8MF8isxEK7e8-BgP86Gwk8tdfhtjdegU--MB3thiBbSdCLlYCNVD7uBWRxULpV42VaC3kWdnRVxs3goVwpisAC4OtZFlosw-SR_obN0pG3ZssgVdxsOyjqbOydinvUWDXCG-ISfcQ-DuEQHeewzfvP2flgfCBAAk-DezZYLUt0Fkdf9tJqirbjaskv4oH656FVxw";

const GRADE_BG = {
  '일반': 'bg-gray-500',
  '고급': 'bg-green-600',
  '희귀': 'bg-blue-500',
  '영웅': 'bg-purple-600',
  '전설': 'bg-orange-500',
  '유물': 'bg-red-600',
  '고대': 'bg-yellow-100', 
};

const BASE_PROBABILITIES = {
  12: 5.0, 13: 5.0, 
  14: 4.0, 15: 4.0, 16: 4.0, 
  17: 3.0, 18: 3.0, 19: 3.0, 
  20: 1.5, 21: 1.5,
  22: 1.0, 23: 1.0, 
  24: 0.5, 25: 0.5
};

const REFINE_DATA = {
  "방어구": {
    12: { shard: 9570, fusion: 11, leap: 11, stone: 930, gold: 2450 },
    13: { shard: 10540, fusion: 12, leap: 12, stone: 1030, gold: 2700 },
    14: { shard: 11520, fusion: 13, leap: 13, stone: 1120, gold: 2950 },
    15: { shard: 12690, fusion: 15, leap: 14, stone: 1240, gold: 3250 },
    16: { shard: 13670, fusion: 16, leap: 15, stone: 1330, gold: 3500 },
    17: { shard: 14840, fusion: 17, leap: 17, stone: 1450, gold: 3800 },
    18: { shard: 16010, fusion: 19, leap: 18, stone: 1560, gold: 4100 },
    19: { shard: 17380, fusion: 20, leap: 20, stone: 1700, gold: 4450 },
    20: { shard: 18550, fusion: 22, leap: 21, stone: 1810, gold: 4750 },
    21: { shard: 19920, fusion: 23, leap: 23, stone: 1950, gold: 5100 },
    22: { shard: 21280, fusion: 25, leap: 24, stone: 2080, gold: 5450 },
    23: { shard: 22460, fusion: 26, leap: 26, stone: 2200, gold: 5750 },
    24: { shard: 23820, fusion: 28, leap: 27, stone: 2330, gold: 6100 },
    25: { shard: 25000, fusion: 30, leap: 29, stone: 2450, gold: 6400 },
  },
  "무기": {
    12: { shard: 15890, fusion: 18, leap: 17, stone: 1700, gold: 4050 },
    13: { shard: 17660, fusion: 21, leap: 19, stone: 1890, gold: 4500 },
    14: { shard: 19420, fusion: 23, leap: 21, stone: 2080, gold: 4950 },
    15: { shard: 21190, fusion: 25, leap: 23, stone: 2270, gold: 5400 },
    16: { shard: 22960, fusion: 27, leap: 25, stone: 2460, gold: 5850 },
    17: { shard: 25120, fusion: 29, leap: 28, stone: 2690, gold: 6400 },
    18: { shard: 27080, fusion: 32, leap: 30, stone: 2900, gold: 6900 },
    19: { shard: 29040, fusion: 34, leap: 32, stone: 3110, gold: 7400 },
    20: { shard: 31200, fusion: 37, leap: 34, stone: 3340, gold: 7950 },
    21: { shard: 33360, fusion: 39, leap: 37, stone: 3570, gold: 8500 },
    22: { shard: 35520, fusion: 42, leap: 39, stone: 3800, gold: 9050 },
    23: { shard: 37680, fusion: 44, leap: 42, stone: 4030, gold: 9600 },
    24: { shard: 39840, fusion: 47, leap: 44, stone: 4260, gold: 10150 },
    25: { shard: 42000, fusion: 50, leap: 47, stone: 4500, gold: 10700 },
  }
};

const ItemIcon = ({ info, name }) => {
  if (info && info.icon) {
    const bgClass = GRADE_BG[info.grade] || 'bg-gray-700';
    return (
      <div className={`w-8 h-8 rounded p-0.5 mr-2 shrink-0 relative ${bgClass} flex items-center justify-center overflow-hidden border border-gray-400`}>
        <img src={info.icon} alt={name} className="w-full h-full object-cover rounded-sm" />
      </div>
    );
  }
  return (
    <div className={`w-8 h-8 rounded bg-gray-400 flex items-center justify-center text-xs text-white mr-2 shrink-0`}>
      {name[0]}
    </div>
  );
};

export default function LostArkRefiningCalc() {
  const [equipmentType, setEquipmentType] = useState("방어구");
  const [targetLevel, setTargetLevel] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('price');
  
  const [resultTab, setResultTab] = useState('optimal');
  const [calcResult, setCalcResult] = useState(null);

  // ★ 추가: 귀속 재료 0골드 계산 여부 체크박스 상태
  const [isBoundMaterialFree, setIsBoundMaterialFree] = useState(false);

  const breathName = equipmentType === "무기" ? "용암의 숨결" : "빙하의 숨결";

  const getBreathCount = (level) => {
    if (level >= 12 && level <= 19) return 20;
    if (level >= 20 && level <= 23) return 25;
    if (level >= 24 && level <= 25) return 50;
    return 0;
  };

  const MAT_NAMES = {
    shard: "운명의 파편",
    fusion: "상급 아비도스 융화 재료", 
    leap: "위대한 운명의 돌파석", 
    stone: equipmentType === "방어구" ? "운명의 수호석 결정" : "운명의 파괴석 결정",
    breath: breathName,
    gold: "골드"
  };

  const [prices, setPrices] = useState({
    "운명의 파편": 0.05, 
    "상급 아비도스 융화 재료": 0,
    "운명의 수호석 결정": 0,    
    "운명의 파괴석 결정": 0,
    "위대한 운명의 돌파석": 0,
    "용암의 숨결": 0,
    "빙하의 숨결": 0,
  });

  const [boundItems, setBoundItems] = useState({
    "운명의 파편": 0, 
    "상급 아비도스 융화 재료": 0,
    "운명의 수호석 결정": 0,    
    "운명의 파괴석 결정": 0,
    "위대한 운명의 돌파석": 0,
    "용암의 숨결": 0,
    "빙하의 숨결": 0,
  });

  const [itemInfos, setItemInfos] = useState({});

  const fetchMarketPrices = async () => {
    setIsLoading(true);
    setActiveTab('price'); 

    try {
      const targetItemList = [
        "운명의 파편 주머니(대)",
        "상급 아비도스 융화 재료",
        "운명의 수호석 결정",
        "운명의 파괴석 결정",
        "위대한 운명의 돌파석",
        "용암의 숨결",
        "빙하의 숨결"
      ];

      const requests = targetItemList.map(itemName => 
        fetch('/api/markets/items', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Sort: "CURRENT_MIN_PRICE",
            CategoryCode: 50000, 
            ItemTier: 0,
            ItemName: itemName,
            PageNo: 1,
            SortCondition: "ASC",
          })
        }).then(res => res.json())
      );

      const results = await Promise.all(requests);
      
      const newPrices = { ...prices };
      const newItemInfos = { ...itemInfos };

      results.forEach((data, index) => {
        const searchedName = targetItemList[index];
        
        if (data.Items && data.Items.length > 0) {
          const itemData = data.Items[0];
          
          if (searchedName === "운명의 파편 주머니(대)") {
            newPrices["운명의 파편"] = parseFloat((itemData.CurrentMinPrice / 3000).toFixed(4));
            newItemInfos["운명의 파편"] = { icon: itemData.Icon, grade: itemData.Grade };
          } else {
            if (newPrices.hasOwnProperty(searchedName)) {
              if (searchedName.includes("결정")) {
                 newPrices[searchedName] = itemData.CurrentMinPrice / 100;
              } else {
                 newPrices[searchedName] = itemData.CurrentMinPrice;
              }
              newItemInfos[searchedName] = { icon: itemData.Icon, grade: itemData.Grade };
            }
          }
        }
      });

      setPrices(newPrices);
      setItemInfos(newItemInfos);

    } catch (error) {
      console.error(error);
      alert(`에러 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBoundItemChange = (name, value) => {
    setBoundItems(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  useEffect(() => {
    fetchMarketPrices();
  }, []);

  const currentReq = REFINE_DATA[equipmentType]?.[targetLevel] || { shard: 0, fusion: 0, leap: 0, stone: 0, gold: 0 };
  const reqBreathCount = getBreathCount(targetLevel); 

  // ★ 수정: 1회 트라이 비용 계산 (귀속 재료 체크 여부 반영)
  const calculateOneTryCost = (useBreath) => {
    let cost = 0;

    // 1. 재료 비용 (파편, 융화, 돌파석, 결정)
    // 체크박스가 켜져 있으면(true), 재료비는 0원 처리
    if (!isBoundMaterialFree) {
      cost += (prices[MAT_NAMES.shard] || 0) * currentReq.shard;
      cost += (prices[MAT_NAMES.fusion] || 0) * currentReq.fusion;
      cost += (prices[MAT_NAMES.leap] || 0) * currentReq.leap;
      cost += (prices[MAT_NAMES.stone] || 0) * currentReq.stone;
    }

    // 2. 골드 비용 (항상 포함)
    cost += currentReq.gold;
    
    // 3. 숨결 비용 (풀숨일 경우)
    // 숨결은 '귀속 재료' 체크박스와 별개로 볼 수도 있지만, 보통 재료 0원 체크 시 숨결도 있으면 쓴다고 가정할 수 있음.
    // 하지만 "필수 재료"가 아니므로 숨결 값은 그대로 두는 경우가 많음. (여기서는 유저 요청 "필수 재료를 0골드로"에 집중)
    // 만약 숨결도 귀속으로 처리하고 싶다면 여기에도 !isBoundMaterialFree 조건을 걸면 됨.
    // 일단 '필수 재료'만 0원으로 처리하는 로직 유지 (숨결은 선택 재료이므로)
    if (useBreath) {
        cost += (prices[MAT_NAMES.breath] || 0) * reqBreathCount; 
    }
    
    return cost;
  };

  const simulateStrategy = (mixedLimit) => {
    const baseProb = BASE_PROBABILITIES[targetLevel] || 0;
    
    const costFull = calculateOneTryCost(true);
    const costNo = calculateOneTryCost(false);

    let currentArtisan = 0;
    let totalCostAccumulated = 0; 
    let expectedCost = 0; 
    let cumulativeFailProb = 1; 
    const tableRows = [];

    for (let tryCount = 1; tryCount <= 100; tryCount++) {
        // 장인의 기운 100% 도달 시 -> 강제 성공 (재료비는 노숨 비용으로 소모한다고 가정)
        const isJangGiBaek = currentArtisan >= 100;
        
        let shouldUseBreath = tryCount <= mixedLimit;
        if (isJangGiBaek) {
            shouldUseBreath = false; 
        }
        
        const failBonus = Math.min(tryCount - 1, 10) * (baseProb / 10);
        const breathBonus = shouldUseBreath ? baseProb : 0; 
        let successRate = baseProb + failBonus + breathBonus;
        
        const currentOneTryCost = shouldUseBreath ? costFull : costNo;

        if (isJangGiBaek) successRate = 100;

        totalCostAccumulated += currentOneTryCost;

        if (!isJangGiBaek) {
             expectedCost += currentOneTryCost * cumulativeFailProb;
        }

        tableRows.push({
            try: tryCount,
            method: isJangGiBaek ? "노숨(장기백)" : (shouldUseBreath ? "풀숨" : "노숨"),
            successRate: Math.min(successRate, 100).toFixed(2),
            artisan: Math.min(currentArtisan, 100).toFixed(2),
            cost: currentOneTryCost.toLocaleString(undefined, {maximumFractionDigits: 0}),
            accCost: totalCostAccumulated.toLocaleString(undefined, {maximumFractionDigits: 0})
        });

        if (successRate >= 100) break;

        let artisanGain = successRate * 0.465;
        artisanGain = Math.round(artisanGain * 100) / 100;
        currentArtisan += artisanGain;
        cumulativeFailProb *= (1 - (successRate / 100));
    }

    return {
        avgCost: Math.floor(expectedCost),
        artisanCost: Math.floor(totalCostAccumulated),
        rows: tableRows,
        mixedLimit: mixedLimit
    };
  };

  const runOptimization = () => {
    setResultTab('optimal'); 

    const noBreathResult = simulateStrategy(0);
    const fullBreathResult = simulateStrategy(100);

    let bestResult = noBreathResult;
    let bestLimit = 0;

    for (let limit = 1; limit <= 50; limit++) {
        const res = simulateStrategy(limit);
        if (res.avgCost < bestResult.avgCost) {
            bestResult = res;
            bestLimit = limit;
        }
    }

    setCalcResult({
        no: noBreathResult,
        full: fullBreathResult,
        optimal: bestResult,
        bestLimit: bestLimit
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-sm">
      <header className="mb-4 border-b pb-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">재련 최적화 (T4 버전)</h1>
        <button 
          onClick={fetchMarketPrices}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? "로딩 중..." : "🔄 최신 시세 & 아이콘 불러오기"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* 1. 좌측 패널 */}
        <div className="w-full lg:w-1/5 bg-white rounded shadow border overflow-hidden">
          <div className="flex border-b">
            <button className={`flex-1 py-3 font-bold transition ${activeTab === 'price' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('price')}>가격 정보</button>
            <button className={`flex-1 py-3 font-bold transition ${activeTab === 'bound' ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('bound')}>귀속 재료</button>
          </div>
          <div className="p-4 space-y-4">
            {activeTab === 'price' ? (
              <>
                {Object.entries(prices).map(([name, price]) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center flex-1 mr-2">
                      <ItemIcon info={itemInfos[name]} name={name} />
                      <span className="text-xs font-medium text-gray-700">{name}</span>
                    </div>
                    <input type="number" className="border rounded w-20 text-right px-1" value={price} readOnly />
                  </div>
                ))}
                 <p className="text-xs text-gray-400 text-center">* 결정류: 100개당 가격 ÷ 100</p>
              </>
            ) : (
              <>
                 <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">보유 수량</span>
                  <button onClick={() => setBoundItems(prev => Object.keys(prev).reduce((acc, key) => ({...acc, [key]: 0}), {}))} className="text-xs text-red-500 underline">초기화</button>
                </div>
                {Object.entries(boundItems).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center flex-1 mr-2">
                      <ItemIcon info={itemInfos[name]} name={name} />
                      <span className="text-xs font-medium text-gray-700">{name}</span>
                    </div>
                    <input type="number" className="border rounded w-20 text-right px-1" value={count} onChange={(e) => handleBoundItemChange(name, e.target.value)} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 2. 중앙 패널 */}
        <div className="w-full lg:w-1/5 space-y-4">
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="font-bold text-gray-700 mb-4 border-b pb-2">장비 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs mb-1">장비 종류</label>
                <select className="w-full border rounded p-2" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
                  <option value="방어구">방어구 (T4)</option>
                  <option value="무기">무기 (T4)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">목표 단계</label>
                <select className="w-full border rounded p-2" value={targetLevel} onChange={(e) => setTargetLevel(Number(e.target.value))}>
                  {[...Array(14)].map((_, i) => {
                    const level = i + 12;
                    return <option key={level} value={level}>{level}단계</option>
                  })}
                </select>
              </div>
              <div className="pt-2 border-t flex justify-between text-xs">
                 <span className="text-gray-600">기본 확률</span>
                 <span className="font-bold text-blue-600">{BASE_PROBABILITIES[targetLevel] || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow border">
            <h2 className="font-bold text-gray-700 mb-4 border-b pb-2">1회 필수 재료</h2>
            <div className="space-y-2">
              {[MAT_NAMES.shard, MAT_NAMES.fusion, MAT_NAMES.leap, MAT_NAMES.stone].map(itemName => {
                  let reqKey = Object.keys(MAT_NAMES).find(key => MAT_NAMES[key] === itemName);
                  let count = currentReq[reqKey];
                  let cost = (prices[itemName] || 0) * count;
                  return (
                    <div key={itemName} className="flex justify-between items-center text-xs">
                        <div className="flex items-center">
                        <ItemIcon info={itemInfos[itemName]} name={itemName} />
                        <span>x {count.toLocaleString()}</span>
                        </div>
                        {/* 귀속 재료 0원 체크 시 취소선 표시 등 시각적 효과를 줄 수도 있음 */}
                        <span className={`text-gray-500 ${isBoundMaterialFree ? 'line-through text-gray-300' : ''}`}>
                            {cost.toLocaleString(undefined, {maximumFractionDigits: 0})} G
                        </span>
                    </div>
                  )
              })}
               <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded bg-yellow-500 flex items-center justify-center text-white font-bold mr-2 border border-yellow-600">G</div>
                  <span>x {currentReq.gold.toLocaleString()}</span>
                </div>
                <span className="text-gray-500">{currentReq.gold.toLocaleString()} G</span>
              </div>
            </div>

            {/* ★ 추가: 귀속 재료 무료 체크박스 */}
            <div className="mt-3 pt-3 border-t">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        checked={isBoundMaterialFree} 
                        onChange={(e) => setIsBoundMaterialFree(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-bold text-gray-700">귀속 필수 재료를 0골드로 계산</span>
                </label>
            </div>

            <div className="mt-4 pt-3 border-t text-xs text-gray-600">
                 <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center font-bold">
                        <ItemIcon info={itemInfos[MAT_NAMES.breath]} name={MAT_NAMES.breath} />
                        {MAT_NAMES.breath}
                    </span>
                    <span className="font-bold text-blue-600">{reqBreathCount}개 필요</span>
                 </div>
                 <div className="flex justify-between text-gray-400">
                     <span>1회 추가 비용</span>
                     <span>{((prices[MAT_NAMES.breath]||0)*reqBreathCount).toLocaleString()} G</span>
                 </div>
            </div>

            <button onClick={runOptimization} className="w-full bg-indigo-600 text-white py-3 rounded mt-4 hover:bg-indigo-700 font-bold shadow-md">
              최적화 계산하기
            </button>
          </div>
        </div>

        {/* 3. 우측 패널 */}
        <div className="w-full lg:w-3/5 bg-white rounded shadow border flex flex-col overflow-hidden">
           {!calcResult ? (
                <div className="flex items-center justify-center h-full text-gray-400 p-10">
                    좌측 '최적화 계산하기' 버튼을 눌러주세요.
                </div>
           ) : (
               <>
                <div className="flex border-b bg-gray-50">
                    <button 
                        className={`flex-1 py-3 font-bold text-sm ${resultTab === 'optimal' ? 'bg-white border-t-2 border-indigo-600 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => setResultTab('optimal')}
                    >
                        🏆 추천 최적 ({calcResult.bestLimit === 0 ? "노숨" : (calcResult.bestLimit >= 50 ? "풀숨" : "혼합")})
                    </button>
                    <button 
                        className={`flex-1 py-3 font-bold text-sm ${resultTab === 'no' ? 'bg-white border-t-2 border-gray-600 text-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => setResultTab('no')}
                    >
                        노숨 (기본)
                    </button>
                    <button 
                        className={`flex-1 py-3 font-bold text-sm ${resultTab === 'full' ? 'bg-white border-t-2 border-blue-600 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => setResultTab('full')}
                    >
                        풀숨 ({MAT_NAMES.breath})
                    </button>
                </div>

                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                    <div className="mb-4">
                        {resultTab === 'optimal' && (
                            <div className="bg-indigo-50 p-4 rounded border border-indigo-200 mb-4">
                                <h3 className="font-bold text-indigo-900 text-lg mb-1">
                                    💡 최적 전략: {calcResult.bestLimit === 0 ? "끝까지 '노숨'" : (calcResult.bestLimit >= 50 ? "끝까지 '풀숨'" : `${calcResult.bestLimit}트까지 '풀숨', 이후 '노숨'`)}
                                </h3>
                                <p className="text-sm text-indigo-700">
                                    이 방식이 평균적으로 가장 저렴합니다. (평균 {calcResult.optimal.avgCost.toLocaleString()} G)
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-100 rounded">
                                <h3 className="font-bold text-gray-600">평균 비용 (기댓값)</h3>
                                <p className="text-2xl font-bold text-gray-800">
                                    {calcResult[resultTab].avgCost.toLocaleString()} G
                                </p>
                            </div>
                            <div className="p-4 bg-red-50 rounded">
                                <h3 className="font-bold text-red-600">장기백 비용 (100%)</h3>
                                <p className="text-2xl font-bold text-red-700">
                                    {calcResult[resultTab].artisanCost.toLocaleString()} G
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto border rounded relative">
                        <table className="w-full text-center text-sm">
                            <thead className="bg-gray-100 sticky top-0 text-gray-600 font-semibold z-10 shadow-sm">
                                <tr>
                                    <th className="p-3">트라이</th>
                                    <th className="p-3">방식</th>
                                    <th className="p-3">성공 확률</th>
                                    <th className="p-3">장인의 기운</th>
                                    <th className="p-3">비용</th>
                                    <th className="p-3">누적 비용</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {calcResult[resultTab].rows.map((row) => (
                                    <tr key={row.try} className={`hover:bg-gray-50 ${parseFloat(row.successRate) >= 100 ? 'bg-green-50' : ''}`}>
                                        <td className="p-2">{row.try}트</td>
                                        <td className={`p-2 font-bold ${row.method === '풀숨' ? 'text-blue-600' : 'text-gray-500'}`}>{row.method}</td>
                                        <td className="p-2 font-bold text-gray-700">{row.successRate}%</td>
                                        <td className="p-2 text-gray-500">{row.artisan}%</td>
                                        <td className="p-2">{row.cost} G</td>
                                        <td className="p-2 text-gray-500">{row.accCost} G</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
               </>
           )}
        </div>

      </div>
    </div>
  );
}