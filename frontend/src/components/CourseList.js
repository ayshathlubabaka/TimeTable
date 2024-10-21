import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Table,
  Card,
  CardTitle,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/api/courses/"; // Replace with your actual API URL

  // Fetch courses from backend on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(apiUrl);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const toggleAddModal = () => setAddModalOpen(!isAddModalOpen);
  const toggleEditModal = () => setEditModalOpen(!isEditModalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!isDeleteModalOpen);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const courseName = e.target.courseName.value;

    try {
      const response = await axios.post(apiUrl, { name: courseName });
      setCourses([...courses, response.data]);
      toggleAddModal();
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleEditCourse = async (e) => {
    e.preventDefault();
    const updatedCourse = { name: e.target.courseName.value };

    try {
      const response = await axios.put(`${apiUrl}${currentCourse.id}/`, updatedCourse);
      setCourses(courses.map((course) => (course.id === currentCourse.id ? response.data : course)));
      toggleEditModal();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`${apiUrl}${currentCourse.id}/`);
      setCourses(courses.filter((course) => course.id !== currentCourse.id));
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const openEditModal = (course) => {
    setCurrentCourse(course);
    toggleEditModal();
  };

  const openDeleteModal = (course) => {
    setCurrentCourse(course);
    toggleDeleteModal();
  };

  const content = (
    <Table bordered striped>
      <thead>
        <tr>
          <th>Course</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.name}</td>
            <td>{course.is_active ? "Active" : "Inactive"}</td>
            <td>
              <Button color="primary" size="sm" onClick={() => openEditModal(course)}>
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={() => openDeleteModal(course)}>
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
                  <i className="bi bi-card-text me-2"> </i>
                  Course Listing
                </span>
                <Button color="success" onClick={toggleAddModal}>
                  Add Course
                </Button>
              </CardTitle>
              <CardBody>{content}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Add Course Modal */}
      <Modal isOpen={isAddModalOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Course</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddCourse}>
            <FormGroup>
              <Label for="courseName">Course Name</Label>
              <Input type="text" name="courseName" id="courseName" required />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button color="primary" type="submit">Add Course</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Course</ModalHeader>
        <ModalBody>
          {currentCourse && (
            <Form onSubmit={handleEditCourse}>
              <FormGroup>
                <Label for="courseName">Course Name</Label>
                <Input
                  type="text"
                  name="courseName"
                  id="courseName"
                  defaultValue={currentCourse.name}
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
          Are you sure you want to delete the course "{currentCourse?.name}"?
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end">
          <Button color="danger" onClick={handleDeleteCourse}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CourseList;
