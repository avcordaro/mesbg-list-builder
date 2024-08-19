import Stack from "react-bootstrap/Stack";
import Form from "react-bootstrap/Form";
import hero_constraint_data from "../assets/data/hero_constraint_data.json";
import Button from "react-bootstrap/Button";
import {FaMinus, FaPlus} from "react-icons/fa";

/* Option Warrior is the component used to display an individual gear options that each 
warrior has available. */

export function OptionWarrior({
                                roster, setRoster, warbandNum, unit, option, specialArmyOptions
                              }) {
  const MWF_MAP = {"Might": 0, "Will": 1, "Fate": 2}

  const handleToggle = () => {
    /* Update the roster state variable whenever the specific option is toggled on or off, 
    including any changes to points and bow count. */
    let newRoster = {...roster};
    if (option.opt_quantity === 1) {
      newRoster.warbands = newRoster.warbands.map((warband) => {
        let newWarband = {...warband};
        if (newWarband.num === warbandNum) {
          newWarband.units = newWarband.units.map((_unit) => {
            let newUnit = {..._unit};
            if (newUnit.id === unit.id) {
              newUnit.options = newUnit.options.map((_option) => {
                let newOption = {..._option};
                if (newOption.option_id === option.option_id) {
                  newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
                  newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
                  newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] - option.points
                  newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
                  if (newUnit['default_bow'] === false && newUnit['inc_bow_count'] === true && option.type && option.type.includes('bow')) {
                    newUnit['inc_bow_count'] = false
                    newWarband['bow_count'] = newWarband['bow_count'] - newUnit['quantity']
                    newRoster['bow_count'] = newRoster['bow_count'] - newUnit['quantity']
                  }
                  newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                  newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                  newOption['opt_quantity'] = 0
                }
                return newOption
              })
            }
            return newUnit
          })
        }
        return newWarband;
      })
    } else {
      newRoster.warbands = newRoster.warbands.map((warband) => {
        let newWarband = {...warband};
        if (newWarband.num === warbandNum) {
          newWarband.units = newWarband.units.map((_unit) => {
            let newUnit = {..._unit};
            if (newUnit.id === unit.id) {
              newUnit.options = newUnit.options.map((_option) => {
                let newOption = {..._option};
                if (newOption.option_id === option.option_id) {
                  newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
                  newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
                  newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] + option.points
                  newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
                  if (newUnit['default_bow'] === false && option.type && option.type.includes('bow')) {
                    newUnit['inc_bow_count'] = true
                    newWarband['bow_count'] = newWarband['bow_count'] + newUnit['quantity']
                    newRoster['bow_count'] = newRoster['bow_count'] + newUnit['quantity']
                  }
                  newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                  newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                  newOption['opt_quantity'] = 1
                }
                return newOption
              })
            }
            return newUnit
          })
        }
        return newWarband;
      })
      if (option.type != null) {
        newRoster = toggleOffSameTypes(newRoster);
      }
    }
    setRoster(newRoster);
  };

  const includeSameType = (option_A, option_B) => {
    if (!option_A || !option_B) return false

    let option_A_types = option_A.split(", ");
    let option_B_types = option_B.split(", ");
    let intersection = option_A_types.filter(x => option_B_types.includes(x));
    return intersection.length > 0
  }

  const toggleOffSameTypes = (newRoster) => {
    /* Some options should not be selected simultaneously due to being the same type, e.g. Horse and Armoured Horse
    This function will toggle off any options of the same type as the option just selected. */
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = {...warband};
      if (newWarband.num === warbandNum) {
        newWarband.units = newWarband.units.map((_unit) => {
          let newUnit = {..._unit};
          if (newUnit.id === unit.id) {
            newUnit.options = newUnit.options.map((_option) => {
              let newOption = {..._option};
              if (newOption.opt_quantity === 1 && newOption.option_id !== option.option_id && includeSameType(newOption.type, option.type)) {
                newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
                newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
                newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] - newOption.points
                newUnit['pointsTotal'] = newUnit['pointsPerUnit'] * newUnit['quantity']
                if (newUnit['default_bow'] === false && newUnit['inc_bow_count'] === true && newOption.type && newOption.type.includes('bow')) {
                  newUnit['inc_bow_count'] = false
                  newWarband['bow_count'] = newWarband['bow_count'] - newUnit['quantity']
                  newRoster['bow_count'] = newRoster['bow_count'] - newUnit['quantity']
                }
                newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                newOption['opt_quantity'] = 0
              }
              return newOption
            })
          }
          return newUnit
        })
      }
      return newWarband;
    })
    return newRoster;
  };

  const handleQuantity = (newQuantity) => {
    /* Handles updates for options that require a quantity, rather than a toggle. This includes
    updating any changes to points and bow count when the quantity is changed.*/
    if (newQuantity > option.max || newQuantity < option.min) {
      return null
    }
    let newRoster = {...roster};
    newRoster.warbands = newRoster.warbands.map((warband) => {
      let newWarband = {...warband};
      if (newWarband.num === warbandNum) {
        newWarband.units = newWarband.units.map((_unit) => {
          let newUnit = {..._unit};
          if (newUnit.id === unit.id) {
            newUnit.options = newUnit.options.map((_option) => {
              let newOption = {..._option};
              if (newOption.option_id === option.option_id) {
                newRoster['points'] = newRoster['points'] - newUnit['pointsTotal']
                newWarband['points'] = newWarband['points'] - newUnit['pointsTotal'];
                newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] - (option.points * option.opt_quantity)
                newUnit['pointsPerUnit'] = newUnit['pointsPerUnit'] + (option.points * newQuantity)
                newUnit['pointsTotal'] = newUnit['pointsPerUnit']
                newWarband['points'] = newWarband['points'] + newUnit['pointsTotal'];
                newRoster['points'] = newRoster['points'] + newUnit['pointsTotal']
                newOption['opt_quantity'] = newQuantity
                if (["Might", "Will", "Fate"].includes(option.option)) {
                  let mwfw = newUnit['MWFW'][0][1].split(":")
                  mwfw[MWF_MAP[option.option]] = String(newQuantity)
                  newUnit['MWFW'] = [["", mwfw.join(":")]]
                }
              }
              return newOption
            })
          }
          return newUnit
        })
      }
      return newWarband;
    })
    setRoster(newRoster);
  };

  return (<>
    {option.max > 1 ? <Stack className="mt-1" direction="horizontal" gap={2}>
      <Button disabled={option.opt_quantity === option.min} variant="outline-secondary" className="p-0 quantity-buttons" size="sm" onClick={() => handleQuantity(option.opt_quantity - 1)}><FaMinus /></Button>
      <b style={{width: "20px", textAlign: "center"}}>{option.opt_quantity}</b>
      <Button disabled={option.opt_quantity === option.max} variant="outline-secondary" className="p-0 quantity-buttons" size="sm" onClick={() => handleQuantity(option.opt_quantity + 1)}><FaPlus /></Button>
      {option.option + " (" + option.points + " points)"}
    </Stack> : <Form.Check
      type="switch"
      id={"switch-" + unit.id + "-" + option.option.replaceAll(" ", "-")}
      label={option.option + " (" + option.points + " points)"}
      checked={option.opt_quantity === 1}
      disabled={(option.min === option.max) || !roster.warbands[warbandNum - 1].hero || (option.type === "special_warband_upgrade" && !hero_constraint_data[roster.warbands[warbandNum - 1].hero.model_id][0]['special_warband_options'].includes(option.option)) || (option.type === "special_army_upgrade" && !specialArmyOptions.includes(option.option))}
      onChange={handleToggle}
    />}
  </>);
}