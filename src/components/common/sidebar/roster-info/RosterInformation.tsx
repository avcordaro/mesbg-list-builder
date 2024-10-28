import ConstructionIcon from "@mui/icons-material/Construction";
import FortIcon from "@mui/icons-material/Fort";
import { useGameModeState } from "../../../../state/gamemode";
import { SidebarContainer } from "../../layout/SidebarContainer.tsx";
import { Alliance } from "./sections/Alliances.tsx";
import { ArmyBonuses } from "./sections/ArmyBonuses.tsx";
import { BowLimits } from "./sections/BowLimit.tsx";
import { IsengardBreakpoint } from "./sections/IsengardBreakpoint.tsx";
import { RosterWarnings } from "./sections/RosterWarnings.tsx";
import { SelectRoster } from "./sections/SelectRoster.tsx";

export const RosterInformation = () => {
  const { gameMode } = useGameModeState();
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
          <SelectRoster />
          <RosterWarnings />
          <Alliance />
          <BowLimits />
          <ArmyBonuses />
        </SidebarContainer>
      )}
    </>
  );
};
