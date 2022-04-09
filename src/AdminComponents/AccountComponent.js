import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  FloatingLabel,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import UserContext from "../Context/UserContext";
import { useUser } from "../Hooks/use-user";

import {
  AddUser,
  GetAllCohorts,
  DoesUserExist,
  GetUserByUsername,
} from "../Services/DataService";
export default function AccountComponent() {
  let { setAllCohort, allCohort } = useContext(UserContext);

  const [AddCodewarsName, setAddCodewarsName] = useState("");
  const [AddCohortName, setAddCohortName] = useState("");
  const [AddPassword, setAddPassword] = useState("");
  const [AddIsAdmin, setAddIsAdmin] = useState(false);

  useEffect(async () => {
    let allCohort = await GetAllCohorts();
    setAllCohort(allCohort);
  });
  const handleSubmit = async () => {
    let result = await DoesUserExist(AddCodewarsName);
    console.log(result);
    if (result.success == false) {
      toggleShowA();
    } else {
      let userData = {
        Id: 0,
        CodewarsName: AddCodewarsName,
        CohortName: AddCohortName,
        password: AddPassword,
        isAdmin: AddIsAdmin,
      };
      let userAdded = await AddUser(userData);
      if (userAdded) {
        let allCohort = await GetAllCohorts();
        setAllCohort(allCohort);
        setAddCodewarsName("");
        setAddCohortName("");
        setAddPassword("");
        setAddIsAdmin(false);
      }
    }
  };

  const handleCohortSelect = (e) => {
    setAddCohortName(e.target.value);
  };
  const handleAdmin = () => {
    setAddIsAdmin(!AddIsAdmin);
  };

  //show toast if the username does not exist
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  //show toast if username already exist
  const [showB, setShowB] = useState(false);
  const toggleShowB = () => setShowB(!showB);

  return (
    <>
      <Container className="grayCardBg mt-5 pt-4 pb-4 roundedCorners">
        <Row>
          <Col sm={3}>
            <h3 className="headerText text-end" style={{ color: "white" }}>
              Create Account:
            </h3>
          </Col>
          {/* <Col className="" sm={6}>
            <p  className="allText roundedCorners italics" style={{color: "white"}}>Instructions: Before creating an account. Please make sure the user has an account in Codewars. The username from Codewars must match with the username that is being created.</p>
          </Col> */}
        </Row>

        <Row className="justify-content-center">
          <Col sm={6}>
            <FloatingLabel
              controlId="floatingUsername"
              label="Enter Codewars Username"
              className="mb-3 allText "
              style={{ color: "white" }}
            >
              <Form.Control
                className="loginForm loginFormText"
                type="text"
                value={AddCodewarsName}
                placeholder="Codewars username"
                onChange={({ target }) => setAddCodewarsName(target.value)}
              />
              <Form.Text className="text-muted">
            Please make sure the user has an account in Codewars. The username from Codewars must match with the username that is being created.
            </Form.Text>
            </FloatingLabel>
            
            <Form >
              <FloatingLabel
                controlId="floatingPassword"
                label="Enter Password"
                className="mb-3 allText "
                style={{ color: "white" }}
              >
                <Form.Control
                  className="loginForm loginFormText"
                  type="password"
                  placeholder="Password"
                  value={AddPassword}
                  onChange={({ target }) => setAddPassword(target.value)}
                  autoComplete="off"
                />
              </FloatingLabel>
              <Form.Select
                className="listGroupBG"
                aria-label="Default select example"
                value={AddCohortName}
                onChange={handleCohortSelect}
              >
                <option>Select Cohort</option>
                {allCohort
                  .filter((cohort) => cohort.isArchived == false)
                  .map((cohort, idx) => {
                    return (
                      <option key={idx} value={cohort.cohortName}>
                        {cohort.cohortName}
                      </option>
                    );
                  })}
              </Form.Select>
              <Form.Group className="mb-3 mt-2" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Check If Admin Role"
                  className="labelTxt"
                  value={AddIsAdmin}
                  onClick={handleAdmin}
                ></Form.Check>
              </Form.Group>

              {showA == false}
              {showB == false}
              <Button
                variant="success"
                type="button"
                className="allText"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <ToastContainer className="p-3" position="top-end">
        <Toast show={showA} onClose={toggleShowA}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Username Error</strong>
          </Toast.Header>
          <Toast.Body>This username does not exist in Codewars.</Toast.Body>
        </Toast>
      </ToastContainer>
      <ToastContainer className="p-3" position="top-end">
        <Toast show={showB} onClose={toggleShowB}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Username Already Exist</strong>
          </Toast.Header>
          <Toast.Body>There is account with this username already.</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
