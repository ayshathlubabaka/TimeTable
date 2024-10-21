import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from 'reactstrap';
import Swal from 'sweetalert2';

const TimetableList = () => {
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Fetch all timetables on component mount
    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/timetables/');

                // Group timetables by course
                const groupedByCourse = response.data.reduce((acc, timetable) => {
                    const courseId = timetable.course.id;
                    if (!acc[courseId]) {
                        acc[courseId] = {
                            courseName: timetable.course.name,
                            timetables: []
                        };
                    }
                    acc[courseId].timetables.push(timetable);
                    return acc;
                }, {});

                setTimetables(groupedByCourse);
                setSelectedCourseId(Object.keys(groupedByCourse)[0]); // Select first course by default
                setLoading(false);
            } catch (err) {
                setError('Error fetching timetables');
                setLoading(false);
            }
        };
        fetchTimetables();
    }, []);

    const generateTimetable = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/timetables/generate/');
    
            // Check if existing timetables were found
            if (response.data.clear_timetables) {
                const { isConfirmed } = await Swal.fire({
                    title: 'Timetables Already Exist!',
                    text: 'Do you want to clear and regenerate them?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, clear them!',
                    cancelButtonText: 'No, keep them'
                });
    
                if (isConfirmed) {
                    // Call API to clear timetables and generate new ones
                    await axios.post('http://127.0.0.1:8000/api/timetables/clear/');
                    await axios.post('http://127.0.0.1:8000/api/timetables/generate/');
                    await Swal.fire('Success!', 'Timetables cleared and new ones generated successfully!', 'success');
                }
            } else {
                await Swal.fire('Success!', 'Timetables generated successfully!', 'success');
            }
            window.location.reload();  // Reload the page to fetch updated timetables
        } catch (err) {
            await Swal.fire('Error!', 'Error generating timetables', 'error');
        }
    };
    

    // Organize timetables by period and day
    const organizeTimetables = (timetablesForCourse) => {
        const organizedData = {};
        
        timetablesForCourse.forEach(timetable => {
            const day = timetable.day.name;
            const period = timetable.period.start_time + ' - ' + timetable.period.end_time;

            if (!organizedData[period]) {
                organizedData[period] = {}; // Initialize periods
            }
            organizedData[period][day] = timetable.subject.name;
        });

        return organizedData;
    };

    // Get organized timetables for the selected course
    const selectedCourseTimetables = selectedCourseId ? timetables[selectedCourseId]?.timetables || [] : [];
    const organizedTimetables = organizeTimetables(selectedCourseTimetables);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-100 border shadow-lg p-5">
                <Row>
                    <Col lg="10">
                        <Card>
                            <CardTitle tag="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center">
                                <span>
                                    <i className="bi bi-calendar me-2"> </i>
                                    Timetable Listings
                                </span>
                                <Button color="success" onClick={generateTimetable}>
                                    Generate Timetable
                                </Button>
                            </CardTitle>

                            <CardBody>
                                {/* Navbar for Course Selection */}
                                <nav className="timetable-navbar mb-3">
                                    {Object.entries(timetables).map(([courseId, courseData]) => (
                                        <Button 
                                            key={courseId} 
                                            className={`m-1 ${selectedCourseId === courseId ? 'active' : ''}`}
                                            onClick={() => setSelectedCourseId(courseId)}
                                        >
                                            {courseData.courseName}
                                        </Button>
                                    ))}
                                </nav>

                                {/* Display timetable for the selected course */}
                                {selectedCourseTimetables.length > 0 ? (
                                    <div className="timetable-content">
                                        <h2 className="timetable-title">Timetable for: {timetables[selectedCourseId].courseName}</h2>
                                        <Table bordered striped>
                                            <thead>
                                                <tr>
                                                    <th className="timetable-header">Period</th>
                                                    {daysOfWeek.map((day, index) => (
                                                        <th key={index} className="timetable-header">{day}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.keys(organizedTimetables).map((period, index) => (
                                                    <tr key={index}>
                                                        <td className="timetable-period">{period}</td>
                                                        {daysOfWeek.map((day) => (
                                                            <td key={day} className="timetable-cell">
                                                                {organizedTimetables[period][day] || 'No Class'}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : (
                                    <p>No timetables available for the selected course</p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default TimetableList;

