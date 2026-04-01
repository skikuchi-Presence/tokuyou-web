import { useState, useMemo } from "react";
import type { Addition } from "../data/kasanData";
import { recommendedAdditionIds } from "../data/kasanData";

export default function SimulationCalculator({
  additions,
}: {
  additions: Addition[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectRecommended = () => {
    const valid = recommendedAdditionIds.filter((id) =>
      additions.some((a) => a.id === id)
    );
    setSelectedIds(valid);
  };

  const clearAll = () => setSelectedIds([]);

  const selectedAdditions = useMemo(
    () => additions.filter((a) => selectedIds.includes(a.id)),
    [selectedIds, additions]
  );

  const monthlyTotal = useMemo(
    () => selectedAdditions.reduce((sum, a) => sum + a.monthly_revenue, 0),
    [selectedAdditions]
  );

  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="space-y-6">
      {/* 設定カード */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            シミュレーション設定
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <button
              onClick={selectRecommended}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              推奨加算を選択
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md bg-white hover:bg-slate-50"
            >
              すべてクリア
            </button>
          </div>
          <p className="text-sm text-slate-600">
            推奨加算：{recommendedAdditionIds.length}
            項目（現実的に取得可能な加算を厳選）
          </p>
        </div>
      </div>

      {/* 加算選択カード */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">
            加算を選択してください
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            選択中：{selectedIds.length}項目
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {additions.map((a) => (
              <div
                key={a.id}
                className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  id={a.id}
                  checked={selectedIds.includes(a.id)}
                  onChange={() => toggle(a.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={a.id} className="flex-1 cursor-pointer">
                  <div className="font-medium text-slate-900">{a.name}</div>
                  <div className="text-xs text-slate-600">
                    {a.units}単位 / {a.period}
                  </div>
                </label>
                <div className="text-sm font-semibold text-green-600 min-w-max">
                  ¥{(a.monthly_revenue / 10000).toFixed(1)}万
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 結果カード */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
        <div className="p-6 border-b border-green-200">
          <h3 className="text-lg font-semibold text-green-900">
            シミュレーション結果
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-green-700 mb-2">月間加算収益</p>
              <div className="text-4xl font-bold text-green-600">
                ¥{(monthlyTotal / 10000).toFixed(1)}万
              </div>
              <p className="text-xs text-green-600 mt-2">
                {selectedIds.length}項目の合計
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700 mb-2">年間加算収益</p>
              <div className="text-4xl font-bold text-green-600">
                ¥{(yearlyTotal / 1000000).toFixed(2)}百万
              </div>
              <p className="text-xs text-green-600 mt-2">月間 × 12ヶ月</p>
            </div>
          </div>

          {selectedAdditions.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-slate-900 mb-3">
                選択加算一覧
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedAdditions.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-slate-700">{a.name}</span>
                    <span className="font-semibold text-green-600">
                      ¥{(a.monthly_revenue / 10000).toFixed(1)}万
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedIds.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>加算を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
