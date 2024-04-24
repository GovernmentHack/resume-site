import { vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import React, { ReactNode } from "react";
import App from "./App";
import * as resumeFileGeneratorModule from "./utils/resumeFileGenerator";

const mocks = vi.hoisted(() => {
  return {
    useDrop: vi.fn(),
    useDrag: vi.fn(),
    shortcutContent: vi.fn(),
    DndProvider: vi.fn(),
    HTML5Backend: "mock_HTML5Backend",
    TouchBackend: "mock_TouchBackend",
    v4: vi.fn().mockReturnValue("mock_id"),
  };
});

vi.mock("uuid", () => {
  return {
    v4: mocks.v4,
  };
});

vi.mock("react-dnd-html5-backend", () => {
  return {
    HTML5Backend: mocks.HTML5Backend,
  };
});

vi.mock("react-dnd-touch-backend", () => {
  return {
    TouchBackend: mocks.TouchBackend,
  };
});

vi.mock("react-dnd", () => {
  return {
    useDrop: mocks.useDrop,
    useDrag: mocks.useDrag,
    DndProvider: mocks.DndProvider,
  };
});

const mockGetResumeFiles = vi.spyOn(
  resumeFileGeneratorModule,
  "getResumeFiles",
);

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mocks.useDrop.mockReturnValue([{ isDragging: false }, React.createRef()]);
    mocks.useDrag.mockReturnValue([{ isDragging: false }, React.createRef()]);
    mocks.DndProvider.mockImplementation(
      ({ children }: { children: ReactNode }) => <div>{children}</div>,
    );
  });

  it("renders down to the desktop", () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId("desktop")).toBeDefined();
  });

  it("renders the resume shortcut, which fetches the resume files", () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId("mock_id_file_icon")).toBeDefined();

    act(() => {
      fireEvent.doubleClick(getByTestId("mock_id_file_icon"));
      vi.runAllTimers();
    });

    expect(mockGetResumeFiles).toBeCalledTimes(1);
  });

  describe("initiates the DnDContext", () => {
    it("with the touch backend if ontouchstart is in the window", () => {
      window.ontouchstart = vi.fn();

      render(<App />);

      expect(mocks.DndProvider).toBeCalledWith(
        expect.objectContaining({
          backend: mocks.TouchBackend,
          context: window,
          options: { enableMouseEvents: true },
        }),
        {}, // second argument to a React constructor... unsure what it is 🤷
      );
    });

    it("with the touch backend if the navigator has maxTouchPoints", () => {
      delete window.ontouchstart;
      window.navigator = { maxTouchPoints: 4 } as typeof window.navigator;

      render(<App />);

      expect(mocks.DndProvider).toBeCalledWith(
        expect.objectContaining({
          backend: mocks.TouchBackend,
          context: window,
          options: { enableMouseEvents: true },
        }),
        {}, // second argument to a React constructor... unsure what it is 🤷
      );
    });

    it("with the html5 backend if ontouchstart is not window", () => {
      delete window.ontouchstart;
      window.navigator = { maxTouchPoints: 0 } as typeof window.navigator;

      render(<App />);

      expect(mocks.DndProvider).toBeCalledWith(
        expect.objectContaining({
          backend: mocks.HTML5Backend,
          context: window,
          options: { enableMouseEvents: true },
        }),
        {}, // second argument to a React constructor... unsure what it is 🤷
      );
    });
  });
});
