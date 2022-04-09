import React, {useContext} from 'react'
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import UserContext from '../Context/UserContext';
import { useUser } from '../Hooks/use-user';

export default function YourPastKatasComponent() {
    let {completedKatas} = useContext(UserContext);

// const handleReserveKata= async(kata)=> {
//     let result =  await ChangeReservationStatus(kata.id)
//     if (result.length !=0)
//     {
//         let reservations = await GetReservationsByUsername(kata.codewarsName)
//         if(reservations.length !=0)
//         {
//             setReservedKatas(reservations)
//             let currentReservations = reservations.filter(reservation => !reservation.isDeleted && !reservation.isCompleted)
//             setNumberOfReservations(currentReservations);
//         }
//     }
// }

  return (
    <>
        <Container className=''>
            <Row className='justify-content-center'>
                <Col className='grayCardBg mt-5 pt-4 pb-2 roundedCorners'>
                    <Row>
                        <Col md={12} className=' '>
                            <Form.Group className="mb-3" controlId="formBasicSearch">
                                <Form.Label className="searchKataText headerText">Your Completed Katas</Form.Label>
                            </Form.Group>
                            <Table striped bordered hover variant="dark" className="mb-2">
                                <thead>
                                    <tr>
                                    <th>Level</th>
                                    <th>Kata name</th>
                                    <th>Status</th>
                                    <th>Date reserved</th>
                                    <th>Language</th>
                                    <th>Link</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        completedKatas.length!=0?
                                        completedKatas.map((kata, idx)=>{
                                        return(
                                           
                                             <tr key={idx}>
                                    <td>{kata.kataLevel}</td>
                                    <td>{kata.kataName}</td>
                                    <td><p className="greenText">{kata.isCompleted?"Completed":"Not Completed"}</p></td>
                                    <td>{kata.dateAdded}</td>
                                    <td>{kata.kataLanguage}</td>
                                    <td><a className='kata-link pointer' href={kata.kataLink} target="_blank">Open</a></td>
                                    {/* {
                                        !kata.isCompleted?
                                       
                                        <td className="d-flex justify-content-center">
                                            {
                                                numberOfReservations.length>=3? <Button className='allText unreserveBtn mt-1 mb-1' variant="secondary" disabled>Reserve</Button> :<Button className='allText unreserveBtn mt-1 mb-1' variant="success" onClick={()=> {handleReserveKata(kata)}}>Reserve</Button>
                                            }
                                            </td>
                                        :
                                        null
                                    } */}
                                    </tr>
                           

                                        )})
                                        :
                                       <tr><td colSpan={6}>You do not have any completed Katas</td></tr> 
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </>
  )
}
