import Avatar from "@mui/material/Avatar";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";

export type UnitProfileProps = {
  army: string;
  profile: string;
  size?: "normal" | "smaller";
  opacity?: number;
};

export const UnitProfilePicture: FunctionComponent<UnitProfileProps> = ({
  army,
  profile,
  size = "normal",
  opacity = 100,
}) => {
  const sizeUnits = size === "normal" ? 100 : 75;
  return (
    <Avatar
      alt={`Profile picture for ${profile}`}
      src={"./assets/images/profiles/" + army + "/pictures/" + profile + ".png"}
      sx={{
        width: sizeUnits,
        height: sizeUnits,
        backgroundColor: "transparent",
        opacity: opacity / 100,
      }}
    >
      <Avatar
        alt={`Profile picture for ${profile}`}
        src={fallbackLogo}
        sx={{
          width: sizeUnits,
          height: sizeUnits,
          backgroundColor: "transparent",
          opacity: opacity / 100,
        }}
      />
    </Avatar>
  );
};
