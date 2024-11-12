import { Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { useScrollToTop } from "../../../hooks/scroll-to.ts";
import { useRosterBuildingState } from "../../../state/roster-building";

type ChooseHeroButtonProps = {
  warbandId: string;
};

export const ChooseHeroButton: FunctionComponent<ChooseHeroButtonProps> = ({
  warbandId,
}) => {
  const { updateBuilderSidebar, warriorSelectionFocus, warriorSelection } =
    useRosterBuildingState();
  const scrollToTop = useScrollToTop("sidebar");

  const handleClick = () => {
    updateBuilderSidebar({
      warriorSelection: true,
      heroSelection: true,
      warriorSelectionFocus: [warbandId, ""],
    });
    setTimeout(scrollToTop, null);
  };

  return (
    <Paper
      onClick={handleClick}
      elevation={3}
      sx={{
        p: 2,
        cursor: "pointer",
        backgroundColor:
          warriorSelection &&
          warriorSelectionFocus[0] === warbandId &&
          warriorSelectionFocus[1] === ""
            ? "lightblue"
            : "",
        "&:hover": {
          filter: "brightness(75%)",
        },
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center" minWidth="100%">
        <Avatar
          alt="Choose A Hero"
          src={fallbackLogo}
          sx={{ width: 100, height: 100 }}
        />
        <Typography
          variant="body1"
          sx={{ flexGrow: 1, textAlign: "start", textTransform: "uppercase" }}
        >
          <b>Choose a hero</b>
        </Typography>
      </Stack>
    </Paper>
  );
};
