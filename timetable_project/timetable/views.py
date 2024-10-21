# views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Course, Subject, Staff, Day, Period, Timetable
from .serializers import CourseSerializer, SubjectSerializer, StaffSerializer, DaySerializer, PeriodSerializer, TimetableSerializer
from .utils import generate_timetables_for_all_courses
from django.shortcuts import get_object_or_404
from django.db.models import Q

class CourseAPIView(APIView):
    
    # Get all courses or a single course
    def get(self, request, pk=None):
        if pk:
            try:
                course = Course.objects.get(pk=pk, is_deleted=False)
                serializer = CourseSerializer(course)
            except Course.DoesNotExist:
                return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response(serializer.data)
        else:
            courses = Course.objects.filter(is_deleted=False)
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data)
    
    # Create a new course
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Update a course completely (PUT) or partially (PATCH)
    def put(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk, is_deleted=False)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk, is_deleted=False)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Soft delete a course
    def delete(self, request, pk=None):
        try:
            course = Course.objects.get(pk=pk, is_deleted=False)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        course.is_deleted = True
        course.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Subject API View
class SubjectAPIView(APIView):
    # Get all subjects or a specific subject
    def get(self, request, pk=None):
        if pk:
            try:
                subject = Subject.objects.get(pk=pk, is_deleted=False)
                serializer = SubjectSerializer(subject)
            except Subject.DoesNotExist:
                return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response(serializer.data)
        else:
            subjects = Subject.objects.filter(is_deleted=False)
            serializer = SubjectSerializer(subjects, many=True)
            return Response(serializer.data)

    # Create a new subject
    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update a subject (PUT)
    def put(self, request, pk=None):
        try:
            subject = Subject.objects.get(pk=pk, is_deleted=False)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubjectSerializer(subject, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Partially update a subject (PATCH)
    def patch(self, request, pk=None):
        try:
            subject = Subject.objects.get(pk=pk, is_deleted=False)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SubjectSerializer(subject, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Soft delete a subject
    def delete(self, request, pk=None):
        try:
            subject = Subject.objects.get(pk=pk, is_deleted=False)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found'}, status=status.HTTP_404_NOT_FOUND)

        subject.is_deleted = True
        subject.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Staff API View
class StaffAPIView(APIView):
    # Get all staff members or a specific staff member
    def get(self, request, pk=None):
        if pk:
            try:
                staff = Staff.objects.get(pk=pk, is_deleted=False)
                serializer = StaffSerializer(staff)
            except Staff.DoesNotExist:
                return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response(serializer.data)
        else:
            staff_members = Staff.objects.filter(is_deleted=False)
            serializer = StaffSerializer(staff_members, many=True)
            return Response(serializer.data)

    # Create a new staff member
    def post(self, request):
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update a staff member (PUT)
    def put(self, request, pk=None):
        try:
            staff = Staff.objects.get(pk=pk, is_deleted=False)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StaffSerializer(staff, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Partially update a staff member (PATCH)
    def patch(self, request, pk=None):
        try:
            staff = Staff.objects.get(pk=pk, is_deleted=False)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StaffSerializer(staff, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Soft delete a staff member
    def delete(self, request, pk=None):
        try:
            staff = Staff.objects.get(pk=pk, is_deleted=False)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

        staff.is_deleted = True
        staff.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class DayAPIView(APIView):
    # Handles List (GET) and Create (POST) for days

    def get(self, request):
        # List all days
        days = Day.objects.filter(is_deleted=False)
        serializer = DaySerializer(days, many=True)
        return Response(serializer.data)


class PeriodAPIView(APIView):
    # Handles List (GET), Create (POST), Retrieve (GET), Update (PUT/PATCH), and Soft Delete (DELETE)

    def get(self, request, pk=None):
        if pk:
            # Retrieve a single Period if pk is provided
            period = get_object_or_404(Period, pk=pk, is_deleted=False)
            serializer = PeriodSerializer(period)
            return Response(serializer.data)
        else:
            # List all periods if pk is not provided
            periods = Period.objects.filter(is_deleted=False)
            serializer = PeriodSerializer(periods, many=True)
            return Response(serializer.data)

    def post(self, request):
        data = request.data
        
        if isinstance(data, list):
            # Handle bulk creation
            created_periods = []
            for period_data in data:
                serializer = PeriodSerializer(data=period_data)
                if serializer.is_valid():
                    start_time = serializer.validated_data['start_time']
                    end_time = serializer.validated_data['end_time']

                    # Validate if there's any overlap with other periods
                    if not Period.objects.filter(
                        Q(start_time__lt=end_time, end_time__gt=start_time),
                        is_deleted=False
                    ).exists():
                        serializer.save()
                        created_periods.append(serializer.data)
            return Response(created_periods, status=status.HTTP_201_CREATED)

        else:
            # Handle single creation
            serializer = PeriodSerializer(data=data)
            if serializer.is_valid():
                start_time = serializer.validated_data['start_time']
                end_time = serializer.validated_data['end_time']

                # Validate if there's any overlap with other periods
                if not Period.objects.filter(
                    Q(start_time__lt=end_time, end_time__gt=start_time),
                    is_deleted=False
                ).exists():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)

                return Response({"error": "Period overlaps with an existing period."}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        # Update an entire period
        period = get_object_or_404(Period, pk=pk, is_deleted=False)
        serializer = PeriodSerializer(period, data=request.data)
        if serializer.is_valid():
            # Validate overlapping time during update
            start_time = serializer.validated_data['start_time']
            end_time = serializer.validated_data['end_time']
            
            if Period.objects.filter(
                Q(start_time__lt=end_time, end_time__gt=start_time) & ~Q(pk=pk),
                is_deleted=False
            ).exists():
                return Response({"error": "Period overlaps with an existing period."}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk=None):
        # Partially update a period
        period = get_object_or_404(Period, pk=pk, is_deleted=False)
        serializer = PeriodSerializer(period, data=request.data, partial=True)
        if serializer.is_valid():
            # Validate overlapping time during update
            start_time = serializer.validated_data.get('start_time', period.start_time)
            end_time = serializer.validated_data.get('end_time', period.end_time)

            if Period.objects.filter(
                Q(start_time__lt=end_time, end_time__gt=start_time) & ~Q(pk=pk),
                is_deleted=False
            ).exists():
                return Response({"error": "Period overlaps with an existing period."}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        # Soft delete the period
        period = get_object_or_404(Period, pk=pk, is_deleted=False)
        period.is_deleted = True
        period.save()
        return Response({"message": "Period soft deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


import traceback

class GenerateTimetableAPIView(APIView):
    def post(self, request):
        # Check for existing timetables
        existing_timetables = Timetable.objects.all()

        if existing_timetables.exists():
            return Response({
                'message': 'Existing timetables found. Do you want to clear them?',
                'clear_timetables': True  # Indicates that there are existing timetables
            }, status=status.HTTP_200_OK)

        # No existing timetables, proceed to generate
        try:
            generate_timetables_for_all_courses()
            return Response({'message': 'Timetables generated successfully for all courses!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Print full traceback for debugging purposes
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# View to handle clearing timetables based on user confirmation
class ClearTimetableAPIView(APIView):
    def post(self, request):
        try:
            Timetable.objects.all().delete()
            return Response({'message': 'Existing timetables cleared successfully!'}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({'message': 'Timetables not cleared.'}, status=status.HTTP_400_BAD_REQUEST)
        
# class TimetableAPIView(APIView):
#     serializer_class = TimetableSerializer

#     def get(self, request, course_id):
#         # Get the timetables for the specified course
#         timetables = Timetable.objects.filter(course_id=course_id, is_deleted=False)
        
#         # Serialize the queryset
#         serializer = self.serializer_class(timetables, many=True)
        
#         # Return the serialized data in the response
#         return Response(serializer.data)

#     # If you want to add more methods (like POST, PATCH, DELETE), you can do so here

class TimetableAPIView(APIView):
    serializer_class = TimetableSerializer

    def get(self, request):
        # Get all timetables where `is_deleted=False`
        timetables = Timetable.objects.filter(is_deleted=False)
        
        # Serialize the queryset
        serializer = self.serializer_class(timetables, many=True)
        
        # Return the serialized data in the response
        return Response(serializer.data)
    
class TimetableDetailView(APIView):
    def get_object(self, timetable_id):
        try:
            return Timetable.objects.get(id=timetable_id, is_deleted=False)
        except Timetable.DoesNotExist:
            return None

    def patch(self, request, timetable_id):
        timetable_entry = self.get_object(timetable_id)
        if not timetable_entry:
            return Response({'error': 'Timetable entry not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TimetableSerializer(timetable_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, timetable_id):
        timetable_entry = self.get_object(timetable_id)
        if not timetable_entry:
            return Response({'error': 'Timetable entry not found'}, status=status.HTTP_404_NOT_FOUND)

        timetable_entry.is_deleted = True
        timetable_entry.save()
        return Response({'message': 'Timetable entry deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)