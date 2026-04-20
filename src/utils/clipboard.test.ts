import { afterEach, describe, expect, it, vi } from "vitest";
import { copyTextToClipboard } from "@/utils/clipboard";

describe("copyTextToClipboard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("copies text with clipboard API", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    await expect(copyTextToClipboard("SAVE10")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("SAVE10");
  });

  it("returns false for empty text", async () => {
    await expect(copyTextToClipboard("")).resolves.toBe(false);
  });

  it("returns false when document body is unavailable", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("failed")) },
    });
    vi.stubGlobal("document", {
      body: undefined,
    });

    await expect(copyTextToClipboard("SAVE10")).resolves.toBe(false);
  });

  it("falls back to execCommand when clipboard API fails", async () => {
    const textArea = {
      value: "",
      readOnly: false,
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

  it("returns false and still removes textarea when fallback copy throws", async () => {
    const textArea = {
      value: "",
      readOnly: false,
      style: {} as Record<string, string>,
      select: vi.fn(),
      setSelectionRange: vi.fn(),
    };
    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const createElement = vi.fn().mockReturnValue(textArea);
    const execCommand = vi.fn().mockImplementation(() => {
      throw new Error("copy failed");
    });

    vi.stubGlobal("navigator", {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("failed")) },
    });
    vi.stubGlobal("document", {
      createElement,
      body: { appendChild, removeChild },
      execCommand,
    });

    await expect(copyTextToClipboard("SAVE10")).resolves.toBe(false);
    expect(removeChild).toHaveBeenCalledWith(textArea);
  });
});
