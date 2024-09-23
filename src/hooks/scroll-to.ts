export const useScrollToElement = () => {
  return function (scrollId: string, offset: number = 70) {
    const element = document
      .querySelectorAll(`[data-scroll-id="${scrollId}"]`)
      .item(0);
    if (!element) {
      console.error(`No element with scroll-id="${scrollId}".`);
      return;
    }
    const { top } = element.getBoundingClientRect();
    const y = top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
};

export const useScrollToTop = (topOf: "sidebar" | "page" = "page") => {
  const scrollToElement = useScrollToElement();
  return function () {
    if (topOf === "page") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      scrollToElement("sidebar");
    }
  };
};
