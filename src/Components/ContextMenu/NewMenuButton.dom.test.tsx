import { vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { FileContext } from "../../App";
import { NewMenuButton } from "./NewMenuButton";

const mockSetWindowNewMenuIsOpen = vi.fn();

describe("NewMenuButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <NewMenuButton
          fileId={null}
          windowContextMenuLocation={{ x: 1, y: 1 }}
          setWindowContextMenuIsOpen={mockSetWindowNewMenuIsOpen}
        />
      </FileContext.Provider>,
    );

    expect(getByTestId("context_menu_new_button")).toBeDefined();
  });

  it("shows the submenu on mouseEnter and hides on mouseLeave", () => {
    const { getByTestId } = render(
      <FileContext.Provider
        value={{
          files: [],
          setFiles: vi.fn(),
          loading: false,
          setLoading: vi.fn(),
        }}
      >
        <NewMenuButton
          fileId={null}
          windowContextMenuLocation={{ x: 1, y: 1 }}
          setWindowContextMenuIsOpen={mockSetWindowNewMenuIsOpen}
        />
      </FileContext.Provider>,
    );

    const newMenuButton = getByTestId("context_menu_new_button");
    fireEvent.mouseEnter(newMenuButton);

    expect(getByTestId("context_menu_new_folder_button")).toBeDefined();
    expect(getByTestId("context_menu_new_textfile_button")).toBeDefined();

    fireEvent.mouseLeave(newMenuButton);

    expect(() => getByTestId("context_menu_new_folder_button")).toThrowError();
    expect(() =>
      getByTestId("context_menu_new_textfile_button"),
    ).toThrowError();
  });
});
