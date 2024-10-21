from django.urls import path
from .views import CourseAPIView, SubjectAPIView, StaffAPIView, DayAPIView, PeriodAPIView, GenerateTimetableAPIView, ClearTimetableAPIView, TimetableAPIView, TimetableDetailView

urlpatterns = [
    path('courses/', CourseAPIView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseAPIView.as_view(), name='course-detail'),
    path('subjects/', SubjectAPIView.as_view(), name='subject-list-create'),
    path('subjects/<int:pk>/', SubjectAPIView.as_view(), name='subject-detail'),
    path('staff/', StaffAPIView.as_view(), name='staff-list-create'),
    path('staff/<int:pk>/', StaffAPIView.as_view(), name='staff'),
    path('days/', DayAPIView.as_view(), name='day-list-create'),
    path('periods/', PeriodAPIView.as_view(), name='period-list-create'),
    path('periods/<int:pk>/', PeriodAPIView.as_view(), name='period-detail'),
    path('timetables/generate/', GenerateTimetableAPIView.as_view(), name='generate_timetables'),
    path('timetables/clear/', ClearTimetableAPIView.as_view(), name='clear_timetables'),
    path('timetables/', TimetableAPIView.as_view(), name='timetable-list'),
    path('timetables/entry/<int:timetable_id>/', TimetableDetailView.as_view(), name='timetable_detail'),
]
