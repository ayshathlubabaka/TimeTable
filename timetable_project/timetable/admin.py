from django.contrib import admin
from .models import Course, Subject, Staff, Day, Period, Timetable

# Register your models here.
admin.site.register(Course)
admin.site.register(Subject)
admin.site.register(Staff)
admin.site.register(Day)
admin.site.register(Period)
admin.site.register(Timetable)