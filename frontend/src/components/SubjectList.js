import React, { useEffect, useState } from "react";
import { Row, Col, Table, Card, CardTitle, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]); // State to hold course data
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);

  const apiUrl = "http://127.0.0.1:8000/api/subjects/"; // Replace with your actual API URL
  const coursesUrl = "http://127.0.0.1:8000/api/courses/"; // Replace with your actual courses API URL

  // Fetch subjects and courses from backend on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(apiUrl);
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(coursesUrl);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchSubjects();
    fetchCourses();
  }, []);

  const toggleAddModal = () => setAddModalOpen(!isAddModalOpen);
  const toggleEditModal = () => setEditModalOpen(!isEditModalOpen);
  const toggleDeleteModal = () => setDeleteModalOpen(!isDeleteModalOpen);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    const subjectName = e.target.subjectName.value;
    const courseId = parseInt(e.target.courseId.value);
    
    try {
        const response = await axios.post(apiUrl, { name: subjectName, course_id: courseId });
        setSubjects([...subjects, response.data]);
        toggleAddModal();
        Swal.fire({
            icon: 'success',
            title: 'Subject Added',
            text: 'The subject has been added successfully!',
        });
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            
            // Displaying the exact error message
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(errorData),  // Display the error message in the alert
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An unexpected error occurred.',
            });
        }
    }
};

  const handleEditSubject = async (e) => {
    e.preventDefault();
    const subjectName = e.target.subjectName.value;
    const courseId = parseInt(e.target.courseId.value);

    try {
      const response = await axios.put(`${apiUrl}${currentSubject.id}/`, { name: subjectName, course_id: courseId });
      setSubjects(subjects.map((subject) => (subject.id === currentSubject.id ? response.data : subject)));
      toggleEditModal();
    } catch (error) {
      console.error("Error updating subject:", error);
    }
  };

  const handleDeleteSubject = async () => {
    try {
      await axios.delete(`${apiUrl}${currentSubject.id}/`);
      setSubjects(subjects.filter((subject) => subject.id !== currentSubject.id));
      toggleDeleteModal();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const openEditModal = (subject) => {
    setCurrentSubject(subject);
    toggleEditModal();
  };

  const openDeleteModal = (subject) => {
    setCurrentSubject(subject);
    toggleDeleteModal();
  };

  const content = (
    <Table bordered striped>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Course</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject) => (
          <tr key={subject.id}>
            <td>{subject.name}</td>
            <td>{subject.course.name}</td>
            <td>{subject.is_active ? "Active" : "Inactive"}</td>
            <td>
              <Button color="primary" size="sm" onClick={() => openEditModal(subject)}>
                Edit
              </Button>
              <Button color="danger" size="sm" onClick={() => openDeleteModal(subject)}>
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
                  Subject Listing
                </span>
                <Button color="success" onClick={toggleAddModal}>
                  Add Subject
                </Button>
              </CardTitle>
              <CardBody>{content}</CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Add Subject Modal */}
      <Modal isOpen={isAddModalOpen} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add Subject</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleAddSubject}>
            <FormGroup>
              <Label for="subjectName">Subject Name</Label>
              <Input type="text" name="subjectName" id="subjectName" required />
            </FormGroup>
            <FormGroup>
              <Label for="courseId">Course</Label>
              <Input type="select" name="courseId" id="courseId" required>
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button color="primary" type="submit">Add Subject</Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Subject</ModalHeader>
        <ModalBody>
          {currentSubject && (
            <Form onSubmit={handleEditSubject}>
              <FormGroup>
                <Label for="subjectName">Subject Name</Label>
                <Input
                  type="text"
                  name="subjectName"
                  id="subjectName"
                  defaultValue={currentSubject.name}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="courseId">Course</Label>
                <Input type="select" name="courseId" id="courseId" required>
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id} selected={course.id === currentSubject.course.id}>
                      {course.name}
                    </option>
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
          Are you sure you want to delete the subject "{currentSubject?.name}"?
        </ModalBody>
        <ModalFooter className="d-flex justify-content-end">
          <Button color="danger" onClick={handleDeleteSubject}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default SubjectList;

