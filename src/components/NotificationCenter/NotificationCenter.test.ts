import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import NotificationCenter from "./NotificationCenter";

describe("NotificationCenter", () => {
  it("renders empty-notification message", () => {
    const html = renderToString(
      React.createElement(NotificationCenter, {
        isOpen: true,
        alerts: [],
        onClose: vi.fn(),
      }),
    );

    expect(html).toContain("No urgent notifications at this time.");
  });
});
