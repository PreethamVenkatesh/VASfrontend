import React from 'react' // Import React library
import { useState } from 'react';
import Button from 'react-bootstrap/Button';  // Import Button component from react-bootstrap
import Form from 'react-bootstrap/Form'; // Import Form component from react-bootstrap
import Modal from 'react-bootstrap/Modal'; // Import Modal component from react-bootstrap for popup functionality
import { MdWork } from "react-icons/md"; // Import MdWork icon from react-icons for work-related icon

function CustWork() {
     // useState to manage the visibility of the modal
    const [show, setShow] = useState(false);

    // Function to close the modal, sets the state 'show' to false
    const handleClose = () => setShow(false);

    // Function to open the modal, sets the state 'show' to true
    const handleShow = () => setShow(true);
    
  return (
    <div>
        <>
        {/* Button to trigger the modal, displaying "Add Work" with an MdWork icon */}
        <Button variant="primary" onClick={handleShow}>
            <MdWork /> Add Work
        </Button>

        {/* Modal component that appears when 'show' is true */}
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
            {/* Button to save changes */}
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    </div>
  )
}

export default CustWork