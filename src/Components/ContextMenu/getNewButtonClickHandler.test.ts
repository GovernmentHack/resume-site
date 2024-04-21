import { vi } from "vitest";
import { getNewButtonClickHandler } from "./getNewButtonClickHandler";
import { DesktopFile } from "../../types";
import { FILE_TYPE } from "../../utils/constants";

const mockEvent = {
  stopPropagation: vi.fn(),
} as any as React.MouseEvent<HTMLDivElement, MouseEvent>;

const mockSetFiles = vi.fn();
const mockFiles: DesktopFile[] = [];
const mockCloseModals = vi.fn();
const mockLocation = { x: 1, y: 1 };
const mockDirectory = "some_directory";

describe("getNewButtonClickHandler returns a click handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("for making new folders", () => {
    const mockType = FILE_TYPE.folder;

    it("that stops the event propigation", () => {
      const handler = getNewButtonClickHandler({
        setFiles: mockSetFiles,
        files: mockFiles,
        closeModals: mockCloseModals,
        location: mockLocation,
        directory: mockDirectory,
        type: mockType,
      });

      expect(() => handler(mockEvent)).not.toThrow();
    });

    it("that calls the closeModals callback", () => {
      const handler = getNewButtonClickHandler({
        setFiles: mockSetFiles,
        files: mockFiles,
        closeModals: mockCloseModals,
        location: mockLocation,
        directory: mockDirectory,
        type: mockType,
      });

      handler(mockEvent);

      expect(mockCloseModals).toBeCalledTimes(1);
    });

    it("that calls setFiles with the new folder", () => {
      const handler = getNewButtonClickHandler({
        setFiles: mockSetFiles,
        files: mockFiles,
        closeModals: mockCloseModals,
        location: mockLocation,
        directory: mockDirectory,
        type: mockType,
      });

      handler(mockEvent);

      expect(mockSetFiles).toBeCalledTimes(1);
      expect(mockSetFiles).toBeCalledWith([
        expect.objectContaining({
          fileName: "New Folder",
          location: mockLocation,
          directory: mockDirectory,
          type: mockType,
        }),
      ]);
    });
  });

  describe("for making new textFiles", () => {
    const mockType = FILE_TYPE.textFile;

    it("that stops the event propigation", () => {
      const handler = getNewButtonClickHandler({
        setFiles: mockSetFiles,
        files: mockFiles,
        closeModals: mockCloseModals,
        location: mockLocation,
        directory: mockDirectory,
        type: mockType,
      });

      expect(() => handler(mockEvent)).not.toThrow();
    });

    it("that calls the closeModals callback", () => {
      const handler = getNewButtonClickHandler({
        setFiles: mockSetFiles,
        files: mockFiles,
        closeModals: mockCloseModals,
        location: mockLocation,
        directory: mockDirectory,
        type: mockType,
      });

      handler(mockEvent);

      expect(mockCloseModals).toBeCalledTimes(1);
    });

    it("that calls setFiles with the new file", () => {
      const handler = getNewButtonClickHandler({
        setFiles: mockSetFiles,
        files: mockFiles,
        closeModals: mockCloseModals,
        location: mockLocation,
        directory: mockDirectory,
        type: mockType,
      });

      handler(mockEvent);

      expect(mockSetFiles).toBeCalledTimes(1);
      expect(mockSetFiles).toBeCalledWith([
        expect.objectContaining({
          fileName: "New Text Document",
          location: mockLocation,
          directory: mockDirectory,
          type: mockType,
        }),
      ]);
    });
  });

  it("that doesn't add new files for unsupported file types", () => {
    const handler = getNewButtonClickHandler({
      setFiles: mockSetFiles,
      files: mockFiles,
      closeModals: mockCloseModals,
      location: mockLocation,
      directory: mockDirectory,
      type: FILE_TYPE.shortcut,
    });

    handler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });
});
