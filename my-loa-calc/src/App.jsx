import React, { useState, useEffect } from 'react';

const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAzMjMxOTYifQ.nxAftR5TwFQLido8LhWsy8GSEB0d6v266tHgvaPQjo4YyMBSUKIU4HykviDzw_A2_f2T9GWEWxTBP6vyDYlVgIRu-z_aZCucRdMn8joW-FLbeG0YxVYX4st-CFy30uvo0PfhQ2PoYSTCNQoqxm8MF8isxEK7e8-BgP86Gwk8tdfhtjdegU--MB3thiBbSdCLlYCNVD7uBWRxULpV42VaC3kWdnRVxs3goVwpisAC4OtZFlosw-SR_obN0pG3ZssgVdxsOyjqbOydinvUWDXCG-ISfcQ-DuEQHeewzfvP2flgfCBAAk-DezZYLUt0Fkdf9tJqirbjaskv4oH656FVxw";

const GRADE_BG = {
  '일반': 'bg-gray-500', '고급': 'bg-green-600', '희귀': 'bg-blue-500',
  '영웅': 'bg-purple-600', '전설': 'bg-orange-500', '유물': 'bg-red-600', '고대': 'bg-yellow-100',
};

// ★ 요청하신 대로 원복된 확률 데이터
const BASE_PROBABILITIES = {
  12: 5.0, 13: 5.0, 14: 4.0, 15: 4.0, 16: 4.0,
  17: 3.0, 18: 3.0, 19: 3.0, 20: 1.5, 21: 1.5,
  22: 1.0, 23: 1.0, 24: 0.5, 25: 0.5
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

const getBreathCount = (level) => {
  if (level >= 12 && level <= 16) return 20;
  if (level >= 17 && level <= 23) return 25;
  if (level >= 24 && level <= 25) return 50;
  return 0;
};

const ItemIcon = ({ info, name }) => {
  if (name === "골드") {
      return <img src="/골드.png" alt="골드" className="w-8 h-8 rounded mr-2 shrink-0 border border-gray-400 bg-gray-800" />;
  }
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
      {name ? name[0] : "?"}
    </div>
  );
};

export default function LostArkRefiningCalc() {
  // ★ 에러 수정: MAT_NAMES를 컴포넌트 최상단에 정의
  const MAT_NAMES = {
    stone: "결정", 
    leap: "위대한 운명의 돌파석",
    fusion: "상급 아비도스 융화 재료",
    shard: "운명의 파편",
    breath: "숨결",
    gold: "골드"
  };

  const [equipTab, setEquipTab] = useState('simple');

  const [simpleEquipmentType, setSimpleEquipmentType] = useState("방어구");
  const [simpleTargetLevel, setSimpleTargetLevel] = useState(12); // 목표 단계

  const [addedProb, setAddedProb] = useState(0); 
  const [currentArtisan, setCurrentArtisan] = useState(0); 

  // 초기값: 11->12 설정
  const [detailSettings, setDetailSettings] = useState({
    weapon:   { name: '무기', type: '무기', active: true, start: 11, end: 12 },
    head:     { name: '머리', type: '방어구', active: true, start: 11, end: 12 },
    shoulders:{ name: '견갑', type: '방어구', active: true, start: 11, end: 12 },
    chest:    { name: '상의', type: '방어구', active: true, start: 11, end: 12 },
    pants:    { name: '하의', type: '방어구', active: true, start: 11, end: 12 },
    gloves:   { name: '장갑', type: '방어구', active: true, start: 11, end: 12 },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('price');
  
  const [resultTab, setResultTab] = useState('optimal');
  const [calcResult, setCalcResult] = useState(null);
  const [isBoundMaterialFree, setIsBoundMaterialFree] = useState(false);

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
        "운명의 파편 주머니(대)", "상급 아비도스 융화 재료", "운명의 수호석 결정",
        "운명의 파괴석 결정", "위대한 운명의 돌파석", "용암의 숨결", "빙하의 숨결"
      ];
      const requests = targetItemList.map(itemName => 
        fetch('/api/markets/items', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ Sort: "CURRENT_MIN_PRICE", CategoryCode: 50000, ItemTier: 0, ItemName: itemName, PageNo: 1, SortCondition: "ASC" })
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
    setBoundItems(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleDetailChange = (part, field, value) => {
    setDetailSettings(prev => {
        const newVal = { ...prev[part], [field]: value };
        if (field === 'start' && newVal.end < value) newVal.end = Number(value) + 1;
        return { ...prev, [part]: newVal };
    });
  };

  useEffect(() => { fetchMarketPrices(); }, []);

  const simulateOneStep = (level, type, mixedLimit, currentBound, initialProbBonus = 0, initialArtisanPercent = 0) => {
    // ★ 로직 수정: 11->12를 가려면 key '12' 데이터를 써야 함.
    // 사용자는 '11'을 선택했지만, 데이터는 '12'부터 있음. 
    // 로직: level은 '목표 단계'를 의미하도록 호출부에서 조정하거나 여기서 조정.
    // 여기서 level 인자는 REFINE_DATA의 Key로 사용됨. 
    // 따라서 11->12 시뮬레이션 시에는 level 12가 들어와야 함.
    
    const currentReq = REFINE_DATA[type]?.[level] || { shard: 0, fusion: 0, leap: 0, stone: 0, gold: 0 };
    const reqBreathCount = getBreathCount(level); 
    const baseProb = BASE_PROBABILITIES[level] || 0;
    
    const isWeapon = type === "무기";
    const stoneName = isWeapon ? "운명의 파괴석 결정" : "운명의 수호석 결정";
    const breathName = isWeapon ? "용암의 숨결" : "빙하의 숨결";

    let currentArtisanPercent = initialArtisanPercent; 
    let totalCostAccumulated = 0; 
    let expectedCost = 0; 
    let cumulativeFailProb = 1; 
    
    let accMats = { weaponStone: 0, armorStone: 0, leap: 0, fusion: 0, shard: 0, gold: 0, breath: 0 };
    let expMats = { weaponStone: 0, armorStone: 0, leap: 0, fusion: 0, shard: 0, gold: 0, breath: 0 };
    const tableRows = [];

    for (let tryCount = 1; tryCount <= 100; tryCount++) {
        let needed = {
            stone: currentReq.stone, leap: currentReq.leap, fusion: currentReq.fusion,
            shard: currentReq.shard, gold: currentReq.gold, breath: 0
        };

        const isJangGiBaek = currentArtisanPercent >= 100;
        let shouldUseBreath = tryCount <= mixedLimit;
        if (isJangGiBaek) shouldUseBreath = false; 

        if (shouldUseBreath) needed.breath = reqBreathCount;

        let tryCost = 0;
        
        const calcItemCost = (amount, name) => {
            if (amount > 0) {
                if (isBoundMaterialFree) {
                    let have = currentBound[name] || 0;
                    if (have >= amount) {
                        currentBound[name] -= amount; 
                    } else {
                        let deficit = amount - have;
                        tryCost += deficit * (prices[name] || 0);
                        currentBound[name] = 0; 
                    }
                } else {
                    tryCost += amount * (prices[name] || 0);
                }
            }
        };

        calcItemCost(needed.stone, stoneName);
        calcItemCost(needed.leap, "위대한 운명의 돌파석");
        calcItemCost(needed.fusion, "상급 아비도스 융화 재료");
        calcItemCost(needed.shard, "운명의 파편");
        calcItemCost(needed.breath, breathName);

        tryCost += needed.gold;

        const addToMats = (targetObj, scale = 1) => {
            if (isWeapon) targetObj.weaponStone += needed.stone * scale;
            else targetObj.armorStone += needed.stone * scale;
            
            targetObj.leap += needed.leap * scale;
            targetObj.fusion += needed.fusion * scale;
            targetObj.shard += needed.shard * scale;
            targetObj.gold += needed.gold * scale;
            targetObj.breath += needed.breath * scale;
        };

        addToMats(accMats, 1);
        if (!isJangGiBaek) addToMats(expMats, cumulativeFailProb);

        const currentFailBonus = Math.min(tryCount - 1, 10) * (baseProb / 10);
        const breathBonus = shouldUseBreath ? baseProb : 0; 
        
        let successRate = baseProb + currentFailBonus + breathBonus + initialProbBonus;
        if (isJangGiBaek) successRate = 100;

        totalCostAccumulated += tryCost;
        if (!isJangGiBaek) expectedCost += tryCost * cumulativeFailProb;

        tableRows.push({
            try: tryCount,
            method: isJangGiBaek ? "노숨(장기백)" : (shouldUseBreath ? "풀숨" : "노숨"),
            successRate: Math.min(successRate, 100).toFixed(2),
            artisan: Math.min(currentArtisanPercent, 100).toFixed(2),
            cost: tryCost.toLocaleString(undefined, {maximumFractionDigits: 0}),
            accCost: totalCostAccumulated.toLocaleString(undefined, {maximumFractionDigits: 0})
        });

        if (successRate >= 100) break;

        let artisanGain = successRate * 0.465;
        artisanGain = Math.round(artisanGain * 100) / 100;
        currentArtisanPercent += artisanGain;
        cumulativeFailProb *= (1 - (successRate / 100));
    }

    return {
        avgCost: Math.floor(expectedCost),
        artisanCost: Math.floor(totalCostAccumulated),
        avgMats: expMats, artisanMats: accMats, rows: tableRows, mixedLimit: mixedLimit
    };
  };

  const runOptimization = () => {
    setResultTab('optimal'); 
    
    let tasks = [];

    if (equipTab === 'simple') {
        // 간편: 목표 단계 1개. (Start = Target - 1)
        const start = simpleTargetLevel - 1;
        tasks.push({
            name: simpleEquipmentType,
            type: simpleEquipmentType, 
            start: start,
            end: simpleTargetLevel,
            count: 1
        });
    } else {
        Object.entries(detailSettings).forEach(([key, setting]) => {
            if (setting.active) {
                if (setting.start < setting.end) {
                    tasks.push({
                        name: setting.name, 
                        type: setting.type, 
                        start: setting.start,
                        end: setting.end,
                        count: 1
                    });
                }
            }
        });
        if (tasks.length === 0) { alert("활성화된 부위가 없거나 목표 단계가 낮습니다."); return; }
    }

    let totalSteps = 0;
    tasks.forEach(t => totalSteps += (t.end - t.start));

    function initMats() { return { weaponStone: 0, armorStone: 0, leap: 0, fusion: 0, shard: 0, gold: 0, breath: 0 }; }

    let batchResult = {
        optimal: { avgCost: 0, artisanCost: 0, avgMats: initMats(), artisanMats: initMats(), summaryRows: [] },
        no:      { avgCost: 0, artisanCost: 0, avgMats: initMats(), artisanMats: initMats(), summaryRows: [] },
        full:    { avgCost: 0, artisanCost: 0, avgMats: initMats(), artisanMats: initMats(), summaryRows: [] },
        isBatch: totalSteps > 1 
    };

    let boundState = {
        optimal: { ...boundItems },
        no: { ...boundItems },
        full: { ...boundItems }
    };

    let isFirstStepProcessed = false;

    tasks.forEach(task => {
        // ★ loop: start+1 부터 end 까지.
        // 예: Start 11, End 12 -> loop 12. (12강 트라이)
        // 예: Start 11, End 13 -> loop 12, 13.
        for (let lvl = task.start + 1; lvl <= task.end; lvl++) {
            
            const useUserInput = (equipTab === 'simple') && !isFirstStepProcessed;
            const probBonus = useUserInput ? addedProb : 0;
            const artisanStart = useUserInput ? currentArtisan : 0;
            isFirstStepProcessed = true;

            const noRes = simulateOneStep(lvl, task.type, 0, boundState.no, probBonus, artisanStart);
            const fullRes = simulateOneStep(lvl, task.type, 100, boundState.full, probBonus, artisanStart);
            
            let bestRes = null;
            let bestLimit = 0;
            let bestCost = Infinity;

            for (let limit = 0; limit <= 50; limit++) { 
                let tempBound = { ...boundState.optimal }; 
                const res = simulateOneStep(lvl, task.type, limit, tempBound, probBonus, artisanStart);
                if (res.avgCost < bestCost) {
                    bestCost = res.avgCost;
                    bestRes = res;
                    bestLimit = limit;
                }
            }
            bestRes = simulateOneStep(lvl, task.type, bestLimit, boundState.optimal, probBonus, artisanStart);

            const addToTotal = (target, source, label, limit, count) => {
                target.avgCost += source.avgCost * count;
                target.artisanCost += source.artisanCost * count;
                ['weaponStone', 'armorStone', 'leap', 'fusion', 'shard', 'gold', 'breath'].forEach(key => {
                    target.avgMats[key] += source.avgMats[key] * count;
                    target.artisanMats[key] += source.artisanMats[key] * count;
                });
                target.summaryRows.push({
                    desc: `${task.name} ${lvl-1}→${lvl}`, // 표시: 11->12
                    strategy: label,
                    limit: limit,
                    avgCost: source.avgCost,
                    artisanCost: source.artisanCost,
                    detail: source.rows 
                });
            };

            const strategyName = bestLimit === 0 ? "노숨" : (bestLimit >= 50 ? "풀숨" : `혼합(${bestLimit}트)`);
            addToTotal(batchResult.optimal, bestRes, strategyName, bestLimit, task.count);
            addToTotal(batchResult.no, noRes, "노숨", 0, task.count);
            addToTotal(batchResult.full, fullRes, "풀숨", 100, task.count);
        }
    });

    setCalcResult(batchResult);
  };

  const MaterialDisplay = ({ mats }) => {
      const displayOrder = [
          { key: 'weaponStone', name: "운명의 파괴석 결정" },
          { key: 'armorStone', name: "운명의 수호석 결정" },
          { key: 'leap', name: "위대한 운명의 돌파석" },
          { key: 'fusion', name: "상급 아비도스 융화 재료" },
          { key: 'shard', name: "운명의 파편" },
          { key: 'gold', name: "골드" },
          { key: 'breath', name: "숨결" }, 
      ];

      return (
          <div className="flex flex-wrap gap-4 mt-2">
              {displayOrder.map(item => {
                  const amount = mats[item.key] || 0;
                  if (amount <= 0) return null;
                  
                  let displayIconName = item.name;
                  if (item.key === 'breath') displayIconName = "용암의 숨결"; // 아이콘용

                  return (
                      <div key={item.key} className="flex items-center text-xs">
                          <div className="mr-1">
                             <ItemIcon info={itemInfos[displayIconName]} name={displayIconName} />
                          </div>
                          <span className="font-bold text-gray-700">
                              x {amount.toLocaleString(undefined, {maximumFractionDigits: 1})}
                          </span>
                      </div>
                  );
              })}
          </div>
      );
  };

  const renderPreviewMaterials = () => {
      // ★ 여러 부위 강화 탭일 때 비활성화
      if (equipTab === 'detail') {
          return (
              <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded border border-gray-200">
                  여러 부위 강화를<br/>선택하셨습니다
              </div>
          );
      }

      // 간편 모드: 목표 단계 1회 비용 (즉, Target 레벨의 트라이 비용)
      const currentLevel = simpleTargetLevel; // 단순 목표 레벨 기준 데이터
      // 데이터는 해당 레벨로 가는 비용이므로 key = simpleTargetLevel
      const req = REFINE_DATA[simpleEquipmentType]?.[currentLevel] || { gold: 0 };
      const breath = getBreathCount(currentLevel);
      
      const stoneName = simpleEquipmentType === '무기' ? "운명의 파괴석 결정" : "운명의 수호석 결정";
      const breathName = simpleEquipmentType === '무기' ? "용암의 숨결" : "빙하의 숨결";

      const items = [
          { key: 'stone', name: stoneName, count: req.stone },
          { key: 'leap', name: "위대한 운명의 돌파석", count: req.leap },
          { key: 'fusion', name: "상급 아비도스 융화 재료", count: req.fusion },
          { key: 'shard', name: "운명의 파편", count: req.shard },
          { key: 'breath', name: breathName, count: breath },
      ];

      return (
          <div className="space-y-2">
              {items.map(item => {
                  if (!item.count || item.count <= 0) return null;
                  let cost = item.count * (prices[item.name] || 0);
                  if (isBoundMaterialFree) {
                      let have = boundItems[item.name] || 0;
                      cost = Math.max(0, item.count - have) * (prices[item.name] || 0);
                  }
                  return (
                      <div key={item.key} className="flex justify-between items-center text-xs">
                          <div className="flex items-center">
                              <ItemIcon info={itemInfos[item.name]} name={item.name} />
                              <span>x {item.count.toLocaleString()}</span>
                          </div>
                          <span className={`text-gray-500 ${cost < (item.count * (prices[item.name]||0)) ? 'text-blue-600 font-bold' : ''}`}>
                             {cost.toLocaleString(undefined, {maximumFractionDigits: 0})} G
                          </span>
                      </div>
                  )
              })}
               <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <ItemIcon info={null} name="골드" />
                  <span>x {req.gold.toLocaleString()}</span>
                </div>
                <span className="text-gray-500">{req.gold.toLocaleString()} G</span>
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans text-sm">
      <header className="mb-4 border-b pb-2 flex justify-between items-center">
        <h1 className="text-xl font-bold">세르카 장비 재련 효율 계산기</h1>
        <button 
          onClick={fetchMarketPrices}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold transition flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? "로딩 중..." : "🔄 최신 시세 & 아이콘 불러오기"}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-4">
        
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

        <div className="w-full lg:w-1/5 space-y-4">
          <div className="bg-white p-4 rounded shadow border">
            <h2 className="font-bold text-gray-700 mb-4 border-b pb-2">장비 정보</h2>
            
            <div className="flex mb-4 bg-gray-100 rounded p-1">
                <button 
                    className={`flex-1 py-1 rounded text-xs font-bold transition ${equipTab === 'simple' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setEquipTab('simple')}
                >
                    간편 설정
                </button>
                <button 
                    className={`flex-1 py-1 rounded text-xs font-bold transition ${equipTab === 'detail' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setEquipTab('detail')}
                >
                    여러 부위 강화
                </button>
            </div>

            {equipTab === 'simple' ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">장비 종류</label>
                        <select className="w-full border rounded p-2" value={simpleEquipmentType} onChange={(e) => setSimpleEquipmentType(e.target.value)}>
                        <option value="방어구">방어구 (T4)</option>
                        <option value="무기">무기 (T4)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-500 text-xs mb-1">목표 단계</label>
                        <select className="w-full border rounded p-2" value={simpleTargetLevel} onChange={(e) => setSimpleTargetLevel(Number(e.target.value))}>
                        {[...Array(14)].map((_, i) => {
                            const level = i + 12;
                            if (level > 25) return null;
                            return <option key={level} value={level}>{level}단계</option>
                        })}
                        </select>
                    </div>
                    
                   {/* 확률 정보 입력 (동적 스텝 및 % 디자인 적용) */}
            <div className="space-y-2 pt-2 border-t mt-2">
                {/* 렌더링 시점에 기본 확률과 스텝 계산 */}
                {(() => {
                    // 현재 목표 단계의 직전 단계 확률 (즉, 트라이할 단계의 확률)
                    const baseProb = BASE_PROBABILITIES[simpleTargetLevel] || 0;
                    // 1틱당 변화량 = 기본확률 / 10 (예: 5% -> 0.5, 1.5% -> 0.15)
                    const stepValue = baseProb / 10; 

                    return (
                        <>
                            <div>
                                <label className="block text-gray-500 text-xs mb-1">기본 확률</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full border rounded p-2 text-right bg-gray-100 text-gray-600 pr-8" 
                                        value={`${baseProb}`} 
                                        readOnly
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-xs select-none">%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs mb-1">실패로 추가된 확률</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full border rounded p-2 text-right pr-8" 
                                        value={addedProb} 
                                        step={stepValue} // ★ 핵심: 동적 스텝 적용
                                        onChange={(e) => {
                                            let val = parseFloat(e.target.value);
                                            if (isNaN(val) || val < 0) val = 0;
                                            
                                            // 최대치 제한 (기본 확률까지만)
                                            if (val > baseProb) val = baseProb;
                                            
                                            // 소수점 자릿수 처리 (부동소수점 오차 방지)
                                            // stepValue의 소수점 자릿수만큼만 유지
                                            const decimals = (stepValue.toString().split('.')[1] || []).length;
                                            val = parseFloat(val.toFixed(decimals));

                                            setAddedProb(val);
                                        }}
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-xs select-none">%</span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-right mt-1">
                                    * 최대 {baseProb}%까지 (1회 실패당 +{stepValue}%)
                                </p>
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs mb-1">현재 장기백</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full border rounded p-2 text-right pr-8" 
                                        value={currentArtisan} 
                                        onChange={(e) => {
                                            let val = parseFloat(e.target.value);
                                            if (isNaN(val) || val < 0) val = 0;
                                            if (val > 100) val = 100; // 100% 초과 금지
                                            setCurrentArtisan(val);
                                        }}
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-xs select-none">%</span>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>
                </div>
            ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {Object.entries(detailSettings).map(([key, setting]) => (
                        <div key={key} className={`flex items-center gap-1 p-2 rounded border ${setting.active ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'}`}>
                            <input 
                                type="checkbox" 
                                checked={setting.active} 
                                onChange={(e) => handleDetailChange(key, 'active', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className={`text-xs font-bold w-8 ${setting.active ? 'text-gray-800' : 'text-gray-400'}`}>{setting.name}</span>
                            
                            <select 
                                className="w-14 text-xs border rounded p-1" 
                                value={setting.start} 
                                disabled={!setting.active}
                                onChange={(e) => handleDetailChange(key, 'start', Number(e.target.value))}
                            >
                                {[...Array(14)].map((_, i) => {
                                    const lvl = i + 11;
                                    if (lvl > 24) return null;
                                    return <option key={lvl} value={lvl}>{lvl}</option>
                                })}
                            </select>
                            <span className="text-gray-400">→</span>
                            <select 
                                className="w-14 text-xs border rounded p-1" 
                                value={setting.end} 
                                disabled={!setting.active}
                                onChange={(e) => handleDetailChange(key, 'end', Number(e.target.value))}
                            >
                                {[...Array(14)].map((_, i) => {
                                    const lvl = i + 12;
                                    if (lvl <= setting.start) return null;
                                    return <option key={lvl} value={lvl}>{lvl}</option>
                                })}
                            </select>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow border">
            <h2 className="font-bold text-gray-700 mb-2 border-b pb-2">1회 필수 재료</h2>
            {renderPreviewMaterials()}

            <div className="mt-3 pt-3 border-t">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        checked={isBoundMaterialFree} 
                        onChange={(e) => setIsBoundMaterialFree(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-xs font-bold text-gray-700">귀속 재료 사용 (보유량 차감)</span>
                </label>
            </div>

            <button onClick={runOptimization} className="w-full bg-indigo-600 text-white py-3 rounded mt-4 hover:bg-indigo-700 font-bold shadow-md">
              최적화 계산하기
            </button>
          </div>
        </div>

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
                        🏆 추천 최적
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
                        {resultTab === 'optimal' && calcResult.isBatch && (
                            <div className="bg-indigo-50 p-4 rounded border border-indigo-200 mb-4">
                                <h3 className="font-bold text-indigo-900 text-lg mb-1">
                                    💡 자동 최적화 완료
                                </h3>
                                <p className="text-sm text-indigo-700">
                                    구간별 최적 전략을 자동 계산했습니다.
                                </p>
                            </div>
                        )}
                        {resultTab === 'optimal' && !calcResult.isBatch && (
                             <div className="bg-indigo-50 p-4 rounded border border-indigo-200 mb-4">
                                <h3 className="font-bold text-indigo-900 text-lg mb-1">
                                    💡 최적 전략: {calcResult.optimal.summaryRows[0]?.strategy}
                                </h3>
                                <p className="text-sm text-indigo-700">
                                    평균적으로 가장 저렴한 방식입니다.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4 mb-4">
                            <div className="p-4 bg-white rounded border w-full shadow-sm">
                                <div className="flex justify-between items-end mb-3 border-b pb-2">
                                    <h3 className="font-bold text-lg text-gray-700">평균 소모 재료 (기댓값)</h3>
                                    <span className="text-2xl font-bold text-indigo-600">{calcResult[resultTab].avgCost.toLocaleString()} G</span>
                                </div>
                                <MaterialDisplay mats={calcResult[resultTab].avgMats} />
                            </div>
                            
                            <div className="p-4 bg-white rounded border w-full shadow-sm border-red-100">
                                <div className="flex justify-between items-end mb-3 border-b border-red-100 pb-2">
                                    <h3 className="font-bold text-lg text-red-900">장기백 소모 재료 (100%)</h3>
                                    <span className="text-2xl font-bold text-red-600">{calcResult[resultTab].artisanCost.toLocaleString()} G</span>
                                </div>
                                <MaterialDisplay mats={calcResult[resultTab].artisanMats} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto border rounded relative">
                        <table className="w-full text-center text-sm">
                            <thead className="bg-gray-100 sticky top-0 text-gray-600 font-semibold z-10 shadow-sm">
                                {calcResult.isBatch ? (
                                    <tr>
                                        <th className="p-3">구간</th>
                                        <th className="p-3">적용 전략</th>
                                        <th className="p-3">예상 비용 (평균)</th>
                                        <th className="p-3">장기백 비용</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="p-3">트라이</th>
                                        <th className="p-3">방식</th>
                                        <th className="p-3">성공 확률</th>
                                        <th className="p-3">장인의 기운</th>
                                        <th className="p-3">비용</th>
                                        <th className="p-3">누적 비용</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y">
                                {calcResult.isBatch ? (
                                    calcResult[resultTab].summaryRows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 cursor-pointer" onClick={() => !calcResult.isBatch && alert("상세 정보")}>
                                            <td className="p-3 font-bold">{row.desc}</td>
                                            <td className="p-3 text-blue-600 font-bold">{row.strategy}</td>
                                            <td className="p-3">{row.avgCost.toLocaleString()} G</td>
                                            <td className="p-3 text-red-500">{row.artisanCost.toLocaleString()} G</td>
                                        </tr>
                                    ))
                                ) : (
                                    calcResult[resultTab].summaryRows[0]?.detail.map((row) => (
                                        <tr key={row.try} className={`hover:bg-gray-50 ${parseFloat(row.successRate) >= 100 ? 'bg-green-50' : ''}`}>
                                            <td className="p-2">{row.try}트</td>
                                            <td className={`p-2 font-bold ${row.method.includes('풀숨') ? 'text-blue-600' : 'text-gray-500'}`}>{row.method}</td>
                                            <td className="p-2 font-bold text-gray-700">{row.successRate}%</td>
                                            <td className="p-2 text-gray-500">{row.artisan}%</td>
                                            <td className="p-2">{row.cost} G</td>
                                            <td className="p-2 text-gray-500">{row.accCost} G</td>
                                        </tr>
                                    ))
                                )}
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