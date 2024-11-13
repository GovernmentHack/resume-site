import { vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import * as clickHandlerModule from "./getNewButtonClickHandler";
import { ContextMenu } from ".";

const mockSetWindowNewMenuIsOpen = vi.fn();

const mockNewButtonClickHandler = vi.fn();
vi.spyOn(clickHandlerModule, "getNewButtonClickHandler").mockReturnValue(
  mockNewButtonClickHandler,
);

describe("ContextMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <ContextMenu
        fileId={null}
        windowContextMenuLocation={{ x: 1, y: 1 }}
        setWindowContextMenuIsOpen={mockSetWindowNewMenuIsOpen}
        windowContextMenuIsOpen={true}
      />,
    );

    expect(getByTestId("context_menu_new_button")).toBeDefined();
  });
});
