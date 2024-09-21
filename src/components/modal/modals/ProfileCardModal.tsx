import { DialogContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment } from "react";
import hero_constraint_data from "../../../assets/data/hero_constraint_data.json";
import { useStore } from "../../../state/store.ts";
import { Unit } from "../../../types/unit.ts";
import { UnitProfileCard } from "../../common/images/UnitProfileCard.tsx";

export const ProfileCardModal = () => {
  const {
    modalContext: { unitData },
  } = useStore();
  const { palette } = useTheme();

  const ExtraProfileCards = ({ unit }: { unit: Unit }) => {
    if (!unit.unit_type.includes("Hero")) {
      return null;
    }

    const [heroData] = hero_constraint_data[unitData.model_id];
    return heroData?.extra_profiles?.map((profile) => (
      <Fragment key={profile}>
        <UnitProfileCard army={unitData.profile_origin} profile={profile} />
      </Fragment>
    ));
  };

  return (
    <>
      <DialogContent>
        <Typography variant="body2">
          You can download a zip of all profile cards for your current army list
          by clicking on the floating action button in the bottom right, and
          selecting{" "}
          <Typography
            variant="body2"
            component="strong"
            fontWeight={800}
            color={palette.primary.main}
          >
            Download profile cards
          </Typography>
        </Typography>

        {unitData != null && (
          <>
            <UnitProfileCard
              army={unitData.profile_origin}
              profile={unitData.name}
            />
            <ExtraProfileCards unit={unitData} />
          </>
        )}
      </DialogContent>
    </>
  );
};
