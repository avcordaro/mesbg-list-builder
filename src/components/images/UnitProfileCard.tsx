import { FunctionComponent } from "react";
import { ImageWithFallback } from "./ImageWithFallback.tsx";
import { UnitProfileProps } from "./UnitProfilePicture.tsx";

export const UnitProfileCard: FunctionComponent<UnitProfileProps> = ({
  army,
  profile,
  style,
  className,
}) => {
  return (
    <ImageWithFallback
      source={"./assets/images/profiles/" + army + "/cards/" + profile + ".jpg"}
      fallbackImageSource="./assets/images/default_card.jpg"
      style={style}
      className={className}
      alt={`Profile card for ${profile}`}
    />
  );
};
