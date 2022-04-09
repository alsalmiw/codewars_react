import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  FloatingLabel,
  ListGroup,
  Row,
  Col,
  Container,
  Button,
} from "react-bootstrap";
import UserContext from '../Context/UserContext';
import {
  AddCohort,
  GetAllUsers,
  EditCohortForUser,
  GetAllCohorts
} from "../Services/DataService";

export default function CreateCohortComponent() {
  let { setAllCohort } = useContext(UserContext);
  const [cohortName, setCohortName] = useState("");
  const [cohortLevel, setCohortLevel] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const [tempArray, setTempArray] = useState("");

  const handleSubmit = async () => {
    let newCohort = {
      Id: 0,
      CohortName: cohortName,
      LvlDifficulty: cohortLevel,
      DateCreated:  (new Date()).toLocaleDateString('en-US'),
      IsArchived: false,
      IsDeleted: false,
    };

    let result = await AddCohort(newCohort);
    if (result)
    {
      let cohorts = await GetAllCohorts();
      setAllCohort(cohorts);
    }
  };

  const handleClick = async (e) => {
    let editUser = e.target.textContent;
    e.target.classList.toggle("active");
    let updateCohortName = await EditCohortForUser(editUser, cohortName);
    setTempArray(updateCohortName.cohortName);
  };

  useEffect(async () => {
    let allFetchedUsers = await GetAllUsers();
    setAllUsers(
      allFetchedUsers.filter(
        (user) =>
          user.cohortName == "Select Cohort" || user.cohortName == "undefined"
      )
    );
    
  }, []);

  return (
    <>
      <Container className="grayCardBg mt-5 pt-4 pb-4 roundedCorners">
        <Row>
          <Col sm={3}>
            <h3 className="headerText text-end" style={{ color: "white" }}>
              Create Cohort:
            </h3>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={6}>
            <FloatingLabel
              controlId="floatingInput"
              label="Example: Season 1 Cohort"
              className="mb-3 allText "
              style={{ color: "white" }}
              onChange={({ target: { value } }) => setCohortName(value)}
            >
              <Form.Control
                className="loginForm loginFormText"
                type="text"
                placeholder="Cohort's name"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={6}>
            <Form.Select
              aria-label="Default select example"
              className="listGroupBG"
              onChange={({ target: { value } }) => setCohortLevel(value)}
            >
              <option>Select Cohort's Kata Level</option>
              <option value="8">8 Kyu Kata</option>
              <option value="7">7 Kyu Kata</option>
              <option value="6">6 Kyu Kata</option>
              <option value="5">5 Kyu Kata</option>
              <option value="4">4 Kyu Kata</option>
              <option value="3">3 Kyu Kata</option>
              <option value="2">2 Kyu Kata</option>
              <option value="1">1 Kyu Kata</option>
            </Form.Select>
            <Form.Text className="text-muted">
              Cohort's kata level will allow users to choose the chosen kata's level and below. For example, If the cohort's level is a 5 Kyu Kata, users will be able to choose katas that are level 1-5.
            </Form.Text>
          </Col>
        </Row>
        {/* <Row className="justify-content-center">
          <Col sm={6}>
            <Button
              variant="success"
              onClick={handleSubmit}
              className="mt-3 allText"
            >
              Submit
            </Button>
          </Col>
        </Row> */}

        <Row>
          <Col sm={3}>
            <h3 className="mt-4 headerText text-end" style={{ color: "white" }}>
              Add Users:
            </h3>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col sm={6}>
            <ListGroup as="ul">
              {/* map through users with no cohort */}
              {
               allUsers.length!=0?
              allUsers.map((user, idx) => {
                return (
                 
                  <ListGroup.Item
                    action
                    key={idx}
                    as="li"
                    className="listGroupBG"
                    onClick={(e) =>
                      handleClick(e, user.codewarsName, user.cohortName)
                    }
                  >
                    {user.codewarsName}
                  </ListGroup.Item>
                 
                );
              })
             :
                  <ListGroup.Item as="li" className="listGroupBG">All users have an assigned cohort</ListGroup.Item>
            
            }
            </ListGroup>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={6}>
            <Button
              variant="success"
              onClick={handleSubmit}
              className="mt-3 allText"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
