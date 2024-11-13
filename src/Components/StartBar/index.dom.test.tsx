import { vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import {
  getMockTextFile,
  getMockFolder,
  getMockShortcut,
} from "../../testUtils";
import StartBar from ".";
import { useFileStore } from "../../fileStore";

const mocks = vi.hoisted(() => {
  return {
    useDrop: vi.fn(),
    useDrag: vi.fn(),
    shortcutContent: vi.fn(),
  };
});

const mockTextFile = getMockTextFile();

const mockFolder = getMockFolder();

const mockShortcut = getMockShortcut(mocks.shortcutContent);

vi.mock("react-dnd", () => {
  return {
    useDrop: mocks.useDrop,
    useDrag: mocks.useDrag,
  };
});

describe("StarBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDrop.mockReturnValue([{ isOver: false }, React.createRef()]);
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
  });

  it("renders only open start bar window buttons for files that have open windows or that are minimized", () => {
    useFileStore.setState({
      files: [
        { ...mockTextFile, isOpen: false, isMinimized: true },
        mockShortcut,
        { ...mockFolder, isOpen: true },
      ],
      setFiles: vi.fn(),
    });
    const { getByTestId } = render(<StartBar />);

    expect(
      getByTestId(`startbar-window-button-${mockFolder.fileId}`),
    ).toBeDefined();
    expect(
      getByTestId(`startbar-window-button-${mockTextFile.fileId}`),
    ).toBeDefined();
  });
});
