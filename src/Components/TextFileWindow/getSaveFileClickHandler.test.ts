import { vi } from "vitest";
import { getMockTextFile } from "../../utils/testUtils";
import { getSaveFileClickHandler } from "./getSaveFileClickHandler";

const mockSetFiles = vi.fn();
const mockCloseMenu = vi.fn();
const mockTextFile = getMockTextFile();
const mockEvent = {
  stopPropagation: vi.fn(),
} as any as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getSaveFilelickHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stops event propigation", () => {
    const saveClickHandler = getSaveFileClickHandler({
      files: [mockTextFile],
      setFiles: mockSetFiles,
      fileId: mockTextFile.fileId,
      newContent: "some new text",
      closeMenu: mockCloseMenu,
    });

    saveClickHandler(mockEvent);

    expect(mockEvent.stopPropagation).toBeCalledTimes(1);
  });

  it("calls the closeMenu callback", () => {
    const saveClickHandler = getSaveFileClickHandler({
      files: [mockTextFile],
      setFiles: mockSetFiles,
      fileId: mockTextFile.fileId,
      newContent: "some new text",
      closeMenu: mockCloseMenu,
    });

    saveClickHandler(mockEvent);

    expect(mockCloseMenu).toBeCalledTimes(1);
  });
  it("doesn't call setFiles if the fileId doesn't match", () => {
    const saveClickHandler = getSaveFileClickHandler({
      files: [mockTextFile],
      setFiles: mockSetFiles,
      fileId: "some_other_file_id",
      newContent: "some new text",
      closeMenu: mockCloseMenu,
    });

    saveClickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });

  it("calls setFiles with the file to change", () => {
    const saveClickHandler = getSaveFileClickHandler({
      files: [mockTextFile],
      setFiles: mockSetFiles,
      fileId: mockTextFile.fileId,
      newContent: "some new text",
      closeMenu: mockCloseMenu,
    });

    saveClickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          content: "some new text",
          fileId: mockTextFile.fileId,
        }),
      ]),
    );
  });
});
