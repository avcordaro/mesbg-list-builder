import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import * as NumericInput from "react-numeric-input";

/* Option Hero is the component used to display an individual gear options that each hero 
has available.

The core difference between Option Hero and Option Warrior components is
that some hero options can be more than just a simple toggle (e.g. amount of Will points 
you'd like for the Witch King). */
export function OptionHero({
  roster,
  setRoster,
  warbandNum,
  unit,
  option
}) {
  const handleToggle = (evt) => {
    /* Update the roster state variable whenever the specific option is toggled on or off, 
    including any changes to points and bow count. */
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

  const handleQuantity = (newQuantity, newQuantityString, input) => {
    /* Handles updates for options that require a quantity, rather than a toggle. This includes
    updating any changes to points and bow count when the quantity is changed. This function 
    receives three inputs from the NumericInput field it's attached to:
    newQuantity - the new value as an integer (what we're interested in)
    newQuantityString - the new value as a string (not needed)
    input - I'm unclear on what this arg provides (but also not needed) */
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
              // Siege engine additional crew must also increase unit counts.
              if (option.option == "Additional Crew") {
                newRoster['num_units'] = newRoster['num_units'] - option.opt_quantity
                newRoster['num_units'] = newRoster['num_units'] + newQuantity
                newWarband['num_units'] = newWarband['num_units'] - option.opt_quantity
                newWarband['num_units'] = newWarband['num_units'] + newQuantity
              }
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
        type="radio"
        name="option"
        label={option.option + " (" + option.points + " points)"}
        checked={option.opt_quantity == 1}
        onChange={handleToggle}
      />
    }
    </>
  );
}