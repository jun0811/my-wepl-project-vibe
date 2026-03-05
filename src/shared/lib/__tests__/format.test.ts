import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCurrencyWithUnit,
  calculatePercentage,
  calculateDday,
  formatDday,
} from "../format";

describe("formatCurrency", () => {
  it("formats with comma separator", () => {
    expect(formatCurrency(1500000)).toBe("1,500,000");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("0");
  });

  it("handles large numbers", () => {
    expect(formatCurrency(32000000)).toBe("32,000,000");
  });
});

describe("formatCurrencyWithUnit", () => {
  it("formats in 만원 for values >= 10,000", () => {
    expect(formatCurrencyWithUnit(15000000)).toBe("1,500만원");
  });

  it("formats in 억원 for values >= 100,000,000", () => {
    expect(formatCurrencyWithUnit(300000000)).toBe("3억원");
  });

  it("formats in 원 for small values", () => {
    expect(formatCurrencyWithUnit(5000)).toBe("5,000원");
  });
});

describe("calculatePercentage", () => {
  it("calculates correctly", () => {
    expect(calculatePercentage(300000, 1000000)).toBe(30);
  });

  it("returns 0 when total is 0", () => {
    expect(calculatePercentage(100, 0)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe("calculateDday", () => {
  it("returns positive for future dates", () => {
    const future = new Date();
    future.setDate(future.getDate() + 100);
    expect(calculateDday(future)).toBe(100);
  });

  it("returns 0 for today", () => {
    const today = new Date();
    expect(calculateDday(today)).toBe(0);
  });

  it("returns negative for past dates", () => {
    const past = new Date();
    past.setDate(past.getDate() - 5);
    expect(calculateDday(past)).toBe(-5);
  });
});

describe("formatDday", () => {
  it("formats future D-day", () => {
    expect(formatDday(100)).toBe("D-100");
  });

  it("formats D-Day for 0", () => {
    expect(formatDday(0)).toBe("D-Day");
  });

  it("formats past D-day", () => {
    expect(formatDday(-3)).toBe("D+3");
  });
});
