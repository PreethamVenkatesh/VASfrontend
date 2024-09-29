import React from 'react'
import { useState } from 'react'; // Import useState for state management
import Button from 'react-bootstrap/Button'; // Import Button component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Import Form component from react-bootstrap
import Modal from 'react-bootstrap/Modal';  // Import Modal component for pop-up dialog
import { IoHome } from "react-icons/io5"; // Import IoHome icon from react-icons for the home icon

function CustHome() {
     // State to handle the visibility of the modal/pop-up
    const [show, setShow] = useState(false);

    // Function to close the modal
    const handleClose = () => setShow(false);

     // Function to open the modal
    const handleShow = () => setShow(true);

  return (
    <div>
        <>
        {/* Button to trigger the modal, showing "Add Home" with an IoHome icon */}
        <Button variant="primary" onClick={handleShow}>
        <IoHome /> Add Home
        </Button>

        {/* Modal component to display a form for entering the home address */}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Home Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
                >
                <Form.Control as="textarea" rows={3} />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>

            {/* Button to save the entered data */}
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
        </div>
  )
}

export default CustHome