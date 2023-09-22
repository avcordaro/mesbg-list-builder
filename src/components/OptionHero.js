import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import * as NumericInput from "react-numeric-input";

export function OptionHero({
  roster,
  setRoster,
  warbandNum,
  unit,
  option
}) {
  const handleToggle = (evt) => {
    let newRoster = { ...roster };
    if (option.opt_quantity == 1) {
      let newWarbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num == warbandNum) {
          let newHero = { ...newWarband.hero }
          let newOptions = newHero.options.map((_option) => {
              let newOption = { ..._option };
              if(newOption.option_id == option.option_id) {
                newRoster['points'] = newRoster['points'] - newHero['pointsTotal']
                newWarband['points'] = newWarband['points'] - newHero['pointsTotal'];
                newHero['pointsPerUnit'] = newHero['pointsPerUnit'] - option.points
                newHero['pointsTotal'] = newHero['pointsPerUnit']
                newWarband['points'] = newWarband['points'] + newHero['pointsTotal'];
                newRoster['points'] = newRoster['points'] + newHero['pointsTotal']
                newOption['opt_quantity'] = 0
              }
              return newOption
            });
          newHero.options = newOptions
          newWarband.hero = newHero
        }
        return newWarband;
      });
      newRoster.warbands = newWarbands
    } else {
      let newWarbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num == warbandNum) {
          let newHero = { ...newWarband.hero }
          let newOptions = newHero.options.map((_option) => {
              let newOption = { ..._option };
              if(newOption.option_id == option.option_id) {
                newRoster['points'] = newRoster['points'] - newHero['pointsTotal']
                newWarband['points'] = newWarband['points'] - newHero['pointsTotal'];
                newHero['pointsPerUnit'] = newHero['pointsPerUnit'] + option.points
                newHero['pointsTotal'] = newHero['pointsPerUnit'] * newHero['quantity']
                newWarband['points'] = newWarband['points'] + newHero['pointsTotal'];
                newRoster['points'] = newRoster['points'] + newHero['pointsTotal']
                newOption['opt_quantity'] = 1
              }
              return newOption
            });
          newHero.options = newOptions
          newWarband.hero = newHero
        }
        return newWarband;
      });
      newRoster.warbands = newWarbands
    }
    setRoster(newRoster);
  };

  const handleQuantity = (newQuantity, nS, i) => {
    let newRoster = { ...roster };
    let newWarbands = newRoster.warbands.map((warband) => {
      let newWarband = { ...warband };
      if (newWarband.num == warbandNum) {
        let newHero = { ...newWarband.hero }
        let newOptions = newHero.options.map((_option) => {
            let newOption = { ..._option };
            if(newOption.option_id == option.option_id) {
              newRoster['points'] = newRoster['points'] - newHero['pointsTotal']
              newWarband['points'] = newWarband['points'] - newHero['pointsTotal'];
              newHero['pointsPerUnit'] = newHero['pointsPerUnit'] - (option.points * option.opt_quantity)
              newHero['pointsPerUnit'] = newHero['pointsPerUnit'] + (option.points * newQuantity)
              newHero['pointsTotal'] = newHero['pointsPerUnit']
              newWarband['points'] = newWarband['points'] + newHero['pointsTotal'];
              newRoster['points'] = newRoster['points'] + newHero['pointsTotal']
              newOption['opt_quantity'] = newQuantity
            }
            return newOption
          });
        newHero.options = newOptions
        newWarband.hero = newHero
      }
      return newWarband;
    });
    newRoster.warbands = newWarbands
    setRoster(newRoster);
  }

  return (
    <>
    {option.max > 1 ? 
      <Stack className="mt-1" direction="horizontal" gap={2}>
        <NumericInput size={1} min={option.min} max={option.max} value={option.opt_quantity} onChange={handleQuantity}/>
        {option.option + " (" + option.points + " points)"}
      </Stack>
      :
      <Form.Check
        type="switch"
        label={option.option + " (" + option.points + " points)"}
        checked={option.opt_quantity == 1}
        onChange={handleToggle}
      />
    }
    </>
  );
}