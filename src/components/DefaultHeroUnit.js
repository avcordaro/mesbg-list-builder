import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

export function DefaultHeroUnit({
  setHeroSelection,
  setDisplaySelection,
  warbandNum,
  setWarbandNumFocus,
}) {
  const handleClick = () => {
    setHeroSelection(true);
    setDisplaySelection(true);
    setWarbandNumFocus(warbandNum - 1);
  };

  return (
    <Button
      variant="light"
      className="p-2 m-1"
      style={{ width: "1100px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src={require("../images/default.png")} />
        <p>
          <b>Choose a Hero</b>
        </p>
      </Stack>
    </Button>
  );
}