import { FunctionComponent } from "react";
import fallbackCard from "../../../assets/images/default_card.jpg";
import { ImageWithFallback } from "./ImageWithFallback.tsx";
import { UnitProfileProps } from "./UnitProfilePicture.tsx";

export const UnitProfileCard: FunctionComponent<UnitProfileProps> = ({
  army,
  profile,
}) => {
  return (
    <ImageWithFallback
      source={"./assets/images/profiles/" + army + "/cards/" + profile + ".jpg"}
      fallbackImageSource={fallbackCard}
      className="profile_card"
      alt={`Profile card for ${profile}`}
    />
  );
};
