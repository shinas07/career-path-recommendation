# urls.py
from django.urls import path
from .views import UserDocumentUploadView,CareerRecommendationsView

urlpatterns = [
    path('upload-documents/', UserDocumentUploadView.as_view(), name='upload-documents'),
    path('career-recommendations/',CareerRecommendationsView.as_view(),name='career-recommendations')
]