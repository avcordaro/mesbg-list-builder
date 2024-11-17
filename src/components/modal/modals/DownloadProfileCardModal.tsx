import {
  Button,
  DialogActions,
  DialogContent,
  ImageList,
  ImageListItem,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useDownload } from "../../../hooks/download.ts";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { isDefinedUnit } from "../../../types/unit.ts";
import { AlertTypes } from "../../alerts/alert-types.tsx";
import { UnitProfileCard } from "../../common/images/UnitProfileCard.tsx";

export const DownloadProfileCardModal = () => {
  const { roster } = useRosterBuildingState();
  const { closeModal, triggerAlert } = useAppState();
  const { downloadProfileCards } = useDownload();
  const [profileCards, setProfileCards] = useState<string[]>([]);

  useEffect(() => {
    const profileCards: string[] = [];
    roster.warbands.forEach((warband) => {
      if (warband.hero) {
        profileCards.push(
          [warband.hero.profile_origin, warband.hero.name].join("|"),
        );
        if (
          warband.hero.unit_type !== "Siege Engine" &&
          hero_constraint_data[warband.hero.model_id][0]["extra_profiles"]
            .length > 0
        ) {
          hero_constraint_data[warband.hero.model_id][0][
            "extra_profiles"
          ].forEach((profile: string) => {
            profileCards.push([warband.hero.profile_origin, profile].join("|"));
          });
        }
      }
      warband.units.filter(isDefinedUnit).forEach((unit) => {
        if (unit.unit_type !== "Siege") {
          profileCards.push([unit.profile_origin, unit.name].join("|"));
        }
      });
    });
    const profileCardsSet = new Set(profileCards);
    setProfileCards([...profileCardsSet]);
  }, [roster]);

  const handleDownload = async () => {
    downloadProfileCards()
      .catch(() => triggerAlert(AlertTypes.DOWNLOAD_FAILED))
      .finally(closeModal);
  };

  return (
    <>
      <DialogContent sx={{ minWidth: "50vw", maxHeight: "50svh" }}>
        <Alert severity="info">
          The following profile cards will be downloaded (in high resolution).
        </Alert>
        <ImageList cols={3}>
          {profileCards
            .map((profile) => profile.split("|"))
            .map(([army, profile], index) => (
              <ImageListItem key={index} cols={1}>
                <UnitProfileCard profile={profile} army={army} />
              </ImageListItem>
            ))}
        </ImageList>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{ minWidth: "20ch" }}
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
};
