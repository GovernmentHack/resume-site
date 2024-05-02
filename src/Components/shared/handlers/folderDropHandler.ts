import { DesktopFile, FileDragItem, Folder, TextFile } from "../../../types";
import { DropTargetHookSpec, DropTargetMonitor, XYCoord } from "react-dnd";

type GetFolderDropHandlerParams = {
  files: DesktopFile[];
  setFiles: React.Dispatch<React.SetStateAction<DesktopFile[]>>;
  targetFileId: string;
  windowLocation?: TextFile["windowLocation"] | Folder["windowLocation"];
};

export function getFolderDropHandler({
  files,
  setFiles,
  targetFileId,
  windowLocation,
}: GetFolderDropHandlerParams): NonNullable<
  DropTargetHookSpec<
    FileDragItem,
    unknown,
    { canDrop: boolean; isOver: boolean; dropLocation: XYCoord | null }
  >["drop"]
> {
  return (
    item: FileDragItem,
    monitor: DropTargetMonitor<FileDragItem, unknown>,
  ) => {
    const endLocation = monitor.getSourceClientOffset();
    if (item.fileId === targetFileId) {
      // Ignore attempts to make a recursive folder. lol.
      return;
    }
    const fileToChange = files.find((file) => file.fileId === item.fileId);
    const otherFiles = files.filter((file) => file.fileId !== item.fileId);
    if (fileToChange && endLocation) {
      let relativeLocation: XYCoord;
      if (windowLocation) {
        relativeLocation = {
          x: endLocation.x - windowLocation.x,
          y: endLocation.y - windowLocation.y,
        };
        // Sort of a "debouncing"
        if (relativeLocation.y < 81 || relativeLocation.x < 2) {
          return;
        }
      } else {
        relativeLocation = getNewIconLocation(
          otherFiles.filter((file) => file.directory === targetFileId),
        );
      }
      setFiles([
        ...otherFiles,
        {
          ...fileToChange,
          location: relativeLocation,
          directory: targetFileId,
        },
      ]);
    }
  };
}

// TODO: fix this... this algorithm is crap. lol
/**
 * Returns a new location that won't overlap any files passed in as parameters
 * @param files - The list of files to use for locations to not conflict with
 * @returns - a valid location that wont conflict witht he input files
 */
function getNewIconLocation(files: DesktopFile[]): XYCoord {
  let x = 8;
  let y = 96;
  const invalidXs = files.map((file) => file.location.x).sort((a, b) => a - b);
  const invalidYs = files.map((file) => file.location.y).sort((a, b) => a - b);
  for (const invalidX of invalidXs) {
    if (x >= invalidX && x <= invalidX + 64) {
      x += 64;
    } else {
      break;
    }
  }
  for (const invalidY of invalidYs) {
    if (y >= invalidY && y <= invalidY + 80) {
      y += 64;
    } else {
      break;
    }
  }
  return {
    x,
    y,
  };
}
