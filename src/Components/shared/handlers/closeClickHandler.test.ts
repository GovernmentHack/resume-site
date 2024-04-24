import { vi } from "vitest";
import { getCloseClickHandler } from "./closeClickHandler";
import { getMockFolder } from "../../../testUtils";

const mockSetFiles = vi.fn();
const mockFolder = getMockFolder();
const mockEvent = {
  stopPropagation: vi.fn(),
} as any as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getCloseClickHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stops event propigation", () => {
    const closeClickHandler = getCloseClickHandler({
      files: [mockFolder],
      setFiles: mockSetFiles,
      fileId: mockFolder.fileId,
    });

    closeClickHandler(mockEvent);

    expect(mockEvent.stopPropagation).toBeCalledTimes(1);
  });
  it("doesn't call setFiles if the fileId doesn't match", () => {
    const closeClickHandler = getCloseClickHandler({
      files: [mockFolder],
      setFiles: mockSetFiles,
      fileId: "some_other_file_id",
    });

    closeClickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });

  it("calls setFiles with the file to change", () => {
    const closeClickHandler = getCloseClickHandler({
      files: [mockFolder],
      setFiles: mockSetFiles,
      fileId: mockFolder.fileId,
    });

    closeClickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isOpen: false,
          fileId: mockFolder.fileId,
        }),
      ]),
    );
  });
});
