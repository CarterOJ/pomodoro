from django.urls import path
from .views import TaskView

urlpatterns = [
    path('tasks/', TaskView.as_view(), name='tasks'),
    path('tasks/<int:task_id>/', TaskView.as_view(), name='task')
]