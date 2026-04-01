import { useState, useMemo } from "react";
import {
  categories,
  facilityTypes,
  getAdditionsForCondition,
  type FacilityType,
  type FacilityCondition,
} from "./data/kasanData";
import KasanList from "./components/KasanList";
import CategoryView from "./components/CategoryView";
import ChartAnalysis from "./components/ChartAnalysis";
import SimulationCalculator from "./components/SimulationCalculator";

type TabValue = "list" | "category" | "analysis" | "simulation";

const tabs: { value: TabValue; label: string }[] = [
  { value: "list", label: "📋 加算一覧" },
  { value: "category", label: "🗂️ カテゴリー別" },
  { value: "analysis", label: "📊 グラフ分析" },
  { value: "simulation", label: "💰 収益シミュレーション" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabValue>("list");

  // 施設種別
  const [facilityType, setFacilityType] = useState<FacilityType>(facilityTypes[0]);
  // 床数（ユーザー入力）
  const [beds, setBeds] = useState<number>(facilityTypes[0].beds);

  // 施設条件オブジェクト
  const condition: FacilityCondition = useMemo(
    () => ({ type: facilityType, beds }),
    [facilityType, beds]
  );

  // 施設条件に応じた加算データ（収益を再計算）
  const additions = useMemo(
    () => getAdditionsForCondition(condition),
    [condition]
  );

  // フィルター状態
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [newOnly, setNewOnly] = useState(false);

  // フィルタリングされた加算
  const filtered = useMemo(() => {
    return additions.filter((a) => {
      const matchKeyword =
        a.name.toLowerCase().includes(keyword.toLowerCase()) ||
        a.requirement.toLowerCase().includes(keyword.toLowerCase());
      const matchCategory = !selectedCategory || a.category === selectedCategory;
      const matchDifficulty = !selectedDifficulty || a.difficulty === selectedDifficulty;
      const matchNew = !newOnly || a.is_new_2024;
      return matchKeyword && matchCategory && matchDifficulty && matchNew;
    });
  }, [additions, keyword, selectedCategory, selectedDifficulty, newOnly]);

  const totalRevenue = useMemo(
    () => filtered.reduce((sum, a) => sum + a.monthly_revenue, 0),
    [filtered]
  );

  // 施設種別変更時、床数もデフォルト値にリセット
  const handleFacilityTypeChange = (id: string) => {
    const found = facilityTypes.find((f) => f.id === id);
    if (found) {
      setFacilityType(found);
      setBeds(found.beds);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                特養 加算提案・収益シミュレーター
              </h1>
              <p className="text-slate-600 mt-1">
                2024年度介護報酬改定版
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* 施設種別セレクト */}
              <div>
                <label className="text-xs text-slate-500 block mb-1">施設種別</label>
                <select
                  value={facilityType.id}
                  onChange={(e) => handleFacilityTypeChange(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {facilityTypes.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* 床数入力 */}
              <div>
                <label className="text-xs text-slate-500 block mb-1">床数</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={beds}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v > 0) setBeds(v);
                    }}
                    className="w-20 px-3 py-2 border border-slate-300 rounded-md text-sm font-bold text-blue-600 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-bold text-blue-600">床</span>
                </div>
              </div>
              {/* 施設情報サマリ */}
              <div className="text-right border-l border-slate-200 pl-4">
                <div className="text-sm text-slate-600">
                  全加算数：{additions.length}項目
                </div>
                <div className="text-xs text-slate-500">
                  1単位 {facilityType.unit_price_per_unit}円
                </div>
                <div className="text-xs text-slate-500">
                  稼働率 {(facilityType.occupancy_rate * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {/* タブ */}
        <div className="grid w-full grid-cols-4 mb-8 bg-slate-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 加算一覧タブ */}
        {activeTab === "list" && (
          <div className="space-y-6">
            {/* 検索・フィルターカード */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  加算検索・フィルター
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  条件を指定して加算を検索します。複数の条件を組み合わせることができます。
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    キーワード検索
                  </label>
                  <input
                    type="text"
                    placeholder="加算名や要件で検索..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      カテゴリー
                    </label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value || null)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="">すべて</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      難易度
                    </label>
                    <select
                      value={selectedDifficulty || ""}
                      onChange={(e) =>
                        setSelectedDifficulty(e.target.value || null)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    >
                      <option value="">すべて</option>
                      <option value="低">低</option>
                      <option value="中">中</option>
                      <option value="高">高</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="newOnly"
                    checked={newOnly}
                    onChange={(e) => setNewOnly(e.target.checked)}
                    className="rounded"
                  />
                  <label
                    htmlFor="newOnly"
                    className="text-sm font-medium text-slate-700"
                  >
                    2024年度新設・変更加算のみ表示
                  </label>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold">{filtered.length}</span>{" "}
                    件の加算が該当
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-600">月間加算収益合計</div>
                    <div className="text-2xl font-bold text-green-600">
                      ¥{(totalRevenue / 10000).toFixed(1)}万
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 加算リスト */}
            <KasanList additions={filtered} categories={categories} condition={condition} />
          </div>
        )}

        {/* カテゴリー別タブ */}
        {activeTab === "category" && (
          <CategoryView categories={categories} additions={additions} />
        )}

        {/* グラフ分析タブ */}
        {activeTab === "analysis" && (
          <ChartAnalysis categories={categories} additions={additions} />
        )}

        {/* 収益シミュレーションタブ */}
        {activeTab === "simulation" && (
          <SimulationCalculator additions={additions} />
        )}
      </main>

      {/* フッター */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-3">
                このサイトについて
              </h3>
              <p className="text-sm">
                特別養護老人ホームが算定できる全加算を網羅したシミュレーターです。施設種別・床数を指定して収益を比較できます。2024年度介護報酬改定に対応しています。
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">注意事項</h3>
              <ul className="text-sm space-y-1">
                <li>• 本シミュレーターは参考値です</li>
                <li>• 実際の算定は厚労省通知に従ってください</li>
                <li>• 地域区分により単価が異なります</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">参考資料</h3>
              <ul className="text-sm space-y-1">
                <li>• 厚生労働省 介護報酬改定</li>
                <li>• 介護報酬算定構造</li>
                <li>• 2024年度改定通知</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
            © 2024 特養 加算提案・収益シミュレーター
          </div>
        </div>
      </footer>
    </div>
  );
}
