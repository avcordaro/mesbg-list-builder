import { CSSProperties, FunctionComponent } from "react";
import { ImageWithFallback } from "./ImageWithFallback.tsx";

export type UnitProfileProps = {
  army: string;
  profile: string;
  style?: CSSProperties | undefined;
  className?: string;
};

export const UnitProfilePicture: FunctionComponent<UnitProfileProps> = ({
  army,
  profile,
  style,
  className,
}) => {
  return (
    <ImageWithFallback
      source={
        "./assets/images/profiles/" + army + "/pictures/" + profile + ".png"
      }
      fallbackImageSource="./assets/images/default.png"
      style={style}
      className={className}
      alt={`Profile picture for ${profile}`}
    />
  );
};
