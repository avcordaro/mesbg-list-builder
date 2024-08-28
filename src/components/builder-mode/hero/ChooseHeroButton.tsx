import { FunctionComponent } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
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
    <Button
      variant="light"
      className="p-2 m-1"
      style={{ width: "820px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src="assets/images/default.png" alt="" />
        <p>
          <b>Choose a Hero</b>
        </p>
      </Stack>
    </Button>
  );
};
