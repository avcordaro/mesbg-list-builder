import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useScrollToElement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return function (scrollId: string, offset: number = 70) {
    if (!isMobile) return;
    const element = document
      .querySelectorAll(`[data-scroll-id="${scrollId}"]`)
      .item(0);
    if (!element) {
      console.error(`No element with scroll-id="${scrollId}".`);
      return;
    }
    const { top } = element.getBoundingClientRect();
    const y = top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "instant" });
  };
};

export const useScrollToTop = (topOf: "sidebar" | "page" = "page") => {
  const scrollToElement = useScrollToElement();
  return function () {
    if (topOf === "page") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    } else {
      scrollToElement("sidebar");
    }
  };
};
