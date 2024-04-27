import { vi } from "vitest";
import { getMockFolder, getMockTextFile } from "../../../testUtils";
import { getWindowFocusClickHandler } from "./windowFocusClickHandler";

const mockSetFiles = vi.fn();
const mockFolder = getMockFolder();
const mockFile = getMockTextFile();

describe("windowFocusClickHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets the given window as focused", () => {
    const windowFocusClickHandler = getWindowFocusClickHandler({
      files: [mockFolder, mockFile],
      setFiles: mockSetFiles,
      fileId: mockFolder.fileId,
    });

    windowFocusClickHandler();

    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          fileId: mockFolder.fileId,
          windowIsFocused: true,
        }),
      ]),
    );
  });

  it("does nothing if the clicked window is already focused", () => {
    const windowFocusClickHandler = getWindowFocusClickHandler({
      files: [{ ...mockFolder, windowIsFocused: true }, mockFile],
      setFiles: mockSetFiles,
      fileId: mockFolder.fileId,
    });

    windowFocusClickHandler();

    expect(mockSetFiles).not.toBeCalled();
  });
});
