import { vi } from "vitest";
import { getResumeFiles } from "./resumeFileGenerator";
import { FILE_TYPE } from "./shared/constants";

const rootDirectoryUrl =
  "https://api.github.com/repos/GovernmentHack/resume-site/contents";

/**
 * Mock git directory structure:
 *
 * resume
 *  ├─subDir
 *  │  └─subFile
 *  └─otherSubDir
 *     ├─anotherSubFile
 *     └─anotherSubDirectory
 *        ├─deepSubFile
 *        └─deepSubFile2
 */

const mockSubDir = {
  name: "subDir",
  path: "src/resume/subDir",
  download_url: null,
  type: "dir",
};

const mockSubFile = {
  name: "subFile",
  path: `${mockSubDir.path}/subFile`,
  download_url: "subFile",
  type: "file",
};

const mockSubFileContent = "some content";

const mockOtherSubDir = {
  name: "otherSubDir",
  path: "src/resume/otherSubDir",
  download_url: null,
  type: "dir",
};

const mockAnotherSubFile = {
  name: "anotherSubFile",
  path: `${mockOtherSubDir.path}/anotherSubFile`,
  download_url: "anotherSubFile",
  type: "file",
};

const mockAnotherSubFileContent = "another content";

const mockAnotherSubDirectory = {
  name: "anotherSubDirectory",
  path: `${mockOtherSubDir.path}/anotherSubDirectory`,
  download_url: null,
  type: "dir",
};

const mockDeepSubFile = {
  name: "deepSubFile",
  path: `${mockAnotherSubDirectory.path}/deepSubFile`,
  download_url: "deepSubFile",
  type: "file",
};

const mockDeepSubFileContent = "deep sub file content";

const mockDeepSubFile2 = {
  name: "deepSubFile2",
  path: `${mockAnotherSubDirectory.path}/deepSubFile2`,
  download_url: "deepSubFile2",
  type: "file",
};

const mockDeepSubFile2Content = "some more deep sub file content";

const mocks = vi.hoisted(() => {
  return {
    get: vi.fn().mockImplementation(async (path: string) => {
      switch (path) {
        case `${rootDirectoryUrl}/src/resume`:
          return {
            data: [mockSubDir, mockOtherSubDir],
          };
        case `${rootDirectoryUrl}/${mockSubDir.path}`:
          return {
            data: [mockSubFile],
          };
        case `${rootDirectoryUrl}/${mockOtherSubDir.path}`:
          return {
            data: [mockAnotherSubFile, mockAnotherSubDirectory],
          };
        case `${rootDirectoryUrl}/${mockAnotherSubDirectory.path}`:
          return {
            data: [mockDeepSubFile, mockDeepSubFile2],
          };
        case mockSubFile.download_url:
          return {
            data: mockSubFileContent,
          };
        case mockAnotherSubFile.download_url:
          return {
            data: mockAnotherSubFileContent,
          };
        case mockDeepSubFile.download_url:
          return {
            data: mockDeepSubFileContent,
          };
        case mockDeepSubFile2.download_url:
          return {
            data: mockDeepSubFile2Content,
          };
        default:
          return undefined;
      }
    }),
  };
});

vi.mock("axios", () => {
  return {
    default: {
      get: mocks.get,
    },
  };
});

describe("getResumeFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches files from github, and returns a file for every file, and folder for every directory", async () => {
    const files = await getResumeFiles();

    expect(files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fileName: mockSubDir.name,
          type: FILE_TYPE.folder,
        }),
        expect.objectContaining({
          fileName: mockSubFile.name,
          type: FILE_TYPE.textFile,
          content: mockSubFileContent,
        }),
        expect.objectContaining({
          fileName: mockOtherSubDir.name,
          type: FILE_TYPE.folder,
        }),
        expect.objectContaining({
          fileName: mockAnotherSubFile.name,
          type: FILE_TYPE.textFile,
          content: mockAnotherSubFileContent,
        }),
        expect.objectContaining({
          fileName: mockAnotherSubDirectory.name,
          type: FILE_TYPE.folder,
        }),
        expect.objectContaining({
          fileName: mockDeepSubFile.name,
          type: FILE_TYPE.textFile,
          content: mockDeepSubFileContent,
        }),
        expect.objectContaining({
          fileName: mockDeepSubFile2.name,
          type: FILE_TYPE.textFile,
          content: mockDeepSubFile2Content,
        }),
      ]),
    );
  });
});
