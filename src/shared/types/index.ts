export type {
  Database,
  Couple,
  Profile,
  Category,
  Expense,
  Schedule,
  InsertExpense,
  UpdateExpense,
  InsertCategory,
} from "./database";

/** Default wedding categories */
export const DEFAULT_CATEGORIES = [
  { name: "웨딩홀", icon: "building", sort_order: 0 },
  { name: "스튜디오", icon: "camera", sort_order: 1 },
  { name: "드레스/턱시도", icon: "shirt", sort_order: 2 },
  { name: "예물/예단", icon: "gem", sort_order: 3 },
  { name: "혼수", icon: "sofa", sort_order: 4 },
  { name: "신혼여행", icon: "plane", sort_order: 5 },
  { name: "기타", icon: "plus", sort_order: 6 },
] as const;

/** Suggested tags per category */
export const SUGGESTED_TAGS: Record<string, string[]> = {
  "웨딩홀": ["대관료", "식대", "폐백", "주차", "꽃장식"],
  "스튜디오": ["스냅", "DVD", "앨범", "원판", "보정"],
  "드레스/턱시도": ["드레스", "턱시도", "속옷", "슈즈", "피팅"],
  "예물/예단": ["반지", "시계", "예단", "이바지", "함"],
  "혼수": ["가전", "가구", "침구", "주방", "생활용품"],
  "신혼여행": ["항공", "호텔", "액티비티", "보험", "비자"],
  "기타": ["청첩장", "부케", "사회자", "축가", "답례품", "포토부스"],
};

/** Regions for budget recommendation */
export const REGIONS = [
  "서울",
  "경기/인천",
  "부산/경남",
  "대구/경북",
  "대전/충청",
  "광주/전라",
  "강원",
  "제주",
] as const;

export type Region = (typeof REGIONS)[number];
