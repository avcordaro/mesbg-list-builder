import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import fallbackLogo from "../../../assets/images/default.png";
import { useStore } from "../../../state/store";

type ChooseHeroButtonProps = {
  warbandId: string;
};

export const ChooseHeroButton: FunctionComponent<ChooseHeroButtonProps> = ({
  warbandId,
}) => {
  const { updateBuilderSidebar } = useStore();

  const handleClick = () => {
    updateBuilderSidebar({
      warriorSelection: true,
      heroSelection: true,
      warriorSelectionFocus: [warbandId, ""],
    });
  };

  return (
    <Button variant="contained" color="inherit" onClick={handleClick} fullWidth>
      <Stack direction="row" spacing={3} alignItems="center" minWidth="100%">
        <Avatar
          alt="Choose A Hero"
          src={fallbackLogo}
          sx={{ width: 100, height: 100 }}
        />
        <Typography variant="body2">
          <b>Choose a hero</b>
        </Typography>
      </Stack>
    </Button>
  );
};
