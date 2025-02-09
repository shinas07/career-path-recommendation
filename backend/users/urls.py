from django.urls import path
from .views import RegisterView, LoginView,LogoutView,RefreshTokenView,UserDetailView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('refresh/',RefreshTokenView.as_view(), name='refresh'),
    path('user/',UserDetailView.as_view(), name='user'),
]