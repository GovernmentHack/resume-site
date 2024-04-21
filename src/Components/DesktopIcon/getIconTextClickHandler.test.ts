import { describe, it, expect, vi, beforeEach } from "vitest";
import { DesktopFile } from "../../types";
import { getIconTextClickHandler } from "./getIconTextClickHandler";

const mockSetFiles = vi.fn();
const mockEvent = {
  stopPropagation: vi.fn(),
} as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>;

describe("getIconTextClickHandler returns a function that... ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("toggles the selected file's isTextEditing state if the isTextEditing is false and the file is highlighted", () => {
    const clickHandler = getIconTextClickHandler({
      files: [
        {
          fileId: "some_id",
          textIsEditing: false,
          isHighlighted: true,
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
          textIsEditing: true,
          fileId: "some_id",
        }),
      ]),
    );
  });

  it("changes other files textIsEditing to false when changing file based on provided fileId", () => {
    const clickHandler = getIconTextClickHandler({
      files: [
        {
          fileId: "some_id",
          textIsEditing: false,
          isHighlighted: true,
        } as unknown as DesktopFile,
        {
          fileId: "some_other_id",
          textIsEditing: true,
          isHighlighted: false,
        } as unknown as DesktopFile,
        {
          fileId: "some_third_id",
          textIsEditing: true,
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
          textIsEditing: false,
          fileId: "some_other_id",
        }),
        expect.objectContaining({
          textIsEditing: false,
          fileId: "some_third_id",
        }),
      ]),
    );
  });

  it("noops if the provided file ID is not found in the files", () => {
    const clickHandler = getIconTextClickHandler({
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

  it("noops if the provided file ID is found but not highlighted", () => {
    const clickHandler = getIconTextClickHandler({
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

    expect(mockSetFiles).toBeCalledTimes(0);
  });

  it("noops if the provided file ID is found and highlighted bbut is already textEditing", () => {
    const clickHandler = getIconTextClickHandler({
      files: [
        {
          fileId: "some_id",
          isHighlighted: false,
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
    });

    clickHandler(mockEvent);

    expect(mockSetFiles).toBeCalledTimes(0);
  });
});
