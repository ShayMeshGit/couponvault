import React from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import CouponCard, { copyTextToClipboard } from "./CouponCard";
import type { Coupon } from "@/types";

const coupon: Coupon = {
  id: "coupon-1",
  storeName: "Shop A",
  code: "SAVE10",
  originalAmount: 100,
  amountLeft: 75,
  currency: "$",
  expiryDate: "2027-01-01",
  description: "Discount for select items",
  category: "Other",
  status: "active",
  createdAt: Date.now(),
};

describe("CouponCard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders coupon details", () => {
    const html = renderToString(
      React.createElement(CouponCard, {
        coupon,
        onDelete: vi.fn(),
        onUpdate: vi.fn(),
      }),
    );

    expect(html).toContain("Shop A");
    expect(html).toContain("SAVE10");
  });

  it("copies code with clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await expect(copyTextToClipboard("SAVE10")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("SAVE10");
  });

  it("falls back to execCommand when clipboard API fails", async () => {
    const textArea = {
      value: "",
      setAttribute: vi.fn(),
      style: {} as Record<string, string>,
      select: vi.fn(),
      setSelectionRange: vi.fn(),
    };
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const createElement = vi.fn().mockReturnValue(textArea);
    const execCommand = vi.fn().mockReturnValue(true);

    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("failed")) },
    });
    vi.stubGlobal("document", {
      createElement,
      body: { appendChild, removeChild },
      execCommand,
    });

    await expect(copyTextToClipboard("SAVE10")).resolves.toBe(true);
    expect(createElement).toHaveBeenCalledWith("textarea");
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(appendChild).toHaveBeenCalledWith(textArea);
    expect(removeChild).toHaveBeenCalledWith(textArea);
  });
});
