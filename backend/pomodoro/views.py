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
        serializer = TaskSerializer(data=req.data)
        if serializer.is_valid():
            serializer.save(user=req.user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, req: Request):
        tasks = Task.objects.filter(user=req.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    def delete(self, _, task_id):
        Task.objects.filter(id=task_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def put(self, req: Request, task_id):
        task = Task.objects.get(id=task_id)
        serializer = TaskSerializer(task, data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)