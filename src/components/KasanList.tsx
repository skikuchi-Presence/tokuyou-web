import { useState } from "react";
import type { Addition, Category, FacilityCondition } from "../data/kasanData";

// 難易度に応じたバッジスタイル
function difficultyClass(d: string) {
  switch (d) {
    case "低": return "bg-green-100 text-green-800";
    case "中": return "bg-yellow-100 text-yellow-800";
    case "高": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

// 詳細モーダル
function DetailDialog({
  addition,
  category,
  condition,
  onClose,
}: {
  addition: Addition;
  category?: Category;
  condition: FacilityCondition;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">{addition.name}</h3>
          <p className="text-sm text-slate-600 mt-1">
            {category?.name} | 難易度：{addition.difficulty}
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">算定単位</h4>
            <p className="text-slate-700">
              {addition.units}単位 / {addition.period}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">算定要件</h4>
            <p className="text-slate-700">{addition.requirement}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2">月間概算収益</h4>
            <div className="text-3xl font-bold text-green-600 mb-2">
              ¥{(addition.monthly_revenue / 10000).toFixed(1)}万
            </div>
            <p className="text-sm text-slate-600">
              計算根拠：{addition.units}単位 × {condition.type.unit_price_per_unit}円 × {condition.beds}床 × {condition.type.occupancy_rate}（稼働率）
            </p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KasanList({
  additions,
  categories,
  condition,
}: {
  additions: Addition[];
  categories: Category[];
  condition: FacilityCondition;
}) {
  const [selectedAddition, setSelectedAddition] = useState<Addition | null>(null);

  const getCategory = (categoryId: string) =>
    categories.find((c) => c.id === categoryId);

  return (
    <>
      <div className="space-y-4">
        {additions.map((addition) => {
          const cat = getCategory(addition.category);
          return (
            <div
              key={addition.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{cat?.icon}</span>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {addition.name}
                      </h3>
                      {addition.is_new_2024 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                          2024年新設
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {addition.requirement}
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700">
                        {addition.units}単位 / {addition.period}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyClass(addition.difficulty)}`}
                      >
                        難易度：{addition.difficulty}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {cat?.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right min-w-max">
                    <div className="text-xs text-slate-600 mb-1">月間概算収益</div>
                    <div className="text-2xl font-bold text-green-600">
                      ¥{(addition.monthly_revenue / 10000).toFixed(1)}万
                    </div>
                    <button
                      onClick={() => setSelectedAddition(addition)}
                      className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium border border-slate-300 rounded-md text-slate-700 bg-white hover:bg-slate-50"
                    >
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAddition && (
        <DetailDialog
          addition={selectedAddition}
          category={getCategory(selectedAddition.category)}
          condition={condition}
          onClose={() => setSelectedAddition(null)}
        />
      )}
    </>
  );
}
