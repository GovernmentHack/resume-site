import { XYCoord } from "react-dnd";
import { Property } from "csstype";

export const getContextMenuModalStyle = (location: XYCoord) => {
  return {
    content: {
      width: "164px",
      bottom: "auto",
      top: location.y,
      left: location.x,
      borderLeft: "2px solid #dfdfdf",
      borderTop: "2px solid #dfdfdf",
      borderRight: "2px solid #7f7f7f",
      borderBottom: "2px solid #7f7f7f",
      backgroundColor: "silver",
      borderRadius: 0,
      padding: "0",
      fontFamily: "px_sans_nouveaux",
      fontSize: "9px",
      zIndex: 10000,
      position: "fixed" as Property.Position,
    },
    overlay: {
      backgroundColor: "unset",
      width: "164px",
      bottom: "auto",
      zIndex: 10000,
    },
  };
};
