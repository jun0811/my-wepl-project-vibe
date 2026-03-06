import * as XLSX from "xlsx";
import type { Expense, Category } from "@/shared/types";

interface ExportData {
  expenses: Expense[];
  categories: Category[];
}

export function exportExpensesToExcel({ expenses, categories }: ExportData) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const expenseRows = expenses.map((e) => ({
    "카테고리": categoryMap.get(e.category_id)?.name ?? "",
    "항목명": e.title,
    "금액": e.amount,
    "날짜": e.date ?? "",
    "업체명": e.vendor_name ?? "",
    "결제상태": e.is_paid ? "결제완료" : "결제대기",
    "체감가격":
      e.price_feeling === "cheap"
        ? "저렴"
        : e.price_feeling === "fair"
          ? "적당"
          : e.price_feeling === "expensive"
            ? "비쌈"
            : "",
    "태그": (e.tags ?? []).join(", "),
    "메모": e.memo ?? "",
  }));

  const summaryRows = categories.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category_id === cat.id);
    const totalSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      "카테고리": cat.name,
      "예산": cat.budget_amount,
      "지출합계": totalSpent,
      "잔여": cat.budget_amount - totalSpent,
      "건수": catExpenses.length,
    };
  });

  const wb = XLSX.utils.book_new();

  const ws1 = XLSX.utils.json_to_sheet(expenseRows);
  ws1["!cols"] = [
    { wch: 12 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
    { wch: 10 },
    { wch: 8 },
    { wch: 20 },
    { wch: 25 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, "지출내역");

  const ws2 = XLSX.utils.json_to_sheet(summaryRows);
  ws2["!cols"] = [
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 },
    { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, "예산요약");

  const date = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `wepl-지출내역-${date}.xlsx`);
}
