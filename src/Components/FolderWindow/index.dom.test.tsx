import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import FolderWindow from ".";
import { getMockFolder, getMockTextFile } from "../../testUtils";
import { useFileStore } from "../../fileStore";

const mockFolder = getMockFolder();
const mockFile = getMockTextFile();

const mocks = vi.hoisted(() => {
  return {
    useDrop: vi.fn(),
    useDrag: vi.fn(),
    shortcutContent: vi.fn(),
  };
});

vi.mock("react-dnd", () => {
  return {
    useDrop: mocks.useDrop,
    useDrag: mocks.useDrag,
  };
});

describe("FolderWindow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDrop.mockReturnValue([{ isDragging: false }, React.createRef()]);
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
    useFileStore.setState({ files: [mockFolder, mockFile] });
  });

  it("renders", () => {
    const { getByTestId } = render(
      <FolderWindow
        fileId={mockFolder.fileId}
        fileName={mockFolder.fileName}
        windowLocation={mockFolder.windowLocation}
        windowIsFocused={mockFolder.windowIsFocused}
      />,
    );

    expect(
      getByTestId(`${mockFolder.fileId}_folder_window_container`),
    ).toBeDefined();
  });

  it("renders icons for each file in this folder", () => {
    const nestedFile = { ...mockFile, directory: mockFolder.fileId };
    useFileStore.setState({ files: [mockFolder, mockFile, nestedFile] });

    const { getByTestId } = render(
      <FolderWindow
        fileId={mockFolder.fileId}
        fileName={mockFolder.fileName}
        windowLocation={mockFolder.windowLocation}
        windowIsFocused={mockFolder.windowIsFocused}
      />,
    );

    expect(getByTestId(`${nestedFile.fileId}_file_icon`)).toBeDefined();
  });
  it("renders header text based on filename", () => {
    const { getByTestId } = render(
      <FolderWindow
        fileId={mockFolder.fileId}
        fileName={mockFolder.fileName}
        windowLocation={mockFolder.windowLocation}
        windowIsFocused={mockFolder.windowIsFocused}
      />,
    );

    expect(
      getByTestId(`${mockFolder.fileId}_folder_window_container`).textContent,
    ).toContain(`Exploring - C:\\${mockFolder.fileName}`);
  });
  it("opens file menu on file click", async () => {
    const { getByTestId, getByText } = render(
      <FolderWindow
        fileId={mockFolder.fileId}
        fileName={mockFolder.fileName}
        windowLocation={mockFolder.windowLocation}
        windowIsFocused={mockFolder.windowIsFocused}
      />,
    );

    fireEvent.click(getByTestId("folder_window_file_toolbar_button"));

    expect(getByText("Ctrl+N")).toBeDefined();
  });
});
