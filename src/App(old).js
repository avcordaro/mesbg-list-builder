import mesbg_data from "./mesbg_data.json";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { v4 as uuid } from "uuid";
import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "./App.css";

function SelectionUnit({
  newWarriorFocus,
  setDisplaySelection,
  heroSelection,
  unitData,
  roster,
  setRoster,
  warbandNumFocus,
}) {
  const handleClick = () => {
    let newRoster = roster.slice();
    let newUnitData = { ...unitData };
    newUnitData["id"] = uuid();

    if (heroSelection) {
      newRoster[warbandNumFocus].hero = newUnitData;
      newRoster[warbandNumFocus].points =
        newRoster[warbandNumFocus].points + newUnitData.base_points;
    } else {
      newRoster[warbandNumFocus].units = newRoster[
        warbandNumFocus
      ].units.filter((data) => data.id != newWarriorFocus);
      newRoster[warbandNumFocus].units.push(newUnitData);
      newRoster[warbandNumFocus].points =
        newRoster[warbandNumFocus].points + newUnitData.base_points;
      newRoster[warbandNumFocus].num_units =
        newRoster[warbandNumFocus].num_units + 1;
    }
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  return (
    <Button
      variant="light"
      style={{ width: "400px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img
          className="profile"
          src={require("./images/" +
            unitData.faction +
            "/" +
            unitData.name +
            ".png")}
        />
        <p>
          <b>{unitData.name}</b>
          <br />
          Points: {unitData.base_points}
        </p>
      </Stack>
    </Button>
  );
}

function DefaultHeroUnit({
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
      style={{ width: "600px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src={require("./images/default.png")} />
        <p>
          <b>Choose a Hero</b>
        </p>
      </Stack>
    </Button>
  );
}

function DefaultWarriorUnit({
  setNewWarriorFocus,
  unitData,
  roster,
  setRoster,
  setHeroSelection,
  setDisplaySelection,
  warbandNum,
  setWarbandNumFocus,
}) {
  const handleClick = (e) => {
    setHeroSelection(false);
    setDisplaySelection(true);
    setWarbandNumFocus(warbandNum - 1);
    setNewWarriorFocus(unitData.id);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    let newRoster = roster.slice();
    newRoster[warbandNum - 1].units = newRoster[warbandNum - 1].units.filter(
      (data) => data.id != unitData.id
    );
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  return (
    <Button
      variant="light"
      className="p-2 m-1"
      style={{ width: "600px", textAlign: "left" }}
      onClick={handleClick}
    >
      <Stack direction="horizontal" gap={3}>
        <img className="profile" src={require("./images/default.png")} />
        <p>
          <b>Choose a Warrior</b>
        </p>
        <Button
          onClick={handleDelete}
          className="ms-auto mt-auto"
          style={{ marginRight: "10px", marginBottom: "5px" }}
          variant={"warning"}
        >
          <ImCross />
        </Button>
      </Stack>
    </Button>
  );
}

function RosterHero({ warbandNum, unitData, roster, setRoster }) {
  const [quantity, setQuantity] = useState(1);
  const [points, setPoints] = useState(unitData.base_points);
  const [totalPoints, setTotalPoints] = useState(unitData.base_points);

  const handleDelete = () => {
    let newRoster = roster.slice();
    newRoster[warbandNum - 1].hero = null;
    newRoster[warbandNum - 1].points =
      newRoster[warbandNum - 1].points - totalPoints;
    setRoster(newRoster);
  };
  return (
    <Card style={{ width: "600px" }} className="p-2 m-1" bg={"light"}>
      <Stack direction="horizontal" gap={3}>
        <img
          className="profile"
          src={require("./images/" +
            unitData.faction +
            "/" +
            unitData.name +
            ".png")}
        />
        <Stack>
          <Stack direction="horizontal" gap={3}>
            <p>
              <b>{unitData.name}</b>
            </p>
            <p className="ms-auto" style={{ paddingRight: "10px" }}>
              Points: <b>{totalPoints}</b>
            </p>
          </Stack>
          <Stack direction="horizontal" gap={3}>
            {unitData.options[0].option != "None" && (
              <Form>
                {unitData.options.map((option) => (
                  <Option
                    roster={roster}
                    setRoster={setRoster}
                    warbandNum={warbandNum}
                    option={option}
                    points={points}
                    setPoints={setPoints}
                    totalPoints={totalPoints}
                    setTotalPoints={setTotalPoints}
                    quantity={quantity}
                  />
                ))}
              </Form>
            )}
            <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
              <Button
                style={{ marginRight: "10px", marginBottom: "5px" }}
                variant={"warning"}
                onClick={handleDelete}
              >
                <ImCross />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

function RosterWarrior({ warbandNum, unitData, roster, setRoster }) {
  const [quantity, setQuantity] = useState(1);
  const [points, setPoints] = useState(unitData.base_points);
  const [totalPoints, setTotalPoints] = useState(unitData.base_points);

  const handleIncrement = () => {
    let newRoster = roster.slice();
    newRoster[warbandNum - 1].points =
      newRoster[warbandNum - 1].points - totalPoints;
    newRoster[warbandNum - 1].points =
      newRoster[warbandNum - 1].points + (quantity + 1) * points;
    newRoster[warbandNum - 1].num_units =
      newRoster[warbandNum - 1].num_units + 1;
    setRoster(newRoster);
    setQuantity(quantity + 1);
    setTotalPoints((quantity + 1) * points);
  };
  const handleDecrement = () => {
    if (quantity > 1) {
      let newRoster = roster.slice();
      newRoster[warbandNum - 1].points =
        newRoster[warbandNum - 1].points - totalPoints;
      newRoster[warbandNum - 1].points =
        newRoster[warbandNum - 1].points + (quantity - 1) * points;
      newRoster[warbandNum - 1].num_units =
        newRoster[warbandNum - 1].num_units - 1;
      setRoster(newRoster);
      setQuantity(quantity - 1);
      setTotalPoints((quantity - 1) * points);
    }
  };
  const handleDelete = () => {
    let newRoster = roster.slice();
    newRoster[warbandNum - 1].units = newRoster[warbandNum - 1].units.filter(
      (data) => data.id != unitData.id
    );
    newRoster[warbandNum - 1].points =
      newRoster[warbandNum - 1].points - totalPoints;
    newRoster[warbandNum - 1].num_units =
      newRoster[warbandNum - 1].num_units - quantity;
    setRoster(newRoster);
  };
  return (
    <Card style={{ width: "600px" }} className="p-2 m-1" bg={"light"}>
      <Stack direction="horizontal" gap={3}>
        <img
          className="profile"
          src={require("./images/" +
            unitData.faction +
            "/" +
            unitData.name +
            ".png")}
        />
        <Stack>
          <Stack direction="horizontal" gap={3}>
            <p>
              <b>{unitData.name}</b>
            </p>
            <p className="ms-auto" style={{ paddingRight: "10px" }}>
              Points: <b>{totalPoints}</b>
            </p>
          </Stack>
          <Stack direction="horizontal" gap={3}>
            {unitData.options[0].option != "None" && (
              <Form>
                {unitData.options.map((option) => (
                  <Option
                    roster={roster}
                    setRoster={setRoster}
                    warbandNum={warbandNum}
                    option={option}
                    points={points}
                    setPoints={setPoints}
                    totalPoints={totalPoints}
                    setTotalPoints={setTotalPoints}
                    quantity={quantity}
                  />
                ))}
              </Form>
            )}
            <Stack direction="horizontal" gap={3} className="ms-auto mt-auto">
              {unitData.unit_type == "Warrior" && (
                <>
                  <Button onClick={handleDecrement}>
                    <FaMinus />
                  </Button>
                  <p className="mt-3"><b>{quantity}</b></p>
                  <Button onClick={handleIncrement}>
                    <FaPlus />
                  </Button>
                </>
              )}
              <Button
                style={{ marginRight: "10px" }}
                variant={"warning"}
                onClick={handleDelete}
              >
                <ImCross />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

function Option({
  roster,
  setRoster,
  warbandNum,
  option,
  points,
  setPoints,
  totalPoints,
  setTotalPoints,
  quantity,
}) {
  const [selected, setSelected] = useState(false);
  const handleToggle = (evt) => {
    let newRoster = roster.slice();
    newRoster[warbandNum - 1].points =
      newRoster[warbandNum - 1].points - totalPoints;
    if (selected) {
      setSelected(false);
      setPoints(points - option.points);
      setTotalPoints((points - option.points) * quantity);
      newRoster[warbandNum - 1].points =
        newRoster[warbandNum - 1].points + (points - option.points) * quantity;
    } else {
      setSelected(true);
      setPoints(points + option.points);
      setTotalPoints((points + option.points) * quantity);
      newRoster[warbandNum - 1].points =
        newRoster[warbandNum - 1].points + (points + option.points) * quantity;
    }
    setRoster(newRoster);
  };

  return (
    <Form.Check
      type="switch"
      label={option.option + " (" + option.points + " points)"}
      checked={selected}
      onChange={handleToggle}
    />
  );
}

export default function App() {
  const faction_list = new Set(mesbg_data.map((data) => data.faction));
  const [faction, setFaction] = useState("Minas Tirith");
  const [heroSelection, setHeroSelection] = useState(false);
  const [warbandNumFocus, setWarbandNumFocus] = useState(0);
  const [newWarriorFocus, setNewWarriorFocus] = useState("");
  const [roster, setRoster] = useState([]);
  const [displaySelection, setDisplaySelection] = useState(false);
  const handleSelect = (e) => {
    setFaction(e);
  };

  const handleNewWarband = () => {
    let newRoster = roster.slice();
    let newWarband = {
      id: uuid(),
      num: newRoster.length + 1,
      points: 0,
      num_units: 0,
      hero: null,
      units: [],
    };
    newRoster.push(newWarband);
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  const handleDeleteWarband = (warbandNum) => {
    let newRoster = roster.slice();
    newRoster = newRoster.filter((data) => data.num != warbandNum);
    newRoster = newRoster.map((data) => {
      let newData = { ...data };
      if (data.num > warbandNum) {
        newData["num"] = newData["num"] - 1;
      }
      return newData;
    });
    setRoster(newRoster);
    setDisplaySelection(false);
  };

  const handleNewWarrior = (warbandNum) => {
    let newRoster = roster.slice();
    newRoster[warbandNum - 1].units.push({ id: uuid(), name: null });
    setRoster(newRoster);
    setHeroSelection(false);
    setDisplaySelection(false);
  };

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand className="ms-4">
          <Stack direction="horizontal" gap={3}>
            <img src={require("./images/title-logo.png")} />
            <Stack>
              <p className="p-0 m-0" style={{ fontSize: "24px" }}>
                Army Builder
              </p>
              <p className="p-0 m-0" style={{ fontSize: "16px" }}>
                version 1.0.0
              </p>
            </Stack>
          </Stack>
        </Navbar.Brand>
      </Navbar>
      <div className="m-4">
        <div className="optionsList border position-fixed">
          {displaySelection && (
            <Stack gap={2}>
              <DropdownButton
                className="dropDownButton"
                title={faction + " "}
                onSelect={handleSelect}
              >
                {[...faction_list].map((f) => (
                  <Dropdown.Item
                    style={{ width: "395spx", textAlign: "center" }}
                    eventKey={f}
                  >
                    {f}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              {heroSelection
                ? mesbg_data
                    .filter(
                      (data) =>
                        data.faction == faction && data.unit_type != "Warrior"
                    )
                    .map((row) => (
                      <SelectionUnit
                        key={uuid()}
                        newWarriorFocus={newWarriorFocus}
                        setDisplaySelection={setDisplaySelection}
                        heroSelection={heroSelection}
                        unitData={row}
                        roster={roster}
                        setRoster={setRoster}
                        warbandNumFocus={warbandNumFocus}
                      />
                    ))
                : mesbg_data
                    .filter(
                      (data) =>
                        data.faction == faction && data.unit_type == "Warrior"
                    )
                    .map((row) => (
                      <SelectionUnit
                        key={uuid()}
                        newWarriorFocus={newWarriorFocus}
                        setDisplaySelection={setDisplaySelection}
                        heroSelection={heroSelection}
                        unitData={row}
                        roster={roster}
                        setRoster={setRoster}
                        warbandNumFocus={warbandNumFocus}
                      />
                    ))}
            </Stack>
          )}
        </div>
        <Stack style={{ marginLeft: "475px" }} gap={2}>
          <h4>
            <b>Current Roster</b>
          </h4>
          {roster.map((warband) => (
            <Card
              style={{ width: "630px" }}
              className="p-2"
              bg={"secondary"}
              text={"light"}
            >
              <Stack direction="horizontal">
                <Card.Text className="ms-2">
                  Warband: <b>{warband.num}</b>
                </Card.Text>
                <Card.Text className="ms-5">
                  Units: <b>{warband.num_units} / 12</b>
                </Card.Text>
                <Card.Text className="ms-5">
                  Points: <b>{warband.points}</b>
                </Card.Text>
                <Button
                  onClick={() => handleDeleteWarband(warband.num)}
                  className="ms-auto mb-3"
                  style={{ marginRight: "10px" }}
                  variant={"danger"}
                >
                  <MdDelete />
                </Button>
              </Stack>
              {warband.hero == null ? (
                <DefaultHeroUnit
                  key={uuid()}
                  setHeroSelection={setHeroSelection}
                  setDisplaySelection={setDisplaySelection}
                  warbandNum={warband.num}
                  setWarbandNumFocus={setWarbandNumFocus}
                />
              ) : (
                <RosterHero
                  key={warband.hero.id}
                  warbandNum={warband.num}
                  unitData={warband.hero}
                  roster={roster}
                  setRoster={setRoster}
                />
              )}
              {warband.units.length > 0 &&
                warband.units.map((unit) =>
                  unit.name == null ? (
                    <DefaultWarriorUnit
                      key={uuid()}
                      setNewWarriorFocus={setNewWarriorFocus}
                      unitData={unit}
                      roster={roster}
                      setRoster={setRoster}
                      setHeroSelection={setHeroSelection}
                      setDisplaySelection={setDisplaySelection}
                      warbandNum={warband.num}
                      setWarbandNumFocus={setWarbandNumFocus}
                    />
                  ) : (
                    <RosterWarrior
                      key={unit.id}
                      warbandNum={warband.num}
                      unitData={unit}
                      roster={roster}
                      setRoster={setRoster}
                    />
                  )
                )}
              <Button
                onClick={() => handleNewWarrior(warband.num)}
                variant={"info"}
                className="m-1"
                style={{ width: "600px" }}
              >
                Add Unit <FaPlus />
              </Button>
            </Card>
          ))}
          <Button onClick={() => handleNewWarband()} style={{ width: "630px" }}>
            Add Warband <FaPlus />
          </Button>
        </Stack>
      </div>
    </div>
  );
}
// TO DO
// Unit counter maximum + alert for exceeding maximum
// Total roster points, models, 50%, 25%, bow count.