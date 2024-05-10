import { describe, it, expect, vi, beforeEach } from "vitest";
import { DesktopFile } from "../../types";
import { getIconDoubleClickHandler } from "./getIconDoubleClickHandler";

const mockSetFiles = vi.fn();
const mockSetLoading = vi.fn();
const mockEvent = {
  stopPropagation: vi.fn(),
} as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getIconDoubleClickHandler returns a function that ...", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing if the file isn't present for the given fileId", () => {
    const clickHandler = getIconDoubleClickHandler({
      files: [
        {
          fileId: "some_id",
          isOpen: false,
          windowIsFocused: false,
          type: "folder",
        } as unknown as DesktopFile,
      ],
      setFiles: mockSetFiles,
      fileId: "some_other_id",
      setLoading: mockSetLoading,
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });
  it("opens the related window for that folder and focuses it", () => {
    const clickHandler = getIconDoubleClickHandler({
      files: [
        {
          fileId: "some_id",
          isOpen: false,
          windowIsFocused: false,
          type: "folder",
        } as unknown as DesktopFile,
      ],
      setFiles: mockSetFiles,
      fileId: "some_id",
      setLoading: mockSetLoading,
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isOpen: true,
          fileId: "some_id",
          windowIsFocused: true,
        }),
      ]),
    );
  });

  it("opens the related window for that textFile and focuses it", () => {
    const clickHandler = getIconDoubleClickHandler({
      files: [
        {
          fileId: "some_id",
          isOpen: false,
          windowIsFocused: false,
          type: "file",
        } as unknown as DesktopFile,
      ],
      setFiles: mockSetFiles,
      fileId: "some_id",
      setLoading: mockSetLoading,
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isMinimized: false,
          isOpen: true,
          fileId: "some_id",
          windowIsFocused: true,
        }),
      ]),
    );
  });

  it("runs the content function for that shortcut", () => {
    const mockContent = vi.fn();
    const mockFiles = [
      {
        fileId: "some_id",
        content: mockContent,
        type: "shortcut",
      } as unknown as DesktopFile,
    ];
    const clickHandler = getIconDoubleClickHandler({
      files: mockFiles,
      setFiles: mockSetFiles,
      fileId: "some_id",
      setLoading: mockSetLoading,
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
    expect(mockContent).toBeCalledWith({
      files: mockFiles,
      setFiles: mockSetFiles,
      setLoading: mockSetLoading,
    });
  });

  it("sets other textFiles and folders' windows to unfocused", () => {
    const mockContent = vi.fn();
    const mockFiles = [
      {
        fileId: "some_other_id",
        content: mockContent,
        type: "textFile",
        windowIsFocused: true,
      } as unknown as DesktopFile,
      {
        fileId: "some_third_id",
        content: mockContent,
        type: "folder",
        windowIsFocused: true,
      } as unknown as DesktopFile,
      {
        fileId: "some_id",
        content: mockContent,
        type: "file",
        windowIsFocused: false,
      } as unknown as DesktopFile,
    ];
    const clickHandler = getIconDoubleClickHandler({
      files: mockFiles,
      setFiles: mockSetFiles,
      fileId: "some_id",
      setLoading: mockSetLoading,
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fileId: "some_third_id",
          content: mockContent,
          type: "folder",
          windowIsFocused: false,
        }),
        expect.objectContaining({
          fileId: "some_other_id",
          content: mockContent,
          type: "textFile",
          windowIsFocused: false,
        }),
      ]),
    );
  });
});
