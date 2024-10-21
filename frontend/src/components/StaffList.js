import React, { useEffect, useState } from "react";
import { Row, Col, Table, Card, CardTitle, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/api/staff/";
  const subjectUrl = "http://127.0.0.1:8000/api/subjects/";

  useEffect(() => {

    const fetchStaff = async () => {
      try {
        const response = await axios.get(apiUrl); // Replace with your API endpoint
        setStaff(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
  
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(subjectUrl); // Replace with your API endpoint
        setSubjects(response.data); // Set subjects from API response
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchStaff();
    fetchSubjects(); // Ensure to fetch subjects from your API
  }, []);

  

  // Fetch staff from backend on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(apiUrl);
        setStaff(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const toggleAddModal = () => setAddModalOpen(!isAddModalOpen);
  const toggleEditModal = () => setEditModalOpen(!isEditModalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!isDeleteModalOpen);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const staffName = e.target.staffName.value;
    const subjectIds = Array.from(e.target.subjects.selectedOptions).map(option => option.value);

    try {
      const response = await axios.post(apiUrl, { name: staffName, subject_ids: subjectIds });
      setStaff([...staff, response.data]);
      toggleAddModal();
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    const updatedStaff = { name: e.target.staffName.value, subject_ids: Array.from(e.target.subjects.selectedOptions).map(option => option.value) };

    try {
      const response = await axios.put(`${apiUrl}${currentStaff.id}/`, updatedStaff);
      setStaff(staff.map((s) => (s.id === currentStaff.id ? response.data : s)));
      toggleEditModal();
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleDeleteStaff = async () => {
    try {
      await axios.delete(`${apiUrl}${currentStaff.id}/`);
      setStaff(staff.filter((s) => s.id !== currentStaff.id));
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting staff:", error);
    }
  };

  const openEditModal = (staffMember) => {
    setCurrentStaff(staffMember);
    toggleEditModal();
  };

  const openDeleteModal = (staffMember) => {
    setCurrentStaff(staffMember);
    toggleDeleteModal();
  };

  const content = (
    <Table bordered striped>
      <thead>
        <tr>
          <th>Name</th>
          <th>Subjects</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.map((s) => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.subjects.map(subject => subject.name).join(", ")}</td>
            <td>{s.is_active ? "Active" : "Inactive"}</td>
            <td>
              <Button color="primary" size="sm" onClick={() => openEditModal(s)}>
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={() => openDeleteModal(s)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="w-100 border shadow-lg p-5">
        <Row>
          <Col lg="10">
            <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-person-circle me-2"> </i>
                  Staff Listing
                </span>
                <Button color="success" onClick={toggleAddModal}>
                  Add Staff
                </Button>
              </CardTitle>
              <CardBody>{content}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={isAddModalOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Staff</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddStaff}>
            <FormGroup>
              <Label for="staffName">Staff Name</Label>
              <Input type="text" name="staffName" id="staffName" required />
            </FormGroup>
            <FormGroup>
              <Label for="subjects">Subjects</Label>
              <Input type="select" name="subjects" id="subjects" multiple>
                {/* Replace with your actual subjects */}
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </Input>
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button color="primary" type="submit">Add Staff</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Staff</ModalHeader>
        <ModalBody>
          {currentStaff && (
            <Form onSubmit={handleEditStaff}>
              <FormGroup>
                <Label for="staffName">Staff Name</Label>
                <Input
                  type="text"
                  name="staffName"
                  id="staffName"
                  defaultValue={currentStaff.name}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="subjects">Subjects</Label>
                <Input type="select" name="subjects" id="subjects" multiple defaultValue={currentStaff.subjects.map(subject => subject.id)}>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </Input>
              </FormGroup>
              <div className="d-flex justify-content-end">
                <Button color="primary" type="submit">Save Changes</Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Deletion</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the staff member "{currentStaff?.name}"?
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end">
          <Button color="danger" onClick={handleDeleteStaff}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StaffList;
