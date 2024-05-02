import { vi } from "vitest";
import { getMockFolder, getMockTextFile } from "../../../testUtils";
import { getFolderDropHandler } from "./folderDropHandler";
import { DropTargetMonitor } from "react-dnd";
import { FileDragItem } from "../../../types";

const mockSetFiles = vi.fn();
const mockFolder = getMockFolder();
const mockTextFile = getMockTextFile();
const mockGetSourceClientOffset = vi.fn();
const mockMonitor = {
  getSourceClientOffset: mockGetSourceClientOffset,
} as unknown as DropTargetMonitor<FileDragItem, unknown>;

describe("getFolderDropHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSourceClientOffset.mockReturnValue({
      x: 500,
      y: 500,
    });
  });

  it("when target is a window, will update the dragged file directory and location attributes", () => {
    const folderDropHandler = getFolderDropHandler({
      files: [mockFolder, mockTextFile],
      setFiles: mockSetFiles,
      targetFileId: mockFolder.fileId,
      windowLocation: mockFolder.windowLocation,
    });

    folderDropHandler(
      { fileId: mockTextFile.fileId, type: mockTextFile.type },
      mockMonitor,
    );

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fileId: mockTextFile.fileId,
          directory: mockFolder.fileId,
          location: {
            x: 500 - mockFolder.windowLocation.x,
            y: 500 - mockFolder.windowLocation.y,
          },
        }),
      ]),
    );
  });

  it("when target is an icon, will update the dragged file directory and location attributes", () => {
    const folderDropHandler = getFolderDropHandler({
      files: [mockFolder, mockTextFile],
      setFiles: mockSetFiles,
      targetFileId: mockFolder.fileId,
    });

    folderDropHandler(
      { fileId: mockTextFile.fileId, type: mockTextFile.type },
      mockMonitor,
    );

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fileId: mockTextFile.fileId,
          directory: mockFolder.fileId,
          location: {
            x: 8,
            y: 96,
          },
        }),
      ]),
    );
  });
});
