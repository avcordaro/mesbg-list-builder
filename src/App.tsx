import { Fragment } from "react";
import { Alerts } from "./components/alerts/Alerts";
import { BuilderMode } from "./components/builder-mode/BuilderMode";
import { TopNavbar } from "./components/common/layout/TopNavbar.tsx";
import { GameMode } from "./components/gamemode/GameMode";
import { ModalContainer } from "./components/modal/ModalContainer";
import { SidebarContainer } from "./components/sidebar-drawer/SidebarContainer";
import { useStore } from "./state/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export const App = () => {
  const { gameMode } = useStore();

  // $(window).scroll(function () {
  //     // stops the left-hand options menu from scrolling horizontally
  //     $('.optionsList').css('left', -$(window).scrollLeft() + 24);
  // });

  return (
    <Fragment>
      <TopNavbar />
      <Alerts />
      <main
        style={{
          marginTop: "140px",
          minHeight: "600px",
          minWidth: "100%",
          padding: "1rem",
        }}
      >
        {!gameMode ? <BuilderMode /> : <GameMode />}
      </main>
      <aside>
        <SidebarContainer />
        <ModalContainer />
      </aside>
    </Fragment>
  );
};
