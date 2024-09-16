import { ReactNode } from "react";
import { Alliances } from "./drawers/Alliances.tsx";
import { KeywordsSearch } from "./drawers/KeywordsSearch.tsx";
import { NewEditionNews } from "./drawers/NewEditionNews.tsx";

export enum DrawerTypes {
  ALLIANCE = "ALLIANCE",
  NEW_EDITION_NEWS = "NEW_EDITION_NEWS",
  KEYWORD_SEARCH = "KEYWORD_SEARCH",
}

export type DrawerProps = {
  children: ReactNode;
  title: string;
};

export const drawers = new Map<DrawerTypes, DrawerProps>([
  [
    DrawerTypes.NEW_EDITION_NEWS,
    {
      title: "The New Edition of MESBG",
      children: <NewEditionNews />,
    },
  ],
  [
    DrawerTypes.ALLIANCE,
    {
      title: "Alliances",
      children: <Alliances />,
    },
  ],
  [
    DrawerTypes.KEYWORD_SEARCH,
    {
      title: "Keyword search",
      children: <KeywordsSearch />,
    },
  ],
]);
