// カテゴリー定義
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// 加算データ型
export interface Addition {
  id: string;
  name: string;
  category: string;
  units: number;
  period: string;
  requirement: string;
  difficulty: "低" | "中" | "高";
  is_new_2024: boolean;
  monthly_revenue: number;
}

// 施設種別の型定義
export interface FacilityType {
  id: string;
  name: string;
  beds: number;
  unit_price_per_unit: number;
  occupancy_rate: number;
}

// 施設種別の選択肢
export const facilityTypes: FacilityType[] = [
  { id: "chiiki_unit", name: "地域密着型特養（ユニット型）", beds: 29, unit_price_per_unit: 11.40, occupancy_rate: 0.97 },
  { id: "tokuyou_unit", name: "特養（ユニット型）", beds: 60, unit_price_per_unit: 10.90, occupancy_rate: 0.97 },
  { id: "tokuyou_kojitsu", name: "特養（従来型個室）", beds: 50, unit_price_per_unit: 10.90, occupancy_rate: 0.97 },
  { id: "tokuyou_tasyou", name: "特養（多床室）", beds: 80, unit_price_per_unit: 10.90, occupancy_rate: 0.97 },
  { id: "rouken", name: "介護老人保健施設（老健）", beds: 100, unit_price_per_unit: 10.48, occupancy_rate: 0.90 },
  { id: "group_home", name: "グループホーム（認知症対応型）", beds: 18, unit_price_per_unit: 11.05, occupancy_rate: 0.95 },
];

// デフォルト施設（基準値：収益計算の元データ）
export const baseFacility = facilityTypes[0];

// 施設情報（後方互換用）
export const facilityInfo = {
  facility_type: baseFacility.name,
  beds: baseFacility.beds,
  unit_price_per_unit: baseFacility.unit_price_per_unit,
  unit_price_note: `1単位=${baseFacility.unit_price_per_unit.toFixed(2)}円（地域区分：その他地域の場合）`,
  base_rate_average: 828,
  occupancy_rate: baseFacility.occupancy_rate,
  avg_care_level: 3.8,
};

// 施設条件（施設種別 + ユーザーが入力した床数）
export interface FacilityCondition {
  type: FacilityType;
  beds: number; // ユーザーが自由に入力した床数
}

// 施設条件に応じて加算の月間収益を再計算する関数
// 元データは baseFacility（29床, 11.40円, 0.97）基準
export function recalcRevenue(addition: Addition, condition: FacilityCondition): number {
  const baseValue = baseFacility.beds * baseFacility.unit_price_per_unit * baseFacility.occupancy_rate;
  const newValue = condition.beds * condition.type.unit_price_per_unit * condition.type.occupancy_rate;
  return addition.monthly_revenue * (newValue / baseValue);
}

// 全加算の収益を施設条件に合わせて再計算した配列を返す
export function getAdditionsForCondition(condition: FacilityCondition): Addition[] {
  return additions.map((a) => ({
    ...a,
    monthly_revenue: recalcRevenue(a, condition),
  }));
}

// カテゴリー一覧
export const categories: Category[] = [
  { id: "medical", name: "医療連携・医師関連", color: "#e74c3c", icon: "🏥" },
  { id: "nursing", name: "看護・夜間体制", color: "#3498db", icon: "💉" },
  { id: "rehabilitation", name: "リハビリ・機能訓練", color: "#2ecc71", icon: "🦾" },
  { id: "nutrition", name: "栄養管理", color: "#f39c12", icon: "🍽️" },
  { id: "oral", name: "口腔管理", color: "#9b59b6", icon: "🦷" },
  { id: "dementia", name: "認知症ケア", color: "#1abc9c", icon: "🧠" },
  { id: "life_science", name: "科学的介護（LIFE）", color: "#3498db", icon: "📊" },
  { id: "adl_support", name: "ADL維持・自立支援", color: "#2ecc71", icon: "🚶" },
  { id: "safety", name: "安全・感染対策", color: "#e74c3c", icon: "🛡️" },
  { id: "end_of_life", name: "看取り・終末期ケア", color: "#95a5a6", icon: "💝" },
  { id: "employment", name: "処遇改善・生産性", color: "#f39c12", icon: "💼" },
  { id: "other", name: "その他", color: "#34495e", icon: "📋" },
  { id: "deduction", name: "減算", color: "#c0392b", icon: "📉" },
];

// 加算データ一覧
export const additions: Addition[] = [
  { id: "adl_1", name: "ADL維持等加算（Ⅰ）", category: "adl_support", units: 30, period: "月", requirement: "自立支援促進加算と同時算定不可", difficulty: "中", is_new_2024: false, monthly_revenue: 9620.46 },
  { id: "adl_2", name: "ADL維持等加算（Ⅱ）", category: "adl_support", units: 60, period: "月", requirement: "自立支援促進加算と同時算定不可", difficulty: "高", is_new_2024: false, monthly_revenue: 19240.92 },
  { id: "safety_1", name: "安全対策体制加算", category: "safety", units: 20, period: "回（入所時1回）", requirement: "入所時に1回限度", difficulty: "低", is_new_2024: false, monthly_revenue: 534.47 },
  { id: "nutrition_1", name: "栄養マネジメント強化加算", category: "nutrition", units: 11, period: "日", requirement: "栄養ケア計画の作成", difficulty: "中", is_new_2024: false, monthly_revenue: 105825.06 },
  { id: "nursing_1a", name: "看護体制加算（Ⅰイロ）", category: "nursing", units: 12, period: "日", requirement: "常勤看護職員の配置", difficulty: "中", is_new_2024: false, monthly_revenue: 115445.52 },
  { id: "nursing_1b", name: "看護体制加算（Ⅰハニ）", category: "nursing", units: 4, period: "日", requirement: "常勤看護職員の配置（非常勤）", difficulty: "低", is_new_2024: false, monthly_revenue: 38481.84 },
  { id: "nursing_2a", name: "看護体制加算（Ⅱイロ）", category: "nursing", units: 23, period: "日", requirement: "常勤看護職員の配置", difficulty: "高", is_new_2024: false, monthly_revenue: 221270.58 },
  { id: "nursing_2b", name: "看護体制加算（Ⅱハニ）", category: "nursing", units: 8, period: "日", requirement: "常勤看護職員の配置（非常勤）", difficulty: "低", is_new_2024: false, monthly_revenue: 76963.68 },
  { id: "life_1", name: "科学的介護推進体制加算（Ⅰ）", category: "life_science", units: 40, period: "月", requirement: "LIFE提出", difficulty: "中", is_new_2024: false, monthly_revenue: 12827.28 },
  { id: "life_2", name: "科学的介護推進体制加算（Ⅱ）", category: "life_science", units: 50, period: "月", requirement: "LIFE提出＋分析実施", difficulty: "高", is_new_2024: false, monthly_revenue: 16034.1 },
  { id: "oral_1", name: "経口維持加算（Ⅰ）", category: "oral", units: 400, period: "月", requirement: "経口摂取継続", difficulty: "中", is_new_2024: false, monthly_revenue: 128272.8 },
  { id: "oral_2", name: "経口維持加算（Ⅱ）", category: "oral", units: 100, period: "月", requirement: "経口摂取継続", difficulty: "低", is_new_2024: false, monthly_revenue: 32068.2 },
  { id: "oral_3", name: "経口移行加算", category: "oral", units: 28, period: "日（180日以内）", requirement: "経口移行計画", difficulty: "中", is_new_2024: false, monthly_revenue: 9576 },
  { id: "oral_4", name: "口腔衛生管理加算（Ⅰ）", category: "oral", units: 90, period: "月", requirement: "口腔衛生管理計画", difficulty: "中", is_new_2024: false, monthly_revenue: 28861.38 },
  { id: "oral_5", name: "口腔衛生管理加算（Ⅱ）", category: "oral", units: 110, period: "月", requirement: "口腔衛生管理計画＋歯科医師連携", difficulty: "高", is_new_2024: false, monthly_revenue: 35275.02 },
  { id: "rehab_1", name: "個別機能訓練加算（Ⅰ）", category: "rehabilitation", units: 12, period: "日", requirement: "個別訓練計画", difficulty: "中", is_new_2024: false, monthly_revenue: 115445.52 },
  { id: "rehab_2", name: "個別機能訓練加算（Ⅱ）", category: "rehabilitation", units: 20, period: "月", requirement: "個別訓練計画", difficulty: "低", is_new_2024: false, monthly_revenue: 6413.64 },
  { id: "rehab_3", name: "個別機能訓練加算（Ⅲ）", category: "rehabilitation", units: 20, period: "月", requirement: "個別訓練計画＋栄養・口腔連携", difficulty: "高", is_new_2024: true, monthly_revenue: 6413.64 },
  { id: "service_1", name: "サービス提供体制強化加算（Ⅰ）", category: "nursing", units: 22, period: "日", requirement: "職員配置基準", difficulty: "中", is_new_2024: false, monthly_revenue: 211650.12 },
  { id: "service_2", name: "サービス提供体制強化加算（Ⅱ）", category: "nursing", units: 18, period: "日", requirement: "職員配置基準", difficulty: "中", is_new_2024: false, monthly_revenue: 173168.28 },
  { id: "service_3", name: "サービス提供体制強化加算（Ⅲ）", category: "nursing", units: 6, period: "日", requirement: "職員配置基準", difficulty: "低", is_new_2024: false, monthly_revenue: 57722.76 },
  { id: "adl_3", name: "自立支援促進加算", category: "adl_support", units: 280, period: "月", requirement: "自立支援促進計画", difficulty: "高", is_new_2024: true, monthly_revenue: 89790.96 },
  { id: "dementia_1", name: "若年性認知症利用者受入加算", category: "dementia", units: 120, period: "日", requirement: "若年性認知症利用者受け入れ", difficulty: "中", is_new_2024: false, monthly_revenue: 41040 },
  { id: "dementia_3", name: "認知症専門ケア加算（Ⅰ）", category: "dementia", units: 3, period: "日", requirement: "認知症専門ケア計画", difficulty: "中", is_new_2024: false, monthly_revenue: 1026 },
  { id: "dementia_4", name: "認知症専門ケア加算（Ⅱ）", category: "dementia", units: 4, period: "日", requirement: "認知症専門ケア計画＋研修", difficulty: "高", is_new_2024: false, monthly_revenue: 1368 },
  { id: "dementia_5", name: "認知症チームケア推進加算（Ⅰ）", category: "dementia", units: 150, period: "月", requirement: "認知症チームケア体制", difficulty: "高", is_new_2024: true, monthly_revenue: 48102.3 },
  { id: "dementia_6", name: "認知症チームケア推進加算（Ⅱ）", category: "dementia", units: 120, period: "月", requirement: "認知症チームケア体制", difficulty: "中", is_new_2024: true, monthly_revenue: 38481.84 },
  { id: "excretion_1", name: "排せつ支援加算（Ⅰ）", category: "adl_support", units: 10, period: "月", requirement: "排せつ支援計画", difficulty: "低", is_new_2024: false, monthly_revenue: 3206.82 },
  { id: "excretion_2", name: "排せつ支援加算（Ⅱ）", category: "adl_support", units: 15, period: "月", requirement: "排せつ支援計画＋連携", difficulty: "中", is_new_2024: false, monthly_revenue: 4810.23 },
  { id: "excretion_3", name: "排せつ支援加算（Ⅲ）", category: "adl_support", units: 20, period: "月", requirement: "排せつ支援計画＋医師連携", difficulty: "高", is_new_2024: false, monthly_revenue: 6413.64 },
  { id: "excretion_4", name: "排せつ支援加算（Ⅳ）", category: "adl_support", units: 100, period: "月（支援開始月から6月以内）", requirement: "排せつ支援計画＋医師連携", difficulty: "高", is_new_2024: true, monthly_revenue: 5344.7 },
  { id: "medical_3", name: "配置医師緊急時対応加算（早朝・夜間）", category: "medical", units: 650, period: "回", requirement: "配置医師による緊急対応", difficulty: "高", is_new_2024: true, monthly_revenue: 14820 },
  { id: "medical_4", name: "配置医師緊急時対応加算（深夜）", category: "medical", units: 1300, period: "回", requirement: "配置医師による深夜対応", difficulty: "高", is_new_2024: true, monthly_revenue: 14820 },
  { id: "medical_5", name: "配置医師緊急時対応加算（勤務時間外）", category: "medical", units: 350, period: "回", requirement: "配置医師による勤務時間外対応", difficulty: "中", is_new_2024: true, monthly_revenue: 7980 },
  { id: "eol_1", name: "看取り介護加算（Ⅰ）31-45日前", category: "end_of_life", units: 72, period: "日", requirement: "看取り介護計画", difficulty: "中", is_new_2024: false, monthly_revenue: 4104 },
  { id: "eol_2", name: "看取り介護加算（Ⅰ）4-30日前", category: "end_of_life", units: 144, period: "日", requirement: "看取り介護計画", difficulty: "中", is_new_2024: false, monthly_revenue: 16416 },
  { id: "eol_3", name: "看取り介護加算（Ⅰ）2-3日前", category: "end_of_life", units: 680, period: "日", requirement: "看取り介護計画", difficulty: "高", is_new_2024: false, monthly_revenue: 15504 },
  { id: "eol_4", name: "看取り介護加算（Ⅰ）死亡日", category: "end_of_life", units: 1280, period: "日", requirement: "看取り介護計画", difficulty: "高", is_new_2024: false, monthly_revenue: 14592 },
  { id: "eol_5", name: "看取り介護加算（Ⅱ）31-45日前", category: "end_of_life", units: 72, period: "日", requirement: "看取り介護計画（Ⅱ）", difficulty: "中", is_new_2024: false, monthly_revenue: 4104 },
  { id: "eol_6", name: "看取り介護加算（Ⅱ）4-30日前", category: "end_of_life", units: 144, period: "日", requirement: "看取り介護計画（Ⅱ）", difficulty: "中", is_new_2024: false, monthly_revenue: 16416 },
  { id: "eol_7", name: "看取り介護加算（Ⅱ）2-3日前", category: "end_of_life", units: 780, period: "日", requirement: "看取り介護計画（Ⅱ）", difficulty: "高", is_new_2024: false, monthly_revenue: 17784 },
  { id: "eol_8", name: "看取り介護加算（Ⅱ）死亡日", category: "end_of_life", units: 1580, period: "日", requirement: "看取り介護計画（Ⅱ）", difficulty: "高", is_new_2024: false, monthly_revenue: 18012 },
  { id: "night_1", name: "夜勤職員配置加算（Ⅰイ）", category: "nursing", units: 41, period: "日", requirement: "夜勤職員配置", difficulty: "中", is_new_2024: false, monthly_revenue: 14022 },
  { id: "night_2", name: "夜勤職員配置加算（Ⅰロ）", category: "nursing", units: 46, period: "日", requirement: "夜勤職員配置", difficulty: "中", is_new_2024: false, monthly_revenue: 15732 },
  { id: "night_3", name: "夜勤職員配置加算（Ⅱハ）", category: "nursing", units: 13, period: "日", requirement: "夜勤職員配置", difficulty: "低", is_new_2024: false, monthly_revenue: 4446 },
  { id: "night_4", name: "夜勤職員配置加算（Ⅱニ）", category: "nursing", units: 18, period: "日", requirement: "夜勤職員配置", difficulty: "低", is_new_2024: false, monthly_revenue: 6156 },
  { id: "night_5", name: "夜勤職員配置加算（Ⅲイ）", category: "nursing", units: 56, period: "日", requirement: "夜勤職員配置", difficulty: "高", is_new_2024: false, monthly_revenue: 19152 },
  { id: "night_6", name: "夜勤職員配置加算（Ⅲロ）", category: "nursing", units: 61, period: "日", requirement: "夜勤職員配置", difficulty: "高", is_new_2024: false, monthly_revenue: 20862 },
  { id: "night_7", name: "夜勤職員配置加算（Ⅳハ）", category: "nursing", units: 16, period: "日", requirement: "夜勤職員配置", difficulty: "低", is_new_2024: false, monthly_revenue: 5472 },
  { id: "night_8", name: "夜勤職員配置加算（Ⅳニ）", category: "nursing", units: 21, period: "日", requirement: "夜勤職員配置", difficulty: "低", is_new_2024: false, monthly_revenue: 7182 },
  { id: "infection_1", name: "高齢者施設等感染対策向上加算（Ⅰ）", category: "safety", units: 10, period: "月", requirement: "感染対策体制強化", difficulty: "中", is_new_2024: true, monthly_revenue: 3206.82 },
  { id: "infection_2", name: "高齢者施設等感染対策向上加算（Ⅱ）", category: "safety", units: 5, period: "月", requirement: "感染対策体制", difficulty: "低", is_new_2024: true, monthly_revenue: 1603.41 },
  { id: "nutrition_3", name: "退所時栄養情報連携加算", category: "nutrition", units: 70, period: "回", requirement: "栄養情報提供", difficulty: "低", is_new_2024: true, monthly_revenue: 798 },
  { id: "employment_1", name: "介護職員等処遇改善加算（Ⅰ）", category: "employment", units: 14, period: "月（%）", requirement: "処遇改善計画", difficulty: "高", is_new_2024: true, monthly_revenue: 3260.83 },
  { id: "employment_2", name: "介護職員等処遇改善加算（Ⅱ）", category: "employment", units: 13.6, period: "月（%）", requirement: "処遇改善計画", difficulty: "高", is_new_2024: true, monthly_revenue: 3167.66 },
  { id: "employment_3", name: "介護職員等処遇改善加算（Ⅲ）", category: "employment", units: 11.3, period: "月（%）", requirement: "処遇改善計画", difficulty: "中", is_new_2024: true, monthly_revenue: 2631.96 },
  { id: "employment_4", name: "介護職員等処遇改善加算（Ⅳ）", category: "employment", units: 9, period: "月（%）", requirement: "処遇改善計画", difficulty: "中", is_new_2024: true, monthly_revenue: 2096.25 },
  { id: "productivity_1", name: "生産性向上推進体制加算（Ⅰ）", category: "employment", units: 100, period: "月", requirement: "生産性向上体制", difficulty: "高", is_new_2024: true, monthly_revenue: 32068.2 },
  { id: "productivity_2", name: "生産性向上推進体制加算（Ⅱ）", category: "employment", units: 10, period: "月", requirement: "生産性向上体制", difficulty: "中", is_new_2024: true, monthly_revenue: 3206.82 },
  { id: "medical_6", name: "特別通院送迎加算", category: "medical", units: 594, period: "月", requirement: "特別通院送迎", difficulty: "中", is_new_2024: true, monthly_revenue: 190485.11 },
  { id: "medical_7", name: "協力医療機関連携加算（令和6年度）", category: "medical", units: 100, period: "月", requirement: "協力医療機関連携", difficulty: "中", is_new_2024: true, monthly_revenue: 32068.2 },
  { id: "medical_8", name: "協力医療機関連携加算（令和7年度～）", category: "medical", units: 50, period: "月", requirement: "協力医療機関連携", difficulty: "中", is_new_2024: true, monthly_revenue: 16034.1 },
  { id: "medical_9", name: "協力医療機関連携加算（その他）", category: "medical", units: 5, period: "月", requirement: "協力医療機関連携", difficulty: "低", is_new_2024: true, monthly_revenue: 1603.41 },
  { id: "infection_3", name: "新興感染症等施設療養費", category: "safety", units: 240, period: "日（月1回、連続5日限度）", requirement: "新興感染症対応", difficulty: "中", is_new_2024: true, monthly_revenue: 13680 },
  { id: "deduction_1", name: "身体拘束廃止未実施減算", category: "deduction", units: -10, period: "日（%）", requirement: "身体拘束廃止未実施", difficulty: "高", is_new_2024: false, monthly_revenue: -2329.16 },
  { id: "deduction_2", name: "夜勤体制未整備減算", category: "deduction", units: -3, period: "月（%）", requirement: "夜勤体制未整備", difficulty: "高", is_new_2024: false, monthly_revenue: -698.75 },
  { id: "deduction_3", name: "定員超過利用の減算", category: "deduction", units: -30, period: "月（%）", requirement: "定員超過利用", difficulty: "高", is_new_2024: false, monthly_revenue: -6987.49 },
  { id: "deduction_4", name: "業務継続計画未策定減算", category: "deduction", units: -3, period: "月（%）", requirement: "BCP未策定", difficulty: "中", is_new_2024: false, monthly_revenue: -698.75 },
  { id: "deduction_5", name: "高齢者虐待防止措置未実施減算", category: "deduction", units: -1, period: "月（%）", requirement: "虐待防止未実施", difficulty: "中", is_new_2024: false, monthly_revenue: -232.92 },
];

// 推奨加算ID一覧
export const recommendedAdditionIds = [
  "adl_1", "adl_2", "safety_1", "nutrition_1", "nursing_1a", "nursing_1b",
  "nursing_2a", "nursing_2b", "life_1", "life_2", "oral_1", "oral_2",
  "oral_3", "oral_4", "oral_5", "rehab_1", "rehab_2", "rehab_3",
  "service_1", "service_2", "service_3", "adl_3", "dementia_1",
  "dementia_3", "dementia_4", "dementia_5", "dementia_6",
  "excretion_1", "excretion_2", "excretion_3",
];
