import { vi } from "vitest";
import { getMockFolder } from "../../../testUtils";
import { getMinimizeClickHandler } from "./minimizeClickHandler";

const mockSetFiles = vi.fn();
const mockFolder = getMockFolder();
const mockEvent = {
  stopPropagation: vi.fn(),
} as any as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getMinimizeClickHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stops event propigation", () => {
    const minimizeClickHandler = getMinimizeClickHandler({
      files: [mockFolder],
      setFiles: mockSetFiles,
      fileId: mockFolder.fileId,
    });

    minimizeClickHandler(mockEvent);

    expect(mockEvent.stopPropagation).toBeCalledTimes(1);
  });
  it("doesn't call setFiles if the fileId doesn't match", () => {
    const minimizeClickHandler = getMinimizeClickHandler({
      files: [mockFolder],
      setFiles: mockSetFiles,
      fileId: "some_other_file_id",
    });

    minimizeClickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });

  it("calls setFiles with the file to change", () => {
    const minimizeClickHandler = getMinimizeClickHandler({
      files: [mockFolder],
      setFiles: mockSetFiles,
      fileId: mockFolder.fileId,
    });

    minimizeClickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isOpen: false,
          isMinimized: true,
          fileId: mockFolder.fileId,
          windowIsFocused: false,
        }),
      ]),
    );
  });
});
