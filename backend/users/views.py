from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db.utils import IntegrityError
import re

class RegisterView(APIView):
    def post(self, request):
        try:
            name = request.data.get('name')
            email = request.data.get('email')
            password = request.data.get('password')
            confirm_password = request.data.get('confirmPassword')

            # Validate required fields
            if not name:
                return Response(
                    {'error': 'Name is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not email:
                return Response(
                    {'error': 'Email is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not password or not confirm_password:
                return Response(
                    {'error': 'Password and confirm password are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate password match
            if password != confirm_password:
                return Response(
                    {'error': 'Passwords do not match'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate email format
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return Response(
                    {'error': 'Please enter a valid email address'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return Response(
                    {'error': 'Email is already registered'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create user
            try:
                user = User.objects.create(
                    name=name,
                    email=email,
                    username=email,  # Set username to email to avoid duplicate key error
                    password=make_password(password),
                    is_active=True
                )
            except IntegrityError as e:
                if 'username' in str(e):
                    return Response(
                        {'error': 'Email is already registered'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                return Response(
                    {'error': 'Registration failed. Please try again.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Serialize and return response
            serializer = UserSerializer(user)
            return Response({
                'success': True,
                'message': 'Registration successful! Please login to continue.',
                'user': serializer.data,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return Response({
                'error': 'Registration failed. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate input
        if not email or not password:
            return Response({"error": "Please provide both email and password"}, status=400)

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": UserSerializer(user).data,
                })
            else:
                return Response({"error": "Invalid credentials"}, status=400)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Failed to fetch user details"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"success": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid refresh token or logout failed'}, status=status.HTTP_400_BAD_REQUEST)
    

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            print('not refresh token')
            return Response({'error': 'Refresh token not found'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({'access': access_token}, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({'error': 'Invalid refresh token'}, status=status.HTTP_401_UNAUTHORIZED)