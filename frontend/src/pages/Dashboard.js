// Dashboard.js
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add Bootstrap for styling
import CourseList from '../components/CourseList';
import SubjectList from '../components/SubjectList';
import StaffList from '../components/StaffList';
import PeriodList from '../components/PeriodList';
import TimetableList from '../components/TimetableList';

const Sidebar = ({ children }) => {
  const sidebarStyle = {
    position: 'absolute',
    width: '230px',
    height: '100%',
    background: '#2A3F54',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
  };

  return <div className="sidebar" style={sidebarStyle}>{children}</div>;
};

const PageView = ({ content }) => {
  const viewStyles = {
    marginLeft: '230px',
    padding: '10px 20px 0',
  };
  return (
    <div style={viewStyles}>
      {content}
    </div>
  );
};

const MenuItem = ({ title, icon, onClick }) => {
  return (
    <a href="#" className="menu-item" onClick={onClick}>
      <i className={'fa fa-fw fa-' + icon}></i>
      {title}
    </a>
  );
};

const Menu = ({ pages, onSelect }) => {
  const navStyle = {
    display: 'block',
    width: '100%',
  };
  return (
    <nav style={navStyle}>
      {pages.map((page) => (
        <MenuItem
          key={page.id}
          title={page.name}
          icon={page.icon}
          onClick={() => onSelect(page.id)} // Handle menu item click
        />
      ))}
    </nav>
  );
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [
        { id: '1', name: 'Courses', icon: 'file' },
        { id: '2', name: 'Subjects', icon: 'home' },
        { id: '3', name: 'Staffs', icon: 'clipboard' },
        { id: '4', name: 'Periods', icon: 'code-fork' },
        { id: '5', name: 'Timetables', icon: 'database' },
      ],
      selectedPage: null, // Track selected page
    };
  }

  handleSelect = (pageId) => {
    this.setState({ selectedPage: pageId }); // Update selected page
  };

  renderContent = () => {
    const { selectedPage } = this.state;
    switch (selectedPage) {
      case '1':
        return <CourseList />; // Render CourseList for "Courses"
      case '2':
        return <SubjectList />; // Replace with your Subjects component
      case '3':
        return <StaffList />; // Replace with your Staffs component
      case '4':
        return <PeriodList />; // Replace with your Periods component
      case '5':
        return <TimetableList /> // Replace with your Timetables component
        
      default:
        return <div>Select a menu item to view content.</div>; // Default content
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <Sidebar>
            <Menu pages={this.state.pages} onSelect={this.handleSelect} />
          </Sidebar>
          <PageView content={this.renderContent()} />
        </div>
      </div>
    );
  }
}

export default Dashboard;

