from rest_framework import serializers
from .models import Course, Subject, Staff, Day, Period, Timetable

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id','name','is_active','is_deleted']

class SubjectSerializer(serializers.ModelSerializer):
    # Use CourseSerializer for read operations to get course details like name
    course = CourseSerializer(read_only=True)
    # Use PrimaryKeyRelatedField for write operations to send course ID
    course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source='course', write_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'name', 'is_active', 'is_deleted', 'course', 'course_id']


class StaffSerializer(serializers.ModelSerializer):
    # Use SubjectSerializer for read operations to get full subject details
    subjects = SubjectSerializer(many=True, read_only=True)
    # Use PrimaryKeyRelatedField for write operations to send subject IDs
    subject_ids = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        many=True,
        source='subjects',  # Maps to the subjects field in the Staff model
        write_only=True
    )

    class Meta:
        model = Staff
        fields = ['id', 'name', 'subjects', 'subject_ids', 'is_active', 'is_deleted']

class DaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Day
        fields = '__all__'

class PeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Period
        fields = ['id', 'start_time', 'end_time', 'is_active', 'is_deleted']

    def validate(self, data):
        start_time = data['start_time']
        end_time = data['end_time']

        # Validate that start_time is before end_time
        if start_time >= end_time:
            raise serializers.ValidationError("The start time must be earlier than the end time.")

        # Check if the new period overlaps with any existing periods (that are not marked as deleted)
        overlapping_periods = Period.objects.filter(
            start_time__lt=end_time,  # Starts before this period ends
            end_time__gt=start_time,  # Ends after this period starts
            is_deleted=False
        )

        # If updating an existing period, exclude the current instance from the overlap check
        if self.instance:
            overlapping_periods = overlapping_periods.exclude(id=self.instance.id)

        # Raise error if any overlapping periods are found
        if overlapping_periods.exists():
            raise serializers.ValidationError("This period overlaps with an existing period.")

        return data

    
class TimetableSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    day = DaySerializer(read_only=True)
    period = PeriodSerializer(read_only=True)
    subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Timetable
        fields = ['id','course','day','period','subject','is_active','is_deleted']

