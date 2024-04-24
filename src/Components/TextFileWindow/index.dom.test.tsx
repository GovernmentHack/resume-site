import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { FileContext } from "../../App";
import TextFileDesktopWindow from ".";
import { getMockTextFile } from "../../testUtils";
import { DRAG_TYPE } from "../shared/constants";

const mockTextFile = getMockTextFile();

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

describe("TextFileWindow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDrop.mockReturnValue([{ isDragging: false }, React.createRef()]);
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
  });

  it("renders", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [mockTextFile],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <TextFileDesktopWindow
          fileId={mockTextFile.fileId}
          fileName={mockTextFile.fileName}
          windowLocation={mockTextFile.windowLocation}
          windowIsFocused={mockTextFile.windowIsFocused}
          content={mockTextFile.content}
          isEditable={mockTextFile.isEditable}
        />
      </FileContext.Provider>,
    );

    expect(
      getByTestId(`${mockTextFile.fileId}_textfile_window_container`),
    ).toBeDefined();
  });

  it("renders header text based on filename", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [mockTextFile],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <TextFileDesktopWindow
          fileId={mockTextFile.fileId}
          fileName={mockTextFile.fileName}
          windowLocation={mockTextFile.windowLocation}
          windowIsFocused={mockTextFile.windowIsFocused}
          content={mockTextFile.content}
          isEditable={mockTextFile.isEditable}
        />
      </FileContext.Provider>,
    );

    expect(
      getByTestId(`${mockTextFile.fileId}_textfile_window_container`)
        .textContent,
    ).toContain(`${mockTextFile.fileName} - Notepad`);
  });
  it("opens file menu on file click", async () => {
    const { getByTestId, getByText } = render(
      <FileContext.Provider
        value={{
          files: [mockTextFile],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <TextFileDesktopWindow
          fileId={mockTextFile.fileId}
          fileName={mockTextFile.fileName}
          windowLocation={mockTextFile.windowLocation}
          windowIsFocused={mockTextFile.windowIsFocused}
          content={mockTextFile.content}
          isEditable={mockTextFile.isEditable}
        />
      </FileContext.Provider>,
    );

    fireEvent.click(getByTestId("textfile_window_file_toolbar_button"));

    expect(getByText("Ctrl+N")).toBeDefined();
  });

  it("renders with the drag and drop config", () => {
    const mockSetFiles = vi.fn();
    render(
      <FileContext.Provider
        value={{
          files: [mockTextFile],
          setFiles: mockSetFiles,
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <TextFileDesktopWindow
          fileId={mockTextFile.fileId}
          fileName={mockTextFile.fileName}
          windowLocation={mockTextFile.windowLocation}
          windowIsFocused={mockTextFile.windowIsFocused}
          content={mockTextFile.content}
          isEditable={mockTextFile.isEditable}
        />
      </FileContext.Provider>,
    );

    const dndFactory = mocks.useDrag.mock.lastCall[0];
    const dndHandlers = dndFactory();

    expect(dndHandlers.type).toEqual(DRAG_TYPE.window);
    expect(dndHandlers.options).toEqual({ dropEffect: "move" });
    expect(dndHandlers.item).toEqual({
      fileId: mockTextFile.fileId,
      type: DRAG_TYPE.window,
    });
  });
});
