import type { Addition, Category } from "../data/kasanData";

export default function CategoryView({
  categories,
  additions,
}: {
  categories: Category[];
  additions: Addition[];
}) {
  const getAdditions = (categoryId: string) =>
    additions.filter((a) => a.category === categoryId);

  const getCategoryRevenue = (categoryId: string) =>
    getAdditions(categoryId).reduce((sum, a) => sum + a.monthly_revenue, 0);

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const catAdditions = getAdditions(category.id);
        if (catAdditions.length === 0) return null;
        const totalRevenue = getCategoryRevenue(category.id);

        return (
          <div
            key={category.id}
            className="bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            {/* カテゴリーヘッダー */}
            <div
              className="p-6 border-b border-slate-200"
              style={{ borderLeft: `4px solid ${category.color}` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {catAdditions.length}項目
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-600">カテゴリー合計</div>
                  <div className="text-2xl font-bold text-green-600">
                    ¥{(totalRevenue / 10000).toFixed(1)}万
                  </div>
                </div>
              </div>
            </div>

            {/* 加算リスト */}
            <div className="p-6">
              <div className="space-y-3">
                {catAdditions.map((addition) => (
                  <div
                    key={addition.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">
                          {addition.name}
                        </span>
                        {addition.is_new_2024 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                            新設
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        {addition.units}単位 / {addition.period}
                      </p>
                    </div>
                    <div className="text-right min-w-max ml-4">
                      <div className="text-sm font-semibold text-green-600">
                        ¥{(addition.monthly_revenue / 10000).toFixed(1)}万
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
