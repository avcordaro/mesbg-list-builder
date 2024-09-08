import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FaSearch } from "react-icons/fa";
import { FaHammer } from "react-icons/fa6";
import { FcCheckmark } from "react-icons/fc";
import { IoWarningOutline } from "react-icons/io5";
import { LuSwords } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { allianceColours } from "../../../../constants/alliances.ts";
import { wanderers } from "../../../../constants/wanderers.ts";
import { useFactionData } from "../../../../hooks/faction-data.ts";
import { useStore } from "../../../../state/store.ts";
import { Faction } from "../../../../types/factions.ts";
import { SidebarTypes } from "../../../sidebar-drawer/sidebars.tsx";

export const RosterInformation = () => {
  const {
    openSidebar,
    rosterBuildingWarnings: warnings,
    factions: factionList,
    factionMetaData,
    allianceLevel,
    factionType,
    armyBonusActive: hasArmyBonus,
  } = useStore();
  const factionData = useFactionData();
  return (
    <div>
      <Stack className="mb-5" direction="horizontal">
        <h4 className="m-0">
          <FaHammer /> Builder Mode
        </h4>
        <Button
          variant="light"
          className="ms-auto border shadow-sm"
          onClick={() => openSidebar(SidebarTypes.KEYWORD_SEARCH)}
        >
          <FaSearch /> Search Keywords
        </Button>
      </Stack>
      {warnings.length > 0 && (
        <>
          <h6>
            <IoWarningOutline /> Warnings
          </h6>
          <hr />
          {warnings.map((w, i) => (
            <p key={i} className="text-danger">
              {w}
            </p>
          ))}
        </>
      )}
      <h6>Bow Limit</h6>
      <hr />
      {factionList
        .filter((x) => !wanderers.includes(x))
        .map((f: Faction) => (
          <p
            key={f}
            className={
              factionMetaData[f].modelsWithBow >
              Math.ceil(
                factionData[f]["bow_limit"] *
                  factionMetaData[f].modelsThatCountForBowLimit,
              )
                ? "text-danger"
                : "text-dark"
            }
          >
            <b>{f}:</b>
            {" (" +
              factionData[f]["bow_limit"] * 100 +
              "% limit - " +
              Math.ceil(
                factionData[f]["bow_limit"] *
                  factionMetaData[f].modelsThatCountForBowLimit,
              ) +
              " bows) "}
            <b>
              {factionMetaData[f].modelsWithBow} /{" "}
              {factionMetaData[f].modelsThatCountForBowLimit}
            </b>
          </p>
        ))}
      <Stack direction="horizontal" gap={3} className="mt-5 mb-3">
        <h6>Alliance Level:</h6>
        <h5>
          <Badge bg={allianceColours[allianceLevel]}>{allianceLevel}</Badge>
        </h5>
        <Button
          variant="light"
          className="ms-auto border shadow-sm"
          onClick={() => openSidebar(SidebarTypes.ALLIANCE)}
          disabled={!factionList.length || factionType.includes("LL")}
        >
          <LuSwords /> Alliances
        </Button>
      </Stack>
      <h6 className={hasArmyBonus ? "text-body" : "text-secondary"}>
        Army Bonuses{" "}
        {hasArmyBonus ? (
          <FcCheckmark />
        ) : (
          <b>
            <RxCross1 className="text-danger" />
          </b>
        )}
      </h6>
      <hr />
      {factionList
        .filter((x) => !wanderers.includes(x))
        .map((f) => (
          <div key={f}>
            <h5 className="mt-4">
              <Badge bg={hasArmyBonus ? "dark" : "secondary"}>{f}</Badge>
            </h5>
            <div
              className={hasArmyBonus ? "text-body" : "text-secondary"}
              dangerouslySetInnerHTML={{
                __html: factionData[f]["armyBonus"],
              }}
            />
          </div>
        ))}
    </div>
  );
};
