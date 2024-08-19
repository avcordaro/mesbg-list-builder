import { CSSProperties, FunctionComponent } from "react";

const DEFAULT_IMAGE = "./assets/images/default.png";

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
  const imagePath =
    "./assets/images/profiles/" + army + "/pictures/" + profile + ".png";
  return (
    <object
      data={imagePath}
      type="image/png"
      style={style}
      className={className}
    >
      <img src={DEFAULT_IMAGE} className={className} style={style} alt="" />
    </object>
  );
};

export const UnitProfileCard: FunctionComponent<UnitProfilePictureProps> = ({
  army,
  profile,
  style,
  className,
}) => {
  const imagePath =
    "./assets/images/profiles/" + army + "/cards/" + profile + ".jpg";
  return (
    <object
      className={className}
      data={imagePath}
      type="image/png"
      style={style}
    >
      <img src={DEFAULT_IMAGE} className={className} style={style} alt="" />
    </object>
  );
};
