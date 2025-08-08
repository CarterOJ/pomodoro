from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

# Create your views here.

class TaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, req: Request):
        name = req.data.get("name")
        work_cycles = int(req.data.get("workCycles"))
        notes = req.data.get("notes")
        Task.objects.create(user=req.user, name=name, work_cycles=work_cycles, notes=notes)
        return Response(status=status.HTTP_201_CREATED)
    
    def get(self, req: Request):
        tasks = Task.objects.filter(user=req.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)