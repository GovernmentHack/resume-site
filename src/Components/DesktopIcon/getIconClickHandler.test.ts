import { describe, it, expect, vi, beforeEach } from "vitest";
import { getIconClickHandler } from "./getIconClickHandler";
import { DesktopFile } from "../../types";

const mockSetFiles = vi.fn();
const mockEvent = {
  stopPropagation: vi.fn(),
} as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getIconClickHandler returns a function that...", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("halts the event propigation", () => {
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

    expect(mockEvent.stopPropagation).toBeCalledTimes(1);
  });
  it("toggles the selected file's highlighted state", () => {
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

  it("unhighlights other files when changing file based on provided fileId", () => {
    const clickHandler = getIconClickHandler({
      files: [
        {
          fileId: "some_id",
          isHighlighted: false,
        } as unknown as DesktopFile,
        {
          fileId: "some_other_id",
          isHighlighted: true,
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

  it("noops if the provided file ID is not found in the files", () => {
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
