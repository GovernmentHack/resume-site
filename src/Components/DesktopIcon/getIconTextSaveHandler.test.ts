import { describe, it, expect, vi, beforeEach } from "vitest";

import { DesktopFile } from "../../utils/types";
import { getIconTextSaveHandler } from "./getIconTextSaveHandler";

const mockSetFiles = vi.fn();
const mockEvent = {
  stopPropagation: vi.fn(),
} as unknown as React.KeyboardEvent<HTMLInputElement>;

describe("getIconTextSaveHandler returns a function that...", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEvent.key = "";
  });

  describe("when the enter key is pressed...", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockEvent.key = "Enter";
    });
    it("unhighlights the file, sets editing to false, and saves the new fileName, if the file's textIsEditing state is true", () => {
      const clickHandler = getIconTextSaveHandler({
        files: [
          {
            fileId: "some_id",
            isHighlighted: true,
            textIsEditing: true,
          } as unknown as DesktopFile,
        ],
        setFiles: mockSetFiles,
        fileId: "some_id",
        newFileName: "new file name!",
      });

      clickHandler(mockEvent);

      expect(mockSetFiles).toBeCalledTimes(1);
      expect(mockSetFiles).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            isHighlighted: false,
            textIsEditing: false,
            fileId: "some_id",
            fileName: "new file name!",
          }),
        ]),
      );
    });

    it("ignores other files when changing file based on provided fileId", () => {
      const clickHandler = getIconTextSaveHandler({
        files: [
          {
            fileId: "some_id",
            isHighlighted: true,
            textIsEditing: true,
            fileName: "uneditied file name",
          } as unknown as DesktopFile,
          {
            fileId: "some_other_id",
            fileName: "some uneditied file name",
          } as unknown as DesktopFile,
          {
            fileId: "some_third_id",
            fileName: "third uneditied file name",
          } as unknown as DesktopFile,
        ],
        setFiles: mockSetFiles,
        fileId: "some_id",
        newFileName: "new file name!",
      });

      clickHandler(mockEvent);

      expect(mockSetFiles).toBeCalledTimes(1);
      expect(mockSetFiles).toBeCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            fileId: "some_other_id",
            fileName: "some uneditied file name",
          }),
          expect.objectContaining({
            fileId: "some_third_id",
            fileName: "third uneditied file name",
          }),
        ]),
      );
    });

    it("noops if the provided file ID is not found in the files", () => {
      const clickHandler = getIconTextSaveHandler({
        files: [
          {
            fileId: "some_id",
          } as unknown as DesktopFile,
          {
            fileId: "some_other_id",
          } as unknown as DesktopFile,
          {
            fileId: "some_third_id",
          } as unknown as DesktopFile,
        ],
        setFiles: mockSetFiles,
        fileId: "not_found_id",
        newFileName: "new file name!",
      });

      clickHandler(mockEvent);

      expect(mockSetFiles).toBeCalledTimes(0);
    });

    it("noops if the provided file ID's textIsEditing state is false", () => {
      const clickHandler = getIconTextSaveHandler({
        files: [
          {
            fileId: "some_id",
            textIsEditing: false,
          } as unknown as DesktopFile,
          {
            fileId: "some_other_id",
            isHighlighted: false,
          } as unknown as DesktopFile,
          {
            fileId: "some_third_id",
            isHighlighted: false,
          } as unknown as DesktopFile,
        ],
        setFiles: mockSetFiles,
        fileId: "some_id",
        newFileName: "new file name!",
      });

      clickHandler(mockEvent);

      expect(mockSetFiles).toBeCalledTimes(0);
    });
  });

  it("when any other key is pressed, does nothing", () => {
    const clickHandler = getIconTextSaveHandler({
      files: [
        {
          fileId: "some_id",
          isHighlighted: true,
          textIsEditing: true,
        } as unknown as DesktopFile,
        {
          fileId: "some_other_id",
          isHighlighted: false,
        } as unknown as DesktopFile,
        {
          fileId: "some_third_id",
          isHighlighted: false,
        } as unknown as DesktopFile,
      ],
      setFiles: mockSetFiles,
      fileId: "some_id",
      newFileName: "new file name!",
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });
});
