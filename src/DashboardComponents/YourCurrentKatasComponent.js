import React, {useEffect, useContext, useState} from 'react'
import { Container, Row, Col, Form, Button, Tab, Nav, Table } from 'react-bootstrap';
import UserContext from '../Context/UserContext';
import { useUser } from '../Hooks/use-user';
import {GetReservationsByUsername,GetCodeChallenge, ChangeReservationStatus } from '../Services/DataService'

export default function YourCurrentKatasComponent() {
        let { codewarsName, reservedKatas, setReservedKatas } = useContext(UserContext);
        const [codewarsKata, setCodewarsKata] = useState([]);
        const [reservedKata, setReservedKata] = useState([]);
        const [showKata, setShowKata] = useState(false);

    const handleKataInformation = async (kata) => 
    {
        let kataInfo = await GetCodeChallenge(kata.kataId)
        if (kataInfo.length !=0)
        {
            setCodewarsKata(kataInfo)  
            setReservedKata(kata)
            if(showKata)
            {setShowKata(false)}
            else{setShowKata(true)}
        }
    }

    const handleUnreserveKata = async (id) => 
    {   
        let result =  await ChangeReservationStatus(id)
        if (result.length !=0)
        {
            setShowKata(false)
            let reservations = await GetReservationsByUsername(codewarsName)
            if(reservations.length !=0)
            {
                let activetReservations = reservations.filter(reservation => !reservation.isDeleted && !reservation.isCompleted)
                setReservedKatas(activetReservations)
                
            }
        }
    }

  return (
    <>
        <Container className=''>
            <Row className='justify-content-center'>
                <Col className='grayCardBg mt-5 pt-4 pb-2 roundedCorners'>
                    <Row>
                        <Col md={12} className=' '>
                            <Form.Group className="mb-3" controlId="formBasicSearch">
                                <Form.Label className="searchKataText headerText">Your Current Reservations</Form.Label>
                            </Form.Group>
                            <Table striped bordered hover variant="dark">
                                <thead>
                                    <tr>
                                    <th>Level</th>
                                    <th>Kata name</th>
                                    <th>Status</th>
                                    <th>Link</th>
                                    <th>Unreserve</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        reservedKatas.length!=0?
                                        reservedKatas.map((kata, idx)=> {
                                            return(
                                                 <tr key={idx}>
                                              <td>{kata.kataLevel} kyu</td>
                                    <td onClick={()=> {handleKataInformation(kata)}}>{kata.kataName}</td>
                                    <td><p className="redText">{kata.isCompleted?"Completed": "Not Completed"}</p></td>
                                    <td><a className='kata-link pointer' href={kata.kataLink} target="_blank">Open</a></td>
                                    <td className="d-flex justify-content-center"><Button className='allText unreserveBtn mt-1 mb-1' variant="danger" onClick={()=> {handleUnreserveKata(kata.id)}}>Unreserve</Button></td>       
                                            </tr>
                                            )
                                        })
                                        :
                                        <tr><td colSpan={6}>You do not have any reservations</td></tr>
                                    }
                                  
                                   
                                </tbody>
                            </Table>
                        </Col>
                        <Col md={12} className='mt-4'>
                            {
                                showKata?
                                <>
                                 <div className='d-flex mt-4'>
                                <p className='dashboardSlugTitle headerText'>Challenge name:</p>
                                <p className='dashboardSlugText ms-2 allText kataName'>{codewarsKata.name}</p>
                                <p className='dashboardSlugTitle ms-5 headerText'>Level:</p>
                                <p className='dashboardSlugText ms-2 allText' >{codewarsKata.rank.name}</p>
                                <p className='dashboardSlugTitle ms-5 headerText'>Language:</p>
                                <p className='dashboardSlugText ms-2 allText'>{reservedKata.kataLanguage} </p>
                            </div>
                            <div className='d-flex mt-1'>
                                <p className='dashboardSlugTitle me-5 headerText'>Description:</p>
                            </div>
                            <div className='d-flex '>
                            <p className='dashboardDescText p-3 scrollFeature2 allText'>{codewarsKata.description}</p>
                             </div>
                             </>
                             :
                             null
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </>
  )
}