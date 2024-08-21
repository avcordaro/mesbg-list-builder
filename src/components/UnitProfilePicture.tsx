import { CSSProperties, FunctionComponent } from "react";
import { ImageWithFallback } from "./ImageWithFallback.tsx";

type UnitProfilePictureProps = {
  army: string;
  profile: string;
  style?: CSSProperties | undefined;
  className?: string;
};

export const UnitProfilePicture: FunctionComponent<UnitProfilePictureProps> = ({
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
    />
  );
};

export const UnitProfileCard: FunctionComponent<UnitProfilePictureProps> = ({
  army,
  profile,
  style,
  className,
}) => {
  return (
    <ImageWithFallback
      source={"./assets/images/profiles/" + army + "/cards/" + profile + ".jpg"}
      fallbackImageSource="./assets/images/default.png"
      style={style}
      className={className}
    />
  );
};
