import { vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { AddressBar } from "./AddressBar";

describe("AddressBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with the fileName", async () => {
    const { findByText } = render(<AddressBar fileName={"Some File"} />);

    const addressBar = await findByText("Address");
    expect(addressBar).toBeDefined();
    const addressBarContainer = await findByText("Some File");
    expect(addressBarContainer).toBeDefined();
  });
});
