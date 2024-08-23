import Offcanvas from "react-bootstrap/Offcanvas";
import { useStore } from "../../state/store.ts";
import { sidebars } from "./sidebars.tsx";

export const SidebarContainer = () => {
  const state = useStore();

  if (!state.currentlyOpenendSidebar) {
    // No sidebar is opened, return...
    return null;
  }

  const currentSidebar = sidebars.get(state.currentlyOpenendSidebar);
  return (
    <Offcanvas show={true} onHide={() => state.closeSidebar()}>
      <Offcanvas.Header className="border border-secondary" closeButton>
        <Offcanvas.Title>
          <b>{currentSidebar.title}</b>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>{currentSidebar.children}</Offcanvas.Body>
    </Offcanvas>
  );
};
