import React, { useEffect, useState } from "react";
import { Row, Col, Table, Card, CardTitle, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const PeriodList = () => {
  const [periods, setPeriods] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/api/periods/"; // Replace with your actual API URL

  // Fetch periods from backend on component mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await axios.get(apiUrl);
        setPeriods(response.data);
      } catch (error) {
        console.error("Error fetching periods:", error);
        Swal.fire("Error!", "Failed to fetch periods.", "error"); // Show error alert
      }
    };

    fetchPeriods();
  }, []);

  const toggleAddModal = () => setAddModalOpen(!isAddModalOpen);
  const toggleEditModal = () => setEditModalOpen(!isEditModalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!isDeleteModalOpen);

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;

    try {
      const response = await axios.post(apiUrl, { start_time: startTime, end_time: endTime });
      setPeriods([...periods, response.data]);
      toggleAddModal();
      Swal.fire("Success!", "Period added successfully.", "success"); // Show success alert
    } catch (error) {
      console.error("Error adding period:", error);
      Swal.fire("Error!", "Failed to add period.", "error"); // Show error alert
    }
  };

  const handleEditPeriod = async (e) => {
    e.preventDefault();
    const updatedPeriod = { start_time: e.target.startTime.value, end_time: e.target.endTime.value };

    try {
      const response = await axios.put(`${apiUrl}${currentPeriod.id}/`, updatedPeriod);
      setPeriods(periods.map((period) => (period.id === currentPeriod.id ? response.data : period)));
      toggleEditModal();
      Swal.fire("Success!", "Period updated successfully.", "success"); // Show success alert
    } catch (error) {
      console.error("Error updating period:", error);
      Swal.fire("Error!", "Failed to update period.", "error"); // Show error alert
    }
  };

  const handleDeletePeriod = async () => {
    try {
      await axios.delete(`${apiUrl}${currentPeriod.id}/`);
      setPeriods(periods.filter((period) => period.id !== currentPeriod.id));
      toggleDeleteModal();
      Swal.fire("Success!", "Period deleted successfully.", "success"); // Show success alert
    } catch (error) {
      console.error("Error deleting period:", error);
      Swal.fire("Error!", "Failed to delete period.", "error"); // Show error alert
    }
  };

  const openEditModal = (period) => {
    setCurrentPeriod(period);
    toggleEditModal();
  };

  const openDeleteModal = (period) => {
    setCurrentPeriod(period);
    toggleDeleteModal();
  };

  const content = (
    <Table bordered striped>
      <thead>
        <tr>
          <th>Period</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {periods.map((period) => (
          <tr key={period.id}>
            <td>{`${period.start_time} - ${period.end_time}`}</td>
            <td>{period.is_active ? "Active" : "Inactive"}</td>
            <td>
              <Button color="primary" size="sm" onClick={() => openEditModal(period)}>
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={() => openDeleteModal(period)}>
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
                  <i className="bi bi-clock"> </i>
                  Period Listing
                </span>
                <Button color="success" onClick={toggleAddModal}>
                  Add Period
                </Button>
              </CardTitle>
              <CardBody>{content}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Add Period Modal */}
      <Modal isOpen={isAddModalOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Period</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddPeriod}>
            <FormGroup>
              <Label for="startTime">Start Time</Label>
              <Input type="time" name="startTime" id="startTime" required />
            </FormGroup>
            <FormGroup>
              <Label for="endTime">End Time</Label>
              <Input type="time" name="endTime" id="endTime" required />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button color="primary" type="submit">Add Period</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Period Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Period</ModalHeader>
        <ModalBody>
          {currentPeriod && (
            <Form onSubmit={handleEditPeriod}>
              <FormGroup>
                <Label for="startTime">Start Time</Label>
                <Input
                  type="time"
                  name="startTime"
                  id="startTime"
                  defaultValue={currentPeriod.start_time}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="endTime">End Time</Label>
                <Input
                  type="time"
                  name="endTime"
                  id="endTime"
                  defaultValue={currentPeriod.end_time}
                  required
                />
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
          Are you sure you want to delete the period from "{currentPeriod?.start_time}" to "{currentPeriod?.end_time}"?
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end">
          <Button color="danger" onClick={handleDeletePeriod}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PeriodList;
