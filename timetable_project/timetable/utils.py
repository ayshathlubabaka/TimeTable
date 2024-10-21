import random
from .models import Course, Period, Subject, Timetable, Staff, Day

def generate_timetables_for_all_courses():
    courses = Course.objects.filter(is_active=True, is_deleted=False)
    periods = Period.objects.filter(is_deleted=False)
    days = Day.objects.all()

    print("Courses:", courses)
    print("Periods:", periods)
    print("Days:", days)

    if not courses.exists():
        print("No active courses found.")
        return []
    if not periods.exists():
        print("No periods found.")
        return []

    for course in courses:
        print(f"Processing course: {course}")
        subjects = list(course.subjects.filter(is_active=True, is_deleted=False))
        if not subjects:
            print(f"Warning: No active subjects for course {course.name}.")
            continue  # Skip this course if no subjects

        timetable_entries = []
        staff_schedule = {staff.id: {day.id: [] for day in days} for staff in Staff.objects.filter(is_active=True, is_deleted=False)}

        for day in days:
            for period in periods:
                assigned = False
                random.shuffle(subjects)  # Shuffle subjects for randomness

                # Try to assign a subject to the period
                for subject in subjects:
                    staff_members = subject.staff_members.filter(is_active=True, is_deleted=False)

                    if not staff_members:
                        print(f"Warning: No staff members assigned to subject {subject.name}.")
                        continue  # Skip if no staff members for this subject

                    # Try to assign a staff member who is available for the period
                    for staff in staff_members:
                        if period.id not in staff_schedule[staff.id][day.id]:
                            # Staff is available for this period on this day
                            timetable_entries.append(
                                Timetable(course=course, period=period, subject=subject, day=day)
                            )
                            staff_schedule[staff.id][day.id].append(period.id)  # Mark staff as assigned
                            assigned = True
                            print(f"Assigned {subject.name} to {staff.name} for {course.name} on {day.name} at {period.start_time}")
                            break  # Exit staff loop as we've assigned a staff member

                    if assigned:
                        break  # Exit subject loop as we've assigned a subject

                if not assigned:
                    print(f"Warning: No available subject or staff for {course.name} on {day.name} during period {period.start_time}")

        # Once assignments are done for the course, bulk create the timetable entries
        if timetable_entries:
            try:
                Timetable.objects.bulk_create(timetable_entries)
                print(f"Timetable for course {course.name} created successfully!")
            except Exception as e:
                print(f"Error during bulk creation for course {course.name}: {str(e)}")
                raise

    return len(timetable_entries)  # Return count of entries created
