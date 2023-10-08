import Form from "react-bootstrap/Form";

/* Option Warrior is the component used to display an individual gear options that each 
warrior has available. */

export function OptionWarrior({
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
          let newUnits = newWarband.units.map((_unit) => {
            let newUnit = { ..._unit };
            if(newUnit.id == unit.id) {
              let newOptions = newUnit.options.map((_option) => {
                let newOption = { ..._option };
                if(newOption.option_id == option.option_id) {
                  newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
                  newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
                  newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] - option.points
                  newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
                  if (newUnit['default_bow'] == false && newUnit['inc_bow_count'] == true && option.is_bow) {
                    newUnit['inc_bow_count'] = false
                    newWarband['bow_count'] = newWarband['bow_count'] - newUnit['quantity']
                    newRoster['bow_count'] = newRoster['bow_count'] - newUnit['quantity']
                  }
                  newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                  newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                  newOption['opt_quantity'] = 0
                }
                return newOption
              });
              newUnit.options = newOptions
            }
            return newUnit
          });
          newWarband.units = newUnits
        }
        return newWarband;
      });
      newRoster.warbands = newWarbands
    } else {
      let newWarbands = newRoster.warbands.map((warband) => {
        let newWarband = { ...warband };
        if (newWarband.num == warbandNum) {
          let newUnits = newWarband.units.map((_unit) => {
            let newUnit = { ..._unit };
            if(newUnit.id == unit.id) {
              let newOptions = newUnit.options.map((_option) => {
                let newOption = { ..._option };
                if(newOption.option_id == option.option_id) {
                  newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
                  newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
                  newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] + option.points
                  newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
                  if (newUnit['default_bow'] == false && option.is_bow) {
                    newUnit['inc_bow_count'] = true
                    newWarband['bow_count'] = newWarband['bow_count'] + newUnit['quantity']
                    newRoster['bow_count'] = newRoster['bow_count'] + newUnit['quantity']
                  }
                  newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                  newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                  newOption['opt_quantity'] = 1
                }
                return newOption
              });
              newUnit.options = newOptions
            }
            return newUnit
          });
          newWarband.units = newUnits
        }
        return newWarband;
      });
      newRoster.warbands = newWarbands
    }
    setRoster(newRoster);
  };

  return (
    <Form.Check
      type="switch"
      label={option.option + " (" + option.points + " points)"}
      checked={option.opt_quantity == 1}
      disabled={option.min == option.max}
      onChange={handleToggle}
    />
  );
}