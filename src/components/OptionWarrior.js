import Form from "react-bootstrap/Form";

export function OptionWarrior({
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
                  if (newUnit['default_bow'] == false) {
                    newUnit['inc_bow_count'] = option.is_bow ? true : false
                  }
                  newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                  newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                  newRoster['bow_count'] = newRoster['bow_count'] - ((option.is_bow ? 1 : 0) * newUnit['quantity'])
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
                  if (newUnit['default_bow'] == false) {
                    newUnit['inc_bow_count'] = option.is_bow ? true : false
                  }
                  newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                  newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                  newRoster['bow_count'] = newRoster['bow_count'] + ((option.is_bow ? 1 : 0) * newUnit['quantity'])
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
      onChange={handleToggle}
    />
  );
}