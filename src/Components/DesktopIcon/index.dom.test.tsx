import { vi } from "vitest";
import { render } from "@testing-library/react";
import DesktopIcon, { ICON_HIGHLIGHTED_BOX_SHADOW } from ".";
import React from "react";
import {
  getMockFolder,
  getMockShortcut,
  getMockTextFile,
} from "../../testUtils";
import { FileContext } from "../../App";

const mocks = vi.hoisted(() => {
  return {
    useDrag: vi.fn(),
    shortcutContent: vi.fn(),
  };
});

const mockTextFile = getMockTextFile();

const mockFolder = getMockFolder();

const mockShortcut = getMockShortcut(mocks.shortcutContent);

vi.mock("react-dnd", () => {
  return {
    useDrag: mocks.useDrag,
  };
});

describe("DesktopIcon", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
  });

  describe("IconContainer", () => {
    it("should render for a textFile", () => {
      const { getByTestId } = render(<DesktopIcon {...mockTextFile} />);
      expect(getByTestId(`${mockTextFile.fileId}_file_icon`)).toBeDefined();
    });
    it("should render for a folder", () => {
      const { getByTestId } = render(<DesktopIcon {...mockFolder} />);
      expect(getByTestId(`${mockFolder.fileId}_file_icon`)).toBeDefined();
    });
    it("should render for a shortcut", () => {
      const { getByTestId } = render(<DesktopIcon {...mockShortcut} />);
      expect(getByTestId(`${mockShortcut.fileId}_file_icon`)).toBeDefined();
    });

    it("with the drag and drop config", () => {
      const mockSetFiles = vi.fn();
      render(
        <FileContext.Provider
          value={{
            files: [mockShortcut],
            setFiles: mockSetFiles,
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <DesktopIcon {...mockTextFile} />
        </FileContext.Provider>,
      );

      const dndFactory = mocks.useDrag.mock.lastCall[0];
      const dndHandlers = dndFactory();

      expect(dndHandlers.options).toEqual({ dropEffect: "move" });
      expect(dndHandlers.item).toEqual({
        fileId: mockTextFile.fileId,
        type: mockTextFile.type,
      });
    });

    it("make invisible when dragging", () => {
      // makde invisible so the draggable preview is all thats visible
      mocks.useDrag.mockReturnValueOnce([
        { isDragging: true },
        React.createRef(),
      ]);
      const { getByTestId } = render(<DesktopIcon {...mockTextFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${mockTextFile.fileId}_file_icon`),
      );

      expect(style.opacity).toEqual("0");
    });

    it("make visible when not dragging", () => {
      // makde visible when not draggable
      const { getByTestId } = render(<DesktopIcon {...mockTextFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${mockTextFile.fileId}_file_icon`),
      );

      expect(style.opacity).toEqual("1");
    });

    it("set the location based off the file.location value", () => {
      // makde visible when not draggable
      const { getByTestId } = render(<DesktopIcon {...mockTextFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${mockTextFile.fileId}_file_icon`),
      );

      expect(style.top).toEqual(`${mockTextFile.location.y}px`);
      expect(style.left).toEqual(`${mockTextFile.location.x}px`);
    });

    it("should show filename", () => {
      const { getByTestId } = render(<DesktopIcon {...mockTextFile} />);
      expect(
        getByTestId(`${mockTextFile.fileId}_file_icon`).textContent,
      ).toEqual(mockTextFile.fileName);
    });

    it("should show filename truncated if filename is too long", () => {
      const fileNameTooLong = {
        ...mockTextFile,
        fileName:
          "this filename is too long and should be truncated because its over the 33 character limit",
      };
      const { getByTestId } = render(<DesktopIcon {...fileNameTooLong} />);
      expect(
        getByTestId(`${fileNameTooLong.fileId}_file_icon`).textContent,
      ).toEqual(`${fileNameTooLong.fileName.substring(0, 33)}...`);
    });
  });

  describe("IconImage", () => {
    it("will show a boxshadow when highlighted", () => {
      const highlightedFile = { ...mockTextFile, isHighlighted: true };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${highlightedFile.fileId}_file_icon_image`),
      );

      expect(style.boxShadow).toEqual(ICON_HIGHLIGHTED_BOX_SHADOW);
    });

    it("will not show a boxshadow when highlighted", () => {
      const highlightedFile = { ...mockTextFile, isHighlighted: false };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${highlightedFile.fileId}_file_icon_image`),
      );

      expect(style.boxShadow).toEqual("");
    });

    it("sets the background image based on the file.icon value", () => {
      const { getByTestId } = render(<DesktopIcon {...mockTextFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${mockTextFile.fileId}_file_icon_image`),
      );

      expect(style.backgroundImage).toEqual(`url(icons/${mockTextFile.icon})`);
    });
  });

  describe("iconText", () => {
    it("will show an input if the text is editable", () => {
      const highlightedFile = { ...mockTextFile, textIsEditing: true };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);

      expect(
        getByTestId(`${highlightedFile.fileId}_file_icon_editable_text`),
      ).toBeDefined();
      expect(() =>
        getByTestId(`${highlightedFile.fileId}_file_icon_text`),
      ).toThrowError();
    });

    it("will show just the text if the text is not editable", () => {
      const highlightedFile = { ...mockTextFile, textIsEditing: false };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);

      expect(
        getByTestId(`${highlightedFile.fileId}_file_icon_text`),
      ).toBeDefined();
      expect(() =>
        getByTestId(`${highlightedFile.fileId}_file_icon_editable_text`),
      ).toThrowError();
    });

    it("uses a box shadow if the text is highlighted", () => {
      const highlightedFile = { ...mockTextFile, isHighlighted: true };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${highlightedFile.fileId}_file_icon_text`),
      );

      expect(style.boxShadow).toEqual(ICON_HIGHLIGHTED_BOX_SHADOW);
    });

    it("has no box shadow if the text is not highlighted", () => {
      const highlightedFile = { ...mockTextFile, isHighlighted: false };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${highlightedFile.fileId}_file_icon_text`),
      );

      expect(style.boxShadow).toEqual("");
    });

    it("has a text color of black if the file is nested in a directory", () => {
      const highlightedFile = { ...mockTextFile, directory: "anything" };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${highlightedFile.fileId}_file_icon_text`),
      );

      expect(style.color).toEqual("rgb(0, 0, 0)");
    });

    it("has a text color of white if the file is on the desktop", () => {
      const highlightedFile = { ...mockTextFile, directory: null };
      const { getByTestId } = render(<DesktopIcon {...highlightedFile} />);
      const style = window.getComputedStyle(
        getByTestId(`${highlightedFile.fileId}_file_icon_text`),
      );

      expect(style.color).toEqual("rgb(255, 255, 255)");
    });
  });
});
