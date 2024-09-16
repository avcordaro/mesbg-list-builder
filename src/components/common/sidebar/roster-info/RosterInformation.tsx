import ConstructionIcon from "@mui/icons-material/Construction";
import FortIcon from "@mui/icons-material/Fort";
import { useStore } from "../../../../state/store.ts";
import { SidebarContainer } from "../../layout/SidebarContainer.tsx";
import { Alliance } from "./sections/Alliances.tsx";
import { ArmyBonuses } from "./sections/ArmyBonuses.tsx";
import { BowLimits } from "./sections/BowLimit.tsx";
import { IsengardBreakpoint } from "./sections/IsengardBreakpoint.tsx";
import { RosterWarnings } from "./sections/RosterWarnings.tsx";

export const RosterInformation = () => {
  const { gameMode } = useStore();
  return (
    <>
      {gameMode ? (
        <SidebarContainer title="Game Mode" icon={<FortIcon />}>
          <IsengardBreakpoint />
          <Alliance />
          <ArmyBonuses />
        </SidebarContainer>
      ) : (
        <SidebarContainer title="Builder Mode" icon={<ConstructionIcon />}>
          <RosterWarnings />
          <Alliance />
          <BowLimits />
          <ArmyBonuses />
        </SidebarContainer>
      )}
    </>
  );
};
