import { CSSProperties, FunctionComponent } from "react";
import { ImageWithFallback } from "./ImageWithFallback.tsx";

type FactionLogoProps = {
  faction: string;
  style?: CSSProperties | undefined;
  className?: string;
};

export const FactionLogo: FunctionComponent<FactionLogoProps> = ({
  faction,
  style,
  className,
}) => (
  <ImageWithFallback
    source={"./assets/images/faction_logos/" + faction + ".png"}
    fallbackImageSource="./assets/images/default.png"
    style={style}
    className={className}
  />
);
