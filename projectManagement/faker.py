import factory
from .models import Project
from django.contrib.auth.models import User


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    objective = factory.Faker('sentence', nb_words=4)
    designation = factory.Faker('text')
    code_project = factory.Faker('date_time')
