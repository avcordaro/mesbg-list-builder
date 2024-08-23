import { Fragment, useState } from "react";
import { Accordion } from "react-bootstrap";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { FaSearch } from "react-icons/fa";
import keywords from "../../../assets/data/keywords.json";

export const KeywordsSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keywordList, setKeywordList] = useState(keywords);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const newKeywordList = keywords.filter((kw) =>
      kw.name.toLowerCase().includes(e.target.value.trim().toLowerCase()),
    );
    setKeywordList(newKeywordList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Fragment>
      <Accordion alwaysOpen>
        <div className="mt-3">
          Use the search bar below to find definitions for special rules, heroic
          actions and magical powers that you see on profile cards.
        </div>
        <Stack className="mt-4 mb-4" direction="horizontal">
          <h5 className="m-0">
            <FaSearch />
          </h5>
          <Form
            noValidate
            onSubmit={handleSubmit}
            className="ms-3 shadow-sm border rounded border-secondary w-100"
          >
            <Form.Control
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
            />
          </Form>
        </Stack>
        <div>
          {keywordList.map((kw) => (
            <Accordion.Item
              className="my-3 shadow-sm"
              eventKey={kw["name"]}
              key={kw.name}
            >
              <Accordion.Header>
                {kw["name"]}
                {kw["type"] === "magical_power" && (
                  <Badge className="ms-2">Magical Power</Badge>
                )}
                {kw["type"] === "heroic_action" && (
                  <Badge bg="success" className="ms-2">
                    Heroic Action
                  </Badge>
                )}
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                <div
                  dangerouslySetInnerHTML={{
                    __html: kw["description"].replaceAll("\n", "<br />"),
                  }}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </div>
      </Accordion>
    </Fragment>
  );
};
