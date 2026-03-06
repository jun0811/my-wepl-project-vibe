import XLSX from "xlsx-js-style";
import type { Expense, Category, Couple } from "@/shared/types";

interface ExportData {
  expenses: Expense[];
  categories: Category[];
  couple?: Couple | null;
}

// ── Style Presets ──

const STYLES = {
  title: {
    font: { bold: true, sz: 16, color: { rgb: "862F40" } },
    alignment: { horizontal: "left" as const },
  },
  sectionHeader: {
    font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "E8758A" } },
    alignment: { horizontal: "center" as const, vertical: "center" as const },
    border: borderAll("D4D4D4"),
  },
  labelCell: {
    font: { sz: 10, color: { rgb: "737373" } },
    fill: { fgColor: { rgb: "FFF5F6" } },
    border: borderAll("E5E5E5"),
  },
  valueCell: {
    font: { bold: true, sz: 11 },
    border: borderAll("E5E5E5"),
    alignment: { horizontal: "right" as const },
  },
  categoryRow: {
    font: { bold: true, sz: 10 },
    fill: { fgColor: { rgb: "F5F5F5" } },
    border: borderAll("E5E5E5"),
  },
  dataCell: {
    font: { sz: 10 },
    border: borderAll("E5E5E5"),
  },
  subtotalRow: {
    font: { bold: true, sz: 10, color: { rgb: "862F40" } },
    fill: { fgColor: { rgb: "FFF5F6" } },
    border: borderAll("E5E5E5"),
  },
  grandTotal: {
    font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "862F40" } },
    border: borderAll("862F40"),
    alignment: { horizontal: "right" as const },
  },
};

function borderAll(color: string) {
  const side = { style: "thin" as const, color: { rgb: color } };
  return { top: side, bottom: side, left: side, right: side };
}

function formatAmount(value: number): string {
  return value.toLocaleString("ko-KR");
}

function getPriceFeelingLabel(feeling: string | null | undefined): string {
  if (feeling === "cheap") return "저렴";
  if (feeling === "fair") return "적당";
  if (feeling === "expensive") return "비쌈";
  return "";
}

type CellValue = string | number;
type StyledCell = { v: CellValue; s?: Record<string, unknown> };
type StyledRow = StyledCell[];

function cell(v: CellValue, s?: Record<string, unknown>): StyledCell {
  return { v, s };
}

function styledSheetFromRows(rows: StyledRow[]): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};
  const range = { s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: 0 } };

  rows.forEach((row, r) => {
    row.forEach((c, ci) => {
      const ref = XLSX.utils.encode_cell({ r, c: ci });
      ws[ref] = { v: c.v, t: typeof c.v === "number" ? "n" : "s", s: c.s };
      if (ci > range.e.c) range.e.c = ci;
    });
  });

  ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}

export function exportExpensesToExcel({ expenses, categories, couple }: ExportData) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  const wb = XLSX.utils.book_new();

  const totalBudget = couple?.total_budget ?? categories.reduce((s, c) => s + c.budget_amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const paidTotal = expenses.filter((e) => e.is_paid).reduce((s, e) => s + e.amount, 0);
  const pendingTotal = expenses.filter((e) => !e.is_paid).reduce((s, e) => s + e.amount, 0);

  // ========== Sheet 1: 요약 대시보드 ==========
  const dashRows: StyledRow[] = [
    [cell("웨플 (Wepl) - 결혼 비용 리포트", STYLES.title), cell(""), cell(""), cell(""), cell(""), cell("")],
    [cell(""), cell(""), cell(""), cell(""), cell(""), cell("")],
    [
      cell("결혼일", STYLES.labelCell), cell(couple?.wedding_date ?? "-", STYLES.valueCell), cell(""),
      cell("지역", STYLES.labelCell), cell(couple?.region ?? "-", STYLES.valueCell), cell(""),
    ],
    [cell(""), cell(""), cell(""), cell(""), cell(""), cell("")],
    [
      cell("총 예산", STYLES.labelCell), cell(formatAmount(totalBudget) + "원", STYLES.valueCell), cell(""),
      cell("총 지출", STYLES.labelCell), cell(formatAmount(totalExpense) + "원", STYLES.valueCell), cell(""),
    ],
    [
      cell("결제 완료", STYLES.labelCell), cell(formatAmount(paidTotal) + "원", STYLES.valueCell), cell(""),
      cell("결제 대기", STYLES.labelCell), cell(formatAmount(pendingTotal) + "원", STYLES.valueCell), cell(""),
    ],
    [
      cell("잔여 예산", STYLES.labelCell), cell(formatAmount(totalBudget - totalExpense) + "원", STYLES.valueCell), cell(""),
      cell("예산 소진율", STYLES.labelCell), cell(totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) + "%" : "-", STYLES.valueCell), cell(""),
    ],
    [cell(""), cell(""), cell(""), cell(""), cell(""), cell("")],
    ["카테고리", "예산", "지출합계", "잔여", "소진율", "건수"].map((h) => cell(h, STYLES.sectionHeader)),
  ];

  sortedCategories.forEach((cat) => {
    const catExpenses = expenses.filter((e) => e.category_id === cat.id);
    const spent = catExpenses.reduce((s, e) => s + e.amount, 0);
    const remaining = cat.budget_amount - spent;
    const rate = cat.budget_amount > 0 ? Math.round((spent / cat.budget_amount) * 100) + "%" : "-";

    dashRows.push([
      cell(cat.name, STYLES.dataCell),
      cell(formatAmount(cat.budget_amount) + "원", STYLES.dataCell),
      cell(formatAmount(spent) + "원", STYLES.dataCell),
      cell(formatAmount(remaining) + "원", STYLES.dataCell),
      cell(rate, STYLES.dataCell),
      cell(catExpenses.length, STYLES.dataCell),
    ]);
  });

  dashRows.push([cell(""), cell(""), cell(""), cell(""), cell(""), cell("")]);

  const catBudgetTotal = categories.reduce((s, c) => s + c.budget_amount, 0);
  dashRows.push([
    cell("합계", STYLES.grandTotal),
    cell(formatAmount(catBudgetTotal) + "원", STYLES.grandTotal),
    cell(formatAmount(totalExpense) + "원", STYLES.grandTotal),
    cell(formatAmount(catBudgetTotal - totalExpense) + "원", STYLES.grandTotal),
    cell(catBudgetTotal > 0 ? Math.round((totalExpense / catBudgetTotal) * 100) + "%" : "-", STYLES.grandTotal),
    cell(expenses.length, STYLES.grandTotal),
  ]);

  const wsDashboard = styledSheetFromRows(dashRows);
  wsDashboard["!cols"] = [
    { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 8 },
  ];
  wsDashboard["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
  XLSX.utils.book_append_sheet(wb, wsDashboard, "요약");

  // ========== Sheet 2: 지출 내역 ==========
  const expRows: StyledRow[] = [
    ["카테고리", "항목명", "금액", "날짜", "업체명", "결제상태", "체감가격", "태그", "메모"]
      .map((h) => cell(h, STYLES.sectionHeader)),
  ];

  sortedCategories.forEach((cat) => {
    const catExpenses = expenses
      .filter((e) => e.category_id === cat.id)
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

    if (catExpenses.length === 0) return;

    catExpenses.forEach((e) => {
      expRows.push([
        cell(cat.name, STYLES.dataCell),
        cell(e.title, STYLES.dataCell),
        cell(formatAmount(e.amount) + "원", STYLES.dataCell),
        cell(e.date ?? "", STYLES.dataCell),
        cell(e.vendor_name ?? "", STYLES.dataCell),
        cell(e.is_paid ? "결제완료" : "결제대기", STYLES.dataCell),
        cell(getPriceFeelingLabel(e.price_feeling), STYLES.dataCell),
        cell((e.tags ?? []).join(", "), STYLES.dataCell),
        cell(e.memo ?? "", STYLES.dataCell),
      ]);
    });

    const catTotal = catExpenses.reduce((s, e) => s + e.amount, 0);
    expRows.push([
      cell("", STYLES.subtotalRow),
      cell(`[${cat.name} 소계]`, STYLES.subtotalRow),
      cell(formatAmount(catTotal) + "원", STYLES.subtotalRow),
      cell("", STYLES.subtotalRow),
      cell("", STYLES.subtotalRow),
      cell(`${catExpenses.filter((e) => e.is_paid).length}건 완료`, STYLES.subtotalRow),
      cell("", STYLES.subtotalRow),
      cell("", STYLES.subtotalRow),
      cell("", STYLES.subtotalRow),
    ]);
  });

  // Grand total
  expRows.push([
    cell("", STYLES.grandTotal),
    cell("[전체 합계]", STYLES.grandTotal),
    cell(formatAmount(totalExpense) + "원", STYLES.grandTotal),
    cell("", STYLES.grandTotal),
    cell("", STYLES.grandTotal),
    cell(`총 ${expenses.length}건`, STYLES.grandTotal),
    cell("", STYLES.grandTotal),
    cell("", STYLES.grandTotal),
    cell("", STYLES.grandTotal),
  ]);

  const wsExpenses = styledSheetFromRows(expRows);
  wsExpenses["!cols"] = [
    { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 12 },
    { wch: 16 }, { wch: 12 }, { wch: 8 }, { wch: 22 }, { wch: 28 },
  ];
  XLSX.utils.book_append_sheet(wb, wsExpenses, "지출내역");

  // ========== Sheet 3: 월별 추이 ==========
  const monthlyMap = new Map<string, { total: number; paid: number; pending: number; count: number }>();

  expenses.forEach((e) => {
    if (!e.date) return;
    const month = e.date.slice(0, 7); // "2026-03"
    const entry = monthlyMap.get(month) ?? { total: 0, paid: 0, pending: 0, count: 0 };
    entry.total += e.amount;
    entry.count += 1;
    if (e.is_paid) entry.paid += e.amount;
    else entry.pending += e.amount;
    monthlyMap.set(month, entry);
  });

  const sortedMonths = [...monthlyMap.keys()].sort();

  if (sortedMonths.length > 0) {
    const monthRows: StyledRow[] = [
      [cell("월별 지출 추이", STYLES.title), cell(""), cell(""), cell(""), cell("")],
      [cell(""), cell(""), cell(""), cell(""), cell("")],
      ["월", "지출 합계", "결제 완료", "결제 대기", "건수"].map((h) => cell(h, STYLES.sectionHeader)),
    ];

    let runningTotal = 0;
    sortedMonths.forEach((month) => {
      const data = monthlyMap.get(month)!;
      runningTotal += data.total;
      monthRows.push([
        cell(month, STYLES.dataCell),
        cell(formatAmount(data.total) + "원", STYLES.dataCell),
        cell(formatAmount(data.paid) + "원", STYLES.dataCell),
        cell(formatAmount(data.pending) + "원", STYLES.dataCell),
        cell(data.count, STYLES.dataCell),
      ]);
    });

    monthRows.push([cell(""), cell(""), cell(""), cell(""), cell("")]);
    monthRows.push([
      cell("합계", STYLES.grandTotal),
      cell(formatAmount(runningTotal) + "원", STYLES.grandTotal),
      cell(formatAmount(paidTotal) + "원", STYLES.grandTotal),
      cell(formatAmount(pendingTotal) + "원", STYLES.grandTotal),
      cell(expenses.filter((e) => e.date).length, STYLES.grandTotal),
    ]);

    const wsMonthly = styledSheetFromRows(monthRows);
    wsMonthly["!cols"] = [
      { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 8 },
    ];
    wsMonthly["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    XLSX.utils.book_append_sheet(wb, wsMonthly, "월별추이");
  }

  // ========== Sheet 4: 결제 대기 목록 ==========
  const pendingExpenses = expenses
    .filter((e) => !e.is_paid && e.amount > 0)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  if (pendingExpenses.length > 0) {
    const pendRows: StyledRow[] = [
      [cell(`결제 대기 항목 (${pendingExpenses.length}건, 총 ${formatAmount(pendingTotal)}원)`, STYLES.title),
        cell(""), cell(""), cell(""), cell(""), cell("")],
      [cell(""), cell(""), cell(""), cell(""), cell(""), cell("")],
      ["카테고리", "항목명", "금액", "날짜", "업체명", "메모"].map((h) => cell(h, STYLES.sectionHeader)),
    ];

    pendingExpenses.forEach((e) => {
      pendRows.push([
        cell(categoryMap.get(e.category_id)?.name ?? "", STYLES.dataCell),
        cell(e.title, STYLES.dataCell),
        cell(formatAmount(e.amount) + "원", STYLES.dataCell),
        cell(e.date ?? "", STYLES.dataCell),
        cell(e.vendor_name ?? "", STYLES.dataCell),
        cell(e.memo ?? "", STYLES.dataCell),
      ]);
    });

    const wsPending = styledSheetFromRows(pendRows);
    wsPending["!cols"] = [
      { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 28 },
    ];
    wsPending["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];
    XLSX.utils.book_append_sheet(wb, wsPending, "결제대기");
  }

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `wepl-결혼비용-${date}.xlsx`);
}
