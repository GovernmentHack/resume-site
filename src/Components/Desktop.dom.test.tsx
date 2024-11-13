import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { getMockTextFile, getMockFolder, getMockShortcut } from "../testUtils";
import Desktop, { DRAG_OFFSET_FIX } from "./Desktop";
import { useFileStore } from "../fileStore";

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
    mocks.useDrop.mockReturnValue([{ isOver: false }, React.createRef()]);
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
  });

  describe("renders", () => {
    it("with no files", () => {
      const { getByTestId } = render(<Desktop />);

      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with textFiles", () => {
      const { getByTestId } = render(<Desktop />);
      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with folders", () => {
      const { getByTestId } = render(<Desktop />);
      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with shortcuts", () => {
      const { getByTestId } = render(<Desktop />);
      expect(getByTestId("desktop")).toBeDefined();
    });

    it("with the drag and drop config", () => {
      const mockSetFiles = vi.fn();
      useFileStore.setState({ files: [mockShortcut], setFiles: mockSetFiles });
      render(<Desktop />);

      const dndFactory = mocks.useDrop.mock.calls[0][0];
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
      useFileStore.setState({
        files: [mockFolder, mockShortcut, mockTextFile],
      });

      const { getByTestId } = render(<Desktop />);
      expect(getByTestId("desktop")).toBeDefined();
      expect(getByTestId(`${mockTextFile.fileId}_file_icon`)).toBeDefined();
      expect(getByTestId(`${mockFolder.fileId}_file_icon`)).toBeDefined();
      expect(getByTestId(`${mockShortcut.fileId}_file_icon`)).toBeDefined();
    });
    it("does not render file icons if the file.directory is not null", () => {
      const nestedFile = { ...mockTextFile, directory: "some_id" };
      const nestedFolder = { ...mockFolder, directory: "some_id" };
      const nestedShortcut = { ...mockShortcut, directory: "some_id" };

      useFileStore.setState({
        files: [nestedFolder, nestedShortcut, nestedFile],
      });

      const { getByTestId } = render(<Desktop />);
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

      useFileStore.setState({ files: [openFile, openFolder] });

      const { getByTestId } = render(<Desktop />);
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
    const { getByTestId } = render(<Desktop />);

    const desktop = getByTestId("desktop");
    fireEvent.contextMenu(desktop);

    expect(getByTestId("context_menu_new_button")).toBeDefined();
  });
});
