import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { getMockTextFile, getMockFolder } from "../../testUtils";
import { WindowButton } from "./WindowButton";
import { getWindowFocusClickHandler } from "../shared/handlers/windowFocusClickHandler";

const mockTextFile = getMockTextFile();

const mockFolder = getMockFolder();

const mockOnClick = vi.fn();
const mockSetFiles = vi.fn();

describe("WindowButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders proper icon for folders", () => {
    const { getByTestId } = render(
      <WindowButton file={mockFolder} onClick={mockOnClick} />,
    );

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
    const { getByTestId } = render(
      <WindowButton file={mockTextFile} onClick={mockOnClick} />,
    );

    const windowButton = getByTestId(
      `startbar-window-button-${mockTextFile.fileId}`,
    );

    const windowButtonStyles = window.getComputedStyle(
      windowButton.children.item(0) as Element,
    ).backgroundImage;

    expect(windowButtonStyles).toContain("notepad-0.png");
  });

  it("sets the associated file as focused when clicked", () => {
    const { getByTestId } = render(
      <WindowButton
        file={mockTextFile}
        onClick={getWindowFocusClickHandler({
          files: [mockTextFile],
          setFiles: mockSetFiles,
          fileId: mockTextFile.fileId,
        })}
      />,
    );

    const windowButton = getByTestId(
      `startbar-window-button-${mockTextFile.fileId}`,
    );

    fireEvent.click(windowButton);

    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fileId: mockTextFile.fileId,
          windowIsFocused: true,
        }),
      ]),
    );
  });
});
