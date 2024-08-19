import { CSSProperties, FunctionComponent } from "react";

const DEFAULT_IMAGE = "./assets/images/default.png";

type FactionLogoProps = {
  faction: string;
  style?: CSSProperties | undefined;
  className?: string;
};

export const FactionLogo: FunctionComponent<FactionLogoProps> = ({
  faction,
  style,
  className,
}) => {
  const imagePath = "./assets/images/faction_logos/" + faction + ".png";
  return (
    <object
      data={imagePath}
      type="image/png"
      style={style}
      className={className}
    >
      <img src={DEFAULT_IMAGE} style={style} className={className} alt="" />
    </object>
  );
};
