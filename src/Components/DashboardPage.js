import React, { useEffect, useContext, useState } from "react";
import { Container, Row, Col, Form, Button, Tab, Nav } from "react-bootstrap";
import ReserveAKataComponent from "../DashboardComponents/ReserveAKataComponent";
import YourCurrentKatasComponent from "../DashboardComponents/YourCurrentKatasComponent";
import YourPastKatasComponent from "../DashboardComponents/YourPastKatasComponent";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/use-user";
import UserContext from "../Context/UserContext";
import {GetCohortByCohortName, DoesUserExist, GetUserByUsername, GetReservationsByUsername} from "../Services/DataService"

export default function DashboardPage() {
  let { cohortName, setCohortName, storedCodewarsName, setCodewarsName, setCompletedKatas, setReservedKatas, totalCompleted, setTotalCompleted } = useContext(UserContext);
  let navigate = useNavigate();

  //const [totalCompleted, setTotalCompleted] = useState("");
  const [lvlDifficulty, setCohortLvlDifficulty] = useState("");

  useEffect(async () => {
    let token = localStorage.getItem("Token");
    if (token == null) {
      navigate("/");
    } else {
      storedCodewarsName = localStorage.getItem("codewarsName");
      if (storedCodewarsName != null) {
        setCodewarsName(storedCodewarsName);
        let userInfo = await GetUserByUsername(storedCodewarsName);
        setCohortName(userInfo.cohortName);
        let cohortInfo = await GetCohortByCohortName(userInfo.cohortName);
        setCohortLvlDifficulty(cohortInfo.lvlDifficulty);
        let userInfoFromCodewars = await DoesUserExist(storedCodewarsName);
        let totalCompleted = userInfoFromCodewars.codeChallenges.totalCompleted;
        setTotalCompleted(totalCompleted);
        let reservations = await GetReservationsByUsername(storedCodewarsName)
        if(reservations.length !=0)
        {
          let activetReservations = reservations.filter(reservation => !reservation.isDeleted && !reservation.isCompleted)
          setReservedKatas(activetReservations)
            let completedReservations = reservations.filter(reservation => reservation.isCompleted)
            setCompletedKatas(completedReservations)
        }
      }
    }
  }, []);

  return (
    <>
      <Container fluid>
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row> 
            <Col sm={3} className="tabBg">
              <img className="badgeImg mt-3" src={`https://www.codewars.com/users/${storedCodewarsName}/badges/large`} />
              <div className="tabBtn1 mt-3">
                <p className="headerText1">Cohort Name: {cohortName}</p>
                <p className="headerText1">Cohort Level: {lvlDifficulty} kyu and lower</p>
                <p className="headerText1">Total Katas Completed: {totalCompleted}</p>
              </div>
              <Nav variant="pills" className="flex-column allText marginTop">
                <Nav.Item>
                  <Nav.Link className="headerText tabBtn mb-4" eventKey="first">
                    Reserve a Kata
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    className="headerText tabBtn mb-4"
                    eventKey="second"
                  >
                    Your current reservations
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="headerText tabBtn" eventKey="third">
                    Your Completed Katas
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <ReserveAKataComponent />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <YourCurrentKatasComponent />
                </Tab.Pane>
                <Tab.Pane eventKey="third">
                  <YourPastKatasComponent />
                </Tab.Pane>
                <Tab.Pane eventKey="fourth">
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
}
