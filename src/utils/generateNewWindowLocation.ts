import { XYCoord } from "react-dnd";
import { DesktopFile } from "./types";
import { INITIAL_WINDOW_LOCATION } from "../Components/Desktop";

export function generateNewWindowLocation(files: DesktopFile[]): XYCoord {
  return files.reduce<XYCoord>((proposedLocation, currentFile) => {
    if (currentFile.type === "shortcut") {
      return proposedLocation;
    }
    const diffX = Math.abs(proposedLocation.x - currentFile.windowLocation.x);
    const diffY = Math.abs(proposedLocation.y - currentFile.windowLocation.y);
    if (diffX > 8 || diffY > 8) {
      return proposedLocation;
    }
    return {
      x: proposedLocation.x + 10,
      y: proposedLocation.y + 10,
    };
  }, INITIAL_WINDOW_LOCATION);
}
