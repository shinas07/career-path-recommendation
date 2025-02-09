from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# class UserDocument(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     grade_card = models.FileField(upload_to='grade_cards/')
#     certifications = models.FileField(upload_to='certifications/')
#     uploaded_at = models.DateTimeField(auto_now_add=True)


class UserDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    grade_card = models.FileField(upload_to='grade_cards/')
    certifications = models.FileField(upload_to='certifications/')
    converted_grade_card = models.TextField(blank=True, null=True)  # Store converted text
    converted_certifications = models.TextField(blank=True, null=True)  # Store converted text
    uploaded_at = models.DateTimeField(auto_now_add=True)

