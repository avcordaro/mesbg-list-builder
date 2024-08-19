import Offcanvas from "react-bootstrap/Offcanvas";
import keywords from "../assets/data/keywords.json";
import {Accordion} from "react-bootstrap";
import {useState} from "react";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import {FaSearch} from "react-icons/fa";
import { SiCodemagic } from "react-icons/si";
import Stack from "react-bootstrap/Stack";


export function KeywordsSearch({showKeywordSearch, setShowKeywordSearch}) {

  const [searchTerm, setSearchTerm] = useState("");
  const [keywordList, setKeywordList] = useState(keywords);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    let newKeywordList = keywords.filter((kw) => kw.name.toLowerCase().includes(e.target.value.trim().toLowerCase()));
    setKeywordList(newKeywordList);
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (<Offcanvas show={showKeywordSearch} onHide={() => setShowKeywordSearch(false)}>
    <Offcanvas.Header className="border border-secondary" closeButton>
      <Offcanvas.Title><SiCodemagic className="me-2" style={{fontSize: "26px"}}/> Search Keywords</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <Accordion alwaysOpen>
        <div className="mt-3">Use the search bar below to find definitions for special rules, heroic actions and magical powers that you see on profile cards.</div>
        <Stack className="mt-4 mb-4" direction="horizontal">
          <h5 className="m-0"><FaSearch /></h5>
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
            <Accordion.Item className="my-3 shadow-sm" eventKey={kw['name']}>
              <Accordion.Header>
                {kw['name']}
                {kw['type'] === "magical_power" &&
                  <Badge className="ms-2">Magical Power</Badge>
                }
                {kw['type'] === "heroic_action" &&
                  <Badge bg={"success"} className="ms-2">Heroic Action</Badge>
                }
              </Accordion.Header>
              <Accordion.Body className="bg-light">
                <div
                  dangerouslySetInnerHTML={{
                    __html: kw['description'].replaceAll("\n","<br />"),
                  }}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </div>
      </Accordion>

    </Offcanvas.Body>
  </Offcanvas>);
}
