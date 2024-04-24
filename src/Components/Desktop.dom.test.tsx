import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import {
  getMockTextFile,
  getMockFolder,
  getMockShortcut,
} from "../testUtils";
import { FileContext } from "../App";
import Desktop, { DRAG_OFFSET_FIX } from "./Desktop";

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

describe("Desktop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useDrop.mockReturnValue([{ isDragging: false }, React.createRef()]);
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
  });

  describe("renders", () => {
    it("with no files", () => {
      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );

      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with textFiles", () => {
      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [mockTextFile],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );
      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with folders", () => {
      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [mockFolder],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );
      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with shortcuts", () => {
      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [mockShortcut],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );
      expect(getByTestId("desktop")).toBeDefined();
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
          <Desktop />
        </FileContext.Provider>,
      );

      const dndFactory = mocks.useDrop.mock.lastCall[0];
      const dndHandlers = dndFactory();

      dndHandlers.drop(
        { type: "window", fileId: mockShortcut.fileId },
        { getSourceClientOffset: vi.fn().mockReturnValue({ x: 42, y: 41 }) },
      );

      expect(mockSetFiles).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            windowLocation: {
              x: 42,
              y: 41,
            },
          }),
        ]),
      );

      dndHandlers.drop(
        { type: "no_window", fileId: mockShortcut.fileId },
        { getSourceClientOffset: vi.fn().mockReturnValue({ x: 42, y: 41 }) },
      );

      expect(mockSetFiles).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            location: {
              x: 42 - DRAG_OFFSET_FIX,
              y: 41,
            },
          }),
        ]),
      );
    });
  });

  describe("file icons", () => {
    it("renders file icons if the file.directory is null", () => {
      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [mockTextFile, mockFolder, mockShortcut],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );
      expect(getByTestId("desktop")).toBeDefined();
      expect(getByTestId(`${mockTextFile.fileId}_file_icon`)).toBeDefined();
      expect(getByTestId(`${mockFolder.fileId}_file_icon`)).toBeDefined();
      expect(getByTestId(`${mockShortcut.fileId}_file_icon`)).toBeDefined();
    });
    it("does not render file icons if the file.directory is not null", () => {
      const nestedFile = { ...mockTextFile, directory: "some_id" };
      const nestedFolder = { ...mockFolder, directory: "some_id" };
      const nestedShortcut = { ...mockShortcut, directory: "some_id" };

      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [nestedFile, nestedFolder, nestedShortcut],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );
      expect(getByTestId("desktop")).toBeDefined();
      expect(() =>
        getByTestId(`${nestedFile.fileId}_file_icon`),
      ).toThrowError();
      expect(() =>
        getByTestId(`${nestedFolder.fileId}_file_icon`),
      ).toThrowError();
      expect(() =>
        getByTestId(`${nestedShortcut.fileId}_file_icon`),
      ).toThrowError();
    });
  });

  describe("windows", () => {
    it("also renders windows if the file.open attribute is open", () => {
      const openFile = { ...mockTextFile, isOpen: true };
      const openFolder = { ...mockFolder, isOpen: true };

      const { getByTestId } = render(
        <FileContext.Provider
          value={{
            files: [openFile, openFolder],
            setFiles: vi.fn(),
            loading: false,
            setLoading: vi.fn(),
          }}
        >
          <Desktop />
        </FileContext.Provider>,
      );
      expect(getByTestId("desktop")).toBeDefined();
      expect(
        getByTestId(`${openFile.fileId}_textfile_window_container`),
      ).toBeDefined();
      expect(
        getByTestId(`${openFolder.fileId}_folder_window_container`),
      ).toBeDefined();
    });
  });

  it("renders the window context menu on right click", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <Desktop />
      </FileContext.Provider>,
    );

    const desktop = getByTestId("desktop");
    fireEvent.contextMenu(desktop);

    expect(getByTestId("context_menu_new_button")).toBeDefined();
  });
});
