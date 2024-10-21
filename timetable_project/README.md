# Timetable Generation Project

This project is designed to generate timetables for courses, subjects, and staff in an educational institution. It provides a backend API built with Django and PostgreSQL to manage the data related to courses, subjects, staff, and their respective schedules.

## Backend

### Requirements

- Python 3.x
- Django
- PostgreSQL

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ayshathlubabaka/timetable_project.git
   cd timetable
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the database:**
   - Ensure PostgreSQL is installed and running.
   - Create a database for the project (e.g., `timetable_db`).

5. **Update `settings.py`:**
   - Set the database configuration with your database name, user, and password.
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'timetable_db',
           'USER': '<your_username>',
           'PASSWORD': '<your_password>',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

6. **Run the command to create days:**
   ```bash
   python manage.py create_days
   ```

7. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```
   *Sample Superuser Creation:*
   - Username: admin
   - Email: admin@example.com
   - Password: your_password

8. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

9. **Load sample data (if any):**
   ```bash
   python manage.py loaddata <your_sample_data_file.json>
   ```

10. **Start the development server:**
    ```bash
    python manage.py runserver
    ```

### API Endpoints

- `GET /courses/` - List all courses
- `POST /courses/` - Create a new course
- `GET /courses/<int:pk>/` - Retrieve a specific course
- `PUT /courses/<int:pk>/` - Update a specific course
- `DELETE /courses/<int:pk>/` - Delete a specific course
- `GET /subjects/` - List all subjects
- `POST /subjects/` - Create a new subject
- `GET /subjects/<int:pk>/` - Retrieve a specific subject
- `PUT /subjects/<int:pk>/` - Update a specific subject
- `DELETE /subjects/<int:pk>/` - Delete a specific subject
- `GET /staff/` - List all staff members
- `POST /staff/` - Create a new staff member
- `GET /staff/<int:pk>/` - Retrieve a specific staff member
- `PUT /staff/<int:pk>/` - Update a specific staff member
- `DELETE /staff/<int:pk>/` - Delete a specific staff member
- `GET /days/` - List all days
- `POST /days/` - Create a new day
- `GET /periods/` - List all periods
- `POST /periods/` - Create a new period
- `GET /periods/<int:pk>/` - Retrieve a specific period
- `PUT /periods/<int:pk>/` - Update a specific period
- `DELETE /periods/<int:pk>/` - Delete a specific period
- `POST /timetables/generate/` - Generate timetables
- `POST /timetables/clear/` - Clear existing timetables
- `GET /timetables/` - List all timetables
- `GET /timetables/entry/<int:timetable_id>/` - Retrieve a specific timetable entry
