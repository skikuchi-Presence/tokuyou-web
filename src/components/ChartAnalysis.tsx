import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Addition, Category } from "../data/kasanData";

export default function ChartAnalysis({
  categories,
  additions,
}: {
  categories: Category[];
  additions: Addition[];
}) {
  // カテゴリー別加算数
  const categoryCountData = categories
    .map((c) => ({
      name: c.name,
      加算数: additions.filter((a) => a.category === c.id).length,
      icon: c.icon,
    }))
    .filter((d) => d.加算数 > 0);

  // カテゴリー別月間収益
  const categoryRevenueData = categories
    .map((c) => {
      const revenue = additions
        .filter((a) => a.category === c.id)
        .reduce((sum, a) => sum + a.monthly_revenue, 0);
      return {
        name: c.name,
        収益万円: Math.round((revenue / 10000) * 10) / 10,
        fill: c.color,
      };
    })
    .filter((d) => d.収益万円 > 0);

  // 難易度別
  const difficultyData = [
    {
      difficulty: "低",
      加算数: additions.filter((a) => a.difficulty === "低").length,
      収益万円:
        Math.round(
          (additions
            .filter((a) => a.difficulty === "低")
            .reduce((s, a) => s + a.monthly_revenue, 0) /
            10000) *
            10
        ) / 10,
    },
    {
      difficulty: "中",
      加算数: additions.filter((a) => a.difficulty === "中").length,
      収益万円:
        Math.round(
          (additions
            .filter((a) => a.difficulty === "中")
            .reduce((s, a) => s + a.monthly_revenue, 0) /
            10000) *
            10
        ) / 10,
    },
    {
      difficulty: "高",
      加算数: additions.filter((a) => a.difficulty === "高").length,
      収益万円:
        Math.round(
          (additions
            .filter((a) => a.difficulty === "高")
            .reduce((s, a) => s + a.monthly_revenue, 0) /
            10000) *
            10
        ) / 10,
    },
  ];

  // 月間収益TOP15
  const top15 = [...additions]
    .sort((a, b) => b.monthly_revenue - a.monthly_revenue)
    .slice(0, 15)
    .map((a) => ({
      name: a.name.length > 15 ? a.name.slice(0, 15) + "…" : a.name,
      収益万円: Math.round((a.monthly_revenue / 10000) * 10) / 10,
    }));

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-8">
      {/* カテゴリー別加算数 */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          カテゴリー別加算数
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryCountData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="加算数" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* カテゴリー別月間収益 */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          カテゴリー別月間収益
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryRevenueData} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value}万円`, "収益万円"]} />
            <Bar dataKey="収益万円" radius={[0, 4, 4, 0]}>
              {categoryRevenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 難易度別 */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          難易度別加算数と収益
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={difficultyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="difficulty" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="加算数" radius={[4, 4, 0, 0]}>
              {difficultyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Bar>
            <Bar yAxisId="right" dataKey="収益万円" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TOP15 */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          月間収益TOP15加算
        </h3>
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={top15} layout="vertical" margin={{ left: 140 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => [`${value}万円`, "収益万円"]} />
            <Bar dataKey="収益万円" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
