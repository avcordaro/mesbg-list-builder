import { CSSProperties, FunctionComponent, useState } from "react";

type ImageWithFallbackProps = {
  source: string;
  fallbackImageSource: string;
  alt?: string;
  style?: CSSProperties | undefined;
  className?: string;
};

export const ImageWithFallback: FunctionComponent<ImageWithFallbackProps> = ({
  source,
  fallbackImageSource,
  style,
  className,
  alt = "",
}) => {
  const [usingFallback, setUsingFallback] = useState(false);

  const onError = (e) => {
    if (usingFallback) {
      return;
    }

    e.currentTarget.src = fallbackImageSource;
    setUsingFallback(true);
  };

  return (
    <img
      src={source}
      style={style}
      className={className}
      onError={onError}
      alt={alt}
    />
  );
};
