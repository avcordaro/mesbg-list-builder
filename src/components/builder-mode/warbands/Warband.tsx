import AddIcon from "@mui/icons-material/Add";
import { Collapse } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import { FunctionComponent, useState } from "react";
import { useStore } from "../../../state/store.ts";
import { isDefinedUnit, Unit } from "../../../types/unit.ts";
import { Warband as WarbandType } from "../../../types/warband.ts";
import { ChooseHeroButton } from "../hero/ChooseHeroButton.tsx";
import { WarbandHero } from "../hero/WarbandHero.tsx";
import { ChooseWarriorButton } from "../warrior/ChooseWarriorButton.tsx";
import { WarbandWarrior } from "../warrior/WarbandWarrior.tsx";
import { WarbandInfo } from "./WarbandInfo.tsx";

type WarbandProps = {
  warband: WarbandType;
};

export const Warband: FunctionComponent<WarbandProps> = ({ warband }) => {
  const { addUnit, updateBuilderSidebar } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();

  const handleNewWarrior = () => {
    addUnit(warband.id);
    updateBuilderSidebar({
      heroSelection: false,
      warriorSelection: false,
    });
  };

  const isHeroWhoLeads = (hero: Unit): boolean => {
    if (!isDefinedUnit(hero)) return false;

    if (
      ["Independent Hero", "Independent Hero*", "Siege Engine"].includes(
        hero.unit_type,
      )
    )
      return false;

    if (
      [
        "[erebor_reclaimed_(king_thorin)] iron_hills_chariot_(champions_of_erebor)",
        "[desolator_of_the_north] smaug",
      ].includes(hero.model_id)
    )
      return false;

    return true;
  };

  return (
    <Card
      variant="elevation"
      elevation={3}
      data-scroll-id={warband.id}
      sx={{
        backgroundColor: theme.palette.grey.A700,
        p: 1,
      }}
    >
      <Stack spacing={1}>
        <WarbandInfo
          warband={warband}
          collapse={setCollapsed}
          collapsed={collapsed}
        />

        <Box data-scroll-id={warband.hero?.id}>
          {!isDefinedUnit(warband.hero) ? (
            <ChooseHeroButton warbandId={warband.id} />
          ) : (
            <WarbandHero
              warbandId={warband.id}
              unit={warband.hero}
              collapsed={collapsed}
            />
          )}
        </Box>

        {warband.units
          // Filters 'choose a warrior buttons if the warband is collapsed
          .filter((unit) => !collapsed || isDefinedUnit(unit))
          .map((unit) => (
            <Box key={unit.id} data-scroll-id={unit.id}>
              {!isDefinedUnit(unit) ? (
                <ChooseWarriorButton warbandId={warband.id} unit={unit} />
              ) : (
                <WarbandWarrior
                  warbandId={warband.id}
                  unit={unit}
                  collapsed={collapsed}
                />
              )}
            </Box>
          ))}

        <Collapse in={!collapsed}>
          {isHeroWhoLeads(warband.hero) && (
            <Button
              onClick={() => handleNewWarrior()}
              variant="contained"
              color="primary"
              fullWidth
              endIcon={<AddIcon />}
            >
              Add Unit
            </Button>
          )}
        </Collapse>
      </Stack>
    </Card>
  );
};
