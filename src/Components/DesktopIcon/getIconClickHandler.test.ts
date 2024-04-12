import { describe, it, expect, vi, beforeEach } from "vitest";
import { getIconClickHandler } from "./getIconClickHandler";
import { DesktopFile } from "../../utils/types";

const mockSetFiles = vi.fn();
const mockEvent = {
  stopPropagation: vi.fn(),
} as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getIconClickHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a function that toggles the selected file's highlighted state", () => {
    const clickHandler = getIconClickHandler({
      files: [
        {
          fileId: "some_id",
          isHighlighted: false,
        } as unknown as DesktopFile,
      ],
      setFiles: mockSetFiles,
      fileId: "some_id",
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isHighlighted: true,
          fileId: "some_id",
        }),
      ]),
    );
  });

  it("returns a function that ignores other files when changing file based on provided fileId", () => {
    const clickHandler = getIconClickHandler({
      files: [
        {
          fileId: "some_id",
          isHighlighted: false,
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
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(1);
    expect(mockSetFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          isHighlighted: false,
          fileId: "some_other_id",
        }),
        expect.objectContaining({
          isHighlighted: false,
          fileId: "some_third_id",
        }),
      ]),
    );
  });

  it("returns a function that noops if the provided file ID is not found in the files", () => {
    const clickHandler = getIconClickHandler({
      files: [
        {
          fileId: "some_id",
          isHighlighted: false,
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
      fileId: "not_found_id",
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });
});
