import { ReactNode } from "react";
import { Alliances } from "./sidebars/Alliances.tsx";
import { NewEditionNews } from "./sidebars/NewEditionNews.tsx";

export enum SidebarTypes {
  ALLIANCE = "ALLIANCE",
  NEW_EDITION_NEWS = "NEW_EDITION_NEWS",
  KEYWORD_SEARCH = "KEYWORD_SEARCH",
}

export type SidebarProps = {
  children: ReactNode;
  title: string;
};

export const sidebars = new Map<SidebarTypes, SidebarProps>([
  [
    SidebarTypes.NEW_EDITION_NEWS,
    {
      title: "The New Edition of MESBG",
      children: <NewEditionNews />,
    },
  ],
  [
    SidebarTypes.ALLIANCE,
    {
      title: "Alliances",
      children: <Alliances />,
    },
  ],
]);
