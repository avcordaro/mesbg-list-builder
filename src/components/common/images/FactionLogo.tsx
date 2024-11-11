import Avatar from "@mui/material/Avatar";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";

type FactionLogoProps = {
  faction: string;
};

export const FactionLogo: FunctionComponent<FactionLogoProps> = ({
  faction,
}) => (
  <Avatar
    alt={`${faction} logo`}
    src={"./assets/images/faction_logos/" + faction + ".png"}
    sx={{
      width: 24,
      height: 24,
      display: "inline-block",
      backgroundColor: "transparent",
      "& .image": {
        filter:
          "invert(1) sepia(1) saturate(1000%) hue-rotate(200deg) brightness(0.8)",
      },
    }}
  >
    <Avatar
      alt={`${faction} logo`}
      src={fallbackLogo}
      sx={{
        width: 24,
        height: 24,
        display: "inline-block",
        backgroundColor: "transparent",
      }}
    />
  </Avatar>
);
