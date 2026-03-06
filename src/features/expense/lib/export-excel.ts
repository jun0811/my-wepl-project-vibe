import * as XLSX from "xlsx";
import type { Expense, Category, Couple } from "@/shared/types";

interface ExportData {
  expenses: Expense[];
  categories: Category[];
  couple?: Couple | null;
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

export function exportExpensesToExcel({ expenses, categories, couple }: ExportData) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const wb = XLSX.utils.book_new();

  // ========== Sheet 1: 요약 대시보드 ==========
  const totalBudget = couple?.total_budget ?? categories.reduce((s, c) => s + c.budget_amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const paidTotal = expenses.filter((e) => e.is_paid).reduce((s, e) => s + e.amount, 0);
  const pendingTotal = expenses.filter((e) => !e.is_paid).reduce((s, e) => s + e.amount, 0);

  const dashboardData: (string | number)[][] = [
    ["웨플 (Wepl) - 결혼 비용 리포트"],
    [],
    ["결혼일", couple?.wedding_date ?? "-", "", "지역", couple?.region ?? "-"],
    [],
    ["총 예산", formatAmount(totalBudget) + "원", "", "총 지출", formatAmount(totalExpense) + "원"],
    ["결제 완료", formatAmount(paidTotal) + "원", "", "결제 대기", formatAmount(pendingTotal) + "원"],
    ["잔여 예산", formatAmount(totalBudget - totalExpense) + "원", "", "예산 소진율", totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) + "%" : "-"],
    [],
    ["카테고리", "예산", "지출합계", "잔여", "소진율", "건수"],
  ];

  const sortedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  sortedCategories.forEach((cat) => {
    const catExpenses = expenses.filter((e) => e.category_id === cat.id);
    const spent = catExpenses.reduce((s, e) => s + e.amount, 0);
    const remaining = cat.budget_amount - spent;
    const rate = cat.budget_amount > 0 ? Math.round((spent / cat.budget_amount) * 100) + "%" : "-";

    dashboardData.push([
      cat.name,
      formatAmount(cat.budget_amount) + "원",
      formatAmount(spent) + "원",
      formatAmount(remaining) + "원",
      rate,
      catExpenses.length,
    ]);
  });

  // Total row
  const catBudgetTotal = categories.reduce((s, c) => s + c.budget_amount, 0);
  dashboardData.push([]);
  dashboardData.push([
    "합계",
    formatAmount(catBudgetTotal) + "원",
    formatAmount(totalExpense) + "원",
    formatAmount(catBudgetTotal - totalExpense) + "원",
    catBudgetTotal > 0 ? Math.round((totalExpense / catBudgetTotal) * 100) + "%" : "-",
    expenses.length,
  ]);

  const wsDashboard = XLSX.utils.aoa_to_sheet(dashboardData);
  wsDashboard["!cols"] = [
    { wch: 14 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 10 }, { wch: 8 },
  ];
  wsDashboard["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // Title merge
  ];
  XLSX.utils.book_append_sheet(wb, wsDashboard, "요약");

  // ========== Sheet 2: 지출 내역 (카테고리별 그룹) ==========
  const expenseData: (string | number)[][] = [
    ["카테고리", "항목명", "금액", "날짜", "업체명", "결제상태", "체감가격", "태그", "메모"],
  ];

  sortedCategories.forEach((cat) => {
    const catExpenses = expenses
      .filter((e) => e.category_id === cat.id)
      .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

    if (catExpenses.length === 0) return;

    catExpenses.forEach((e) => {
      expenseData.push([
        cat.name,
        e.title,
        formatAmount(e.amount) + "원",
        e.date ?? "",
        e.vendor_name ?? "",
        e.is_paid ? "결제완료" : "결제대기",
        getPriceFeelingLabel(e.price_feeling),
        (e.tags ?? []).join(", "),
        e.memo ?? "",
      ]);
    });

    // Category subtotal
    const catTotal = catExpenses.reduce((s, e) => s + e.amount, 0);
    expenseData.push([
      "",
      `[${cat.name} 소계]`,
      formatAmount(catTotal) + "원",
      "",
      "",
      `${catExpenses.filter((e) => e.is_paid).length}건 완료`,
      "",
      "",
      "",
    ]);
    expenseData.push([]); // blank row between categories
  });

  // Grand total
  expenseData.push([
    "",
    "[전체 합계]",
    formatAmount(totalExpense) + "원",
    "",
    "",
    `총 ${expenses.length}건`,
    "",
    "",
    "",
  ]);

  const wsExpenses = XLSX.utils.aoa_to_sheet(expenseData);
  wsExpenses["!cols"] = [
    { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 12 },
    { wch: 16 }, { wch: 12 }, { wch: 8 }, { wch: 22 }, { wch: 28 },
  ];
  XLSX.utils.book_append_sheet(wb, wsExpenses, "지출내역");

  // ========== Sheet 3: 결제 대기 목록 ==========
  const pendingExpenses = expenses
    .filter((e) => !e.is_paid && e.amount > 0)
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  if (pendingExpenses.length > 0) {
    const pendingData: (string | number)[][] = [
      ["결제 대기 항목 (" + pendingExpenses.length + "건, 총 " + formatAmount(pendingTotal) + "원)"],
      [],
      ["카테고리", "항목명", "금액", "날짜", "업체명", "메모"],
    ];

    pendingExpenses.forEach((e) => {
      pendingData.push([
        categoryMap.get(e.category_id)?.name ?? "",
        e.title,
        formatAmount(e.amount) + "원",
        e.date ?? "",
        e.vendor_name ?? "",
        e.memo ?? "",
      ]);
    });

    const wsPending = XLSX.utils.aoa_to_sheet(pendingData);
    wsPending["!cols"] = [
      { wch: 14 }, { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 28 },
    ];
    wsPending["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    ];
    XLSX.utils.book_append_sheet(wb, wsPending, "결제대기");
  }

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `wepl-결혼비용-${date}.xlsx`);
}
