import factory
from .models import Project, UserProject
from django.contrib.auth.models import User
from Lib import random


# factory for the model project
class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    designation = factory.Faker('sentence', nb_words=3)
    objective = factory.Faker('text')
    code_project = factory.Faker('date_time')


# factory for the model USer
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Faker('name')
    password = "123456"


classifications = [
    'Scrum Master',
    'Project Owner',
    'Team Leader',
    'Responsible Development',
    'Responsible',
    'Conception',
    'Executive Assistant',
]


# factory for generate fake data for the model USerProject
class ProjectUsersFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProject

    user = factory.SubFactory(UserFactory)
    project = factory.SubFactory(ProjectFactory)
    classification = random.choice(classifications)


# factory for create user with a project
# see https://factoryboy.readthedocs.io/en/latest/recipes.html
class ProjectWithUserFactory(UserFactory):
    projectUser = factory.RelatedFactory(
        ProjectUsersFactory,
        factory_related_name='user',
    )
