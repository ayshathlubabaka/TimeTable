from django.db import models

# Create your models here.

class Course(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Subject(models.Model):
    name = models.CharField(max_length=100)
    course = models.ForeignKey(Course, related_name='subjects', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Day(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
    ]

    name = models.CharField(max_length=20, choices=DAY_CHOICES, unique=True)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Period(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"

class Staff(models.Model):
    name = models.CharField(max_length=100)
    subjects = models.ManyToManyField(Subject, related_name='staff_members')
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Timetable(models.Model):
    course = models.ForeignKey('Course', related_name='timing_tables', on_delete=models.CASCADE)
    day = models.ForeignKey(Day, related_name='timetables', on_delete=models.CASCADE)
    period = models.ForeignKey(Period, related_name='timetables', on_delete=models.CASCADE)
    subject = models.ForeignKey('Subject', related_name='timetables', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('course', 'day', 'period')

    def __str__(self):
        return f"{self.course.name} - {self.day.name} - {self.period.start_time} - {self.subject.name}"
