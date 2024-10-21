from django.core.management.base import BaseCommand
from timetable.models import Day

class Command(BaseCommand):
    help = 'Create days in the database'

    def handle(self, *args, **kwargs):
        days_to_create = [choice[0] for choice in Day.DAY_CHOICES]

        for day_name in days_to_create:
            if not Day.objects.filter(name=day_name, is_deleted=False).exists():
                Day.objects.create(name=day_name)
                self.stdout.write(self.style.SUCCESS(f'Successfully created day: {day_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Day already exists: {day_name}'))