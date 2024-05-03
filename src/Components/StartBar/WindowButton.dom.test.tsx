import { vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { getMockTextFile, getMockFolder } from "../../testUtils";
import { WindowButton } from "./WindowButton";

const mockTextFile = getMockTextFile();

const mockFolder = getMockFolder();

describe("WindowButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders proper icon for folders", () => {
    const { getByTestId } = render(<WindowButton file={mockFolder} />);

    const windowButton = getByTestId(
      `startbar-window-button-${mockFolder.fileId}`,
    );

    expect(windowButton.textContent).toEqual(mockFolder.fileName);

    const windowButtonStyles = window.getComputedStyle(
      windowButton.children.item(0) as Element,
    ).backgroundImage;

    expect(windowButtonStyles).toContain("directory_explorer-3.png");
  });

  it("renders proper icon for textFiles", () => {
    const { getByTestId } = render(<WindowButton file={mockTextFile} />);

    const windowButton = getByTestId(
      `startbar-window-button-${mockTextFile.fileId}`,
    );

    const windowButtonStyles = window.getComputedStyle(
      windowButton.children.item(0) as Element,
    ).backgroundImage;

    expect(windowButtonStyles).toContain("notepad-0.png");
  });
});
