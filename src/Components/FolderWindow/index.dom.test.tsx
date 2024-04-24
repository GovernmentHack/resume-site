import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { FileContext } from "../../App";
import FolderWindow from ".";
import { getMockFolder, getMockTextFile } from "../../testUtils";

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
  });

  it("renders", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [mockFolder],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <FolderWindow
          fileId={mockFolder.fileId}
          fileName={mockFolder.fileName}
          windowLocation={mockFolder.windowLocation}
          windowIsFocused={mockFolder.windowIsFocused}
        />
      </FileContext.Provider>,
    );

    expect(
      getByTestId(`${mockFolder.fileId}_folder_window_container`),
    ).toBeDefined();
  });

  it("renders icons for each file in this folder", () => {
    const nestedFile = { ...mockFile, directory: mockFolder.fileId };
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [mockFolder, nestedFile],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <FolderWindow
          fileId={mockFolder.fileId}
          fileName={mockFolder.fileName}
          windowLocation={mockFolder.windowLocation}
          windowIsFocused={mockFolder.windowIsFocused}
        />
      </FileContext.Provider>,
    );

    expect(getByTestId(`${nestedFile.fileId}_file_icon`)).toBeDefined();
  });
  it("renders header text based on filename", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [mockFolder, mockFile],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <FolderWindow
          fileId={mockFolder.fileId}
          fileName={mockFolder.fileName}
          windowLocation={mockFolder.windowLocation}
          windowIsFocused={mockFolder.windowIsFocused}
        />
      </FileContext.Provider>,
    );

    expect(
      getByTestId(`${mockFolder.fileId}_folder_window_container`).textContent,
    ).toContain(`Exploring - C:\\${mockFolder.fileName}`);
  });
  it("opens file menu on file click", async () => {
    const { getByTestId, getByText } = render(
      <FileContext.Provider
        value={{
          files: [mockFolder, mockFile],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <FolderWindow
          fileId={mockFolder.fileId}
          fileName={mockFolder.fileName}
          windowLocation={mockFolder.windowLocation}
          windowIsFocused={mockFolder.windowIsFocused}
        />
      </FileContext.Provider>,
    );

    fireEvent.click(getByTestId("folder_window_file_toolbar_button"));

    expect(getByText("Ctrl+N")).toBeDefined();
  });
});
