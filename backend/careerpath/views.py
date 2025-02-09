# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserDocument
from .serializers import UserDocumentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
import json
import csv
import io
import requests
from django.conf import settings
import google.generativeai as genai
import re
import pandas as pd
from django.core.files.base import ContentFile



# class UserDocumentUploadView(APIView):
#     def post(self, request):
#         # Check if the request contains files
   
#         if 'gradeCard' not in request.FILES or 'certifications' not in request.FILES:
#             return Response({"error": "Both grade card and certifications are required."}, status=status.HTTP_400_BAD_REQUEST)

#         # Check for existing documents for the user
#         existing_documents = UserDocument.objects.filter(user=request.user)

#         # If documents exist, delete them
#         if existing_documents.exists():
#             existing_documents.delete()  

#         user_document = UserDocument(
#             user=request.user,  # Assuming you have user authentication
#             grade_card=request.FILES['gradeCard'],
#             certifications=request.FILES['certifications']
#         )
#         # Save the instance to the database
#         try:
#             user_document.save()
#             return Response({"message": "Documents uploaded successfully."}, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserDocumentUploadView(APIView):
    def convert_file_to_text(self, file):
        """Convert uploaded file (CSV or JSON) to formatted text."""
        try:
            file_content = file.read()
            file_name = file.name.lower()
            
            if file_name.endswith('.csv'):
                # Handle CSV file
                content = file_content.decode('utf-8')
                df = pd.read_csv(ContentFile(file_content))
                text_content = "CSV Content:\n\n"
                
                # Convert DataFrame to formatted text
                for index, row in df.iterrows():
                    text_content += f"Record {index + 1}:\n"
                    for column in df.columns:
                        text_content += f"{column}: {row[column]}\n"
                    text_content += "\n"
                
                return text_content
                
            elif file_name.endswith('.json'):
                # Handle JSON file
                data = json.loads(file_content.decode('utf-8'))
                text_content = "JSON Content:\n\n"
                
                # Handle both array and object formats
                if isinstance(data, list):
                    items = data
                elif isinstance(data, dict):
                    items = data.get('grades', []) or data.get('certifications', [])
                else:
                    items = []
                
                for idx, item in enumerate(items, 1):
                    text_content += f"Record {idx}:\n"
                    for key, value in item.items():
                        text_content += f"{key}: {value}\n"
                    text_content += "\n"
                
                return text_content
            
            return "Unsupported file format"
            
        except Exception as e:
            print(f"Error converting file: {str(e)}")
            return f"Error processing file: {str(e)}"

    def post(self, request):
        try:
            # Validate file uploads
            if 'gradeCard' not in request.FILES or 'certifications' not in request.FILES:
                return Response(
                    {"error": "Both grade card and certifications are required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Delete existing documents for the user
            existing_documents = UserDocument.objects.filter(user=request.user)
            if existing_documents.exists():
                existing_documents.delete()

            # Convert files to text
            grade_card_text = self.convert_file_to_text(request.FILES['gradeCard'])
            certifications_text = self.convert_file_to_text(request.FILES['certifications'])

            # Create new UserDocument instance
            user_document = UserDocument(
                user=request.user,
                grade_card=request.FILES['gradeCard'],
                certifications=request.FILES['certifications'],
                converted_grade_card=grade_card_text,
                converted_certifications=certifications_text
            )

            # Save to database
            user_document.save()

            # Store in session for career recommendations
            request.session['academic_data'] = {
                'grades': self.parse_grades(grade_card_text),
                'certifications': self.parse_certifications(certifications_text)
            }
            request.session.modified = True

            return Response({
                "message": "Documents uploaded and converted successfully.",
                "grade_card_preview": grade_card_text[:200] + "...",
                "certifications_preview": certifications_text[:200] + "..."
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Upload error: {str(e)}")
            return Response(
                {"error": f"Error processing documents: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def parse_grades(self, text_content):
        """Parse grades from converted text to structured format."""
        grades = []
        current_record = {}
        
        for line in text_content.split('\n'):
            if line.startswith('Record'):
                if current_record:
                    grades.append(current_record)
                    current_record = {}
            elif ':' in line:
                key, value = line.split(':', 1)
                current_record[key.strip()] = value.strip()
        
        if current_record:
            grades.append(current_record)
        
        return grades

    def parse_certifications(self, text_content):
        """Parse certifications from converted text to structured format."""
        certifications = []
        current_record = {}
        
        for line in text_content.split('\n'):
            if line.startswith('Record'):
                if current_record:
                    certifications.append(current_record)
                    current_record = {}
            elif ':' in line:
                key, value = line.split(':', 1)
                current_record[key.strip()] = value.strip()
        
        if current_record:
            certifications.append(current_record)
        
        return certifications

class CareerRecommendationsView(APIView):
    def parse_career_response(self, response_text):
        try:
            career_recommendations = []
            # Split by job titles
            job_sections = response_text.split('**Job Title:')[1:]  # Skip the first empty split
            
            for section in job_sections:
                recommendation = {
                    'title': '',
                    'match': [],
                    'skills': [],
                    'timeline': '',
                    'growth': []
                }
                
                # Parse title
                recommendation['title'] = section.split('**')[0].strip()
                
                # Parse why it's a good match
                if "Why it's a good match:" in section:
                    match_section = section.split("Why it's a good match:**")[1].split("**Additional")[0]
                    matches = [
                        m.strip()
                        .replace('* ', '')
                        .replace('*', '')  # Remove any stray asterisks
                        for m in match_section.split('\n') 
                        if '*' in m and m.strip() != '*'  # Skip lines that are just asterisks
                    ]
                    recommendation['match'] = [m for m in matches if m and not m.isspace()]
                
                # Parse additional skills
                if "Additional skills to develop:" in section:
                    skills_section = section.split("Additional skills to develop:**")[1].split("**Estimated")[0]
                    skills = [
                        s.strip()
                        .replace('* ', '')
                        .replace('*', '')  # Remove any stray asterisks
                        for s in skills_section.split('\n') 
                        if '*' in s and s.strip() != '*'  # Skip lines that are just asterisks
                    ]
                    recommendation['skills'] = [s for s in skills if s and not s.isspace()]
                
                # Parse timeline
                if "Estimated timeline for preparation:" in section:
                    timeline_section = section.split("Estimated timeline for preparation:**")[1].split("**Growth")[0]
                    recommendation['timeline'] = timeline_section.strip().replace('*', '')
                
                # Parse growth opportunities
                if "Growth opportunities:" in section:
                    growth_section = section.split("Growth opportunities:**")[1].split("\n\n")[0]
                    growth = [
                        g.strip().replace('*', '')  # Remove any stray asterisks
                        for g in growth_section.split(',')
                    ]
                    recommendation['growth'] = [g for g in growth if g and not g.isspace()]
                
                career_recommendations.append(recommendation)
            
            return career_recommendations
            
        except Exception as e:
            print(f"Error parsing career response: {str(e)}")
          
            return []

    def get_career_suggestions(self, skills, grades):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            As a career counselor, suggest the best career paths based on this profile:
            
            Skills & Certifications: {', '.join(skills)}
            Academic Performance: {', '.join(grades)}
            
            Please provide 3 career recommendations with EXACTLY this format for each recommendation:
            
            **Job Title: [title]**
            
            * **Why it's a good match:**
              * [specific match point 1]
              * [specific match point 2]
              * [specific match point 3]
            
            * **Additional skills to develop:**
              * [specific skill 1]
              * [specific skill 2]
              * [specific skill 3]
            
            * **Estimated timeline for preparation:** [specific timeline]
            
            * **Growth opportunities:** [opportunity 1], [opportunity 2], [opportunity 3]

            IMPORTANT:
            - Keep growth opportunities as a comma-separated list
            - Do not use bullet points for growth opportunities
            - Ensure each growth opportunity is separated by commas
            """
            
            response = model.generate_content(prompt)
            raw_text = response.text

            # Parse the response into structured data
            parsed_recommendations = self.parse_career_response(raw_text)

        
            return parsed_recommendations
            
        except Exception as e:
            print(f"Career suggestion error: {str(e)}")
            return []

    def get(self, request):
        try:
            user_doc = UserDocument.objects.filter(user=request.user).latest('uploaded_at')
            topics = []
            grades = []

            # Process grade card data
            if user_doc.converted_grade_card:
                records = user_doc.converted_grade_card.split('Record')
                for record in records:
                    if not record.strip():  # Skip empty records
                        continue
                    
                    # Initialize variables for each record
                    subject = None
                    grade = None
                    year = None
                    
                    # Process each line in the record
                    for line in record.split('\n'):
                        line = line.strip()
                        if not line:  # Skip empty lines
                            continue
                            
                        if ':' in line:  # Only process lines with ':'
                            key, value = line.split(':', 1)
                            key = key.strip()
                            value = value.strip()
                            
                            if key == 'Subject':
                                subject = value
                            elif key == 'Grade':
                                grade = value
                            elif key == 'Year':
                                year = value

                    # If we have both subject and grade, and grade meets criteria
                    if subject and grade and grade in ['A', 'A+', 'A-', 'B+', 'B']:
                        topics.append(subject)
                        grades.append(f"{subject}: {grade}")
                      

            # Process certification data
            if user_doc.converted_certifications:
                records = user_doc.converted_certifications.split('Record')
                for record in records:
                    if not record.strip():  # Skip empty records
                        continue
                    
                    # Initialize variables for each record
                    name = None
                    provider = None
                    date = None
                    
                    # Process each line in the record
                    for line in record.split('\n'):
                        line = line.strip()
                        if not line:  # Skip empty lines
                            continue
                            
                        if ':' in line:  # Only process lines with ':'
                            key, value = line.split(':', 1)
                            key = key.strip().lower()  # Convert key to lowercase
                            value = value.strip()
                            
                            if key == 'name':
                                name = value
                            elif key == 'provider':
                                provider = value
                            elif key == 'date':
                                date = value

                    # If we have a valid certification name
                    if name:
                        topics.append(name)
                        print(f"Added certification: {name}")

          

            if not topics and not grades:
                print('no topics and no grades')
                return Response({
                    'error': 'No valid grades or certifications found in the documents'
                }, status=status.HTTP_400_BAD_REQUEST)

            
            career_recommendations = self.get_career_suggestions(topics, grades)

            # Get tutorials
            tutorials = []
            min_tutorials_per_topic = 3  # Minimum tutorials we want per topic

            for topic in topics:
                try:
                    # First API call for topic-specific tutorials
                    response = requests.get(
                        "https://www.googleapis.com/youtube/v3/search",
                        params={
                            'part': 'snippet',
                            'q': f"{topic} programming tutorial",  # Added 'programming' for better results
                            'maxResults': min_tutorials_per_topic,
                            'type': 'video',  # Only get videos
                            'relevanceLanguage': 'en',  # English results
                            'videoDuration': 'medium',  # Medium length videos
                            'key': settings.YOUTUBE_API_KEY
                        }
                    )
                    
                    if response.status_code == 200:
                        items = response.json().get('items', [])
                        topic_tutorials = []
                        
                        for item in items:
                            if 'id' in item and 'videoId' in item['id']:
                                topic_tutorials.append({
                                    'topic': topic,
                                    'title': item['snippet']['title'],
                                    'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                                    'thumbnail': item['snippet']['thumbnails']['medium']['url']
                                })
                        
                        # If we didn't get enough tutorials, try a broader search
                        if len(topic_tutorials) < min_tutorials_per_topic:
                            broader_response = requests.get(
                                "https://www.googleapis.com/youtube/v3/search",
                                params={
                                    'part': 'snippet',
                                    'q': f"learn {topic} tutorial",
                                    'maxResults': min_tutorials_per_topic - len(topic_tutorials),
                                    'type': 'video',
                                    'relevanceLanguage': 'en',
                                    'key': settings.YOUTUBE_API_KEY
                                }
                            )
                            
                            if broader_response.status_code == 200:
                                broader_items = broader_response.json().get('items', [])
                                for item in broader_items:
                                    if 'id' in item and 'videoId' in item['id']:
                                        topic_tutorials.append({
                                            'topic': topic,
                                            'title': item['snippet']['title'],
                                            'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                                            'thumbnail': item['snippet']['thumbnails']['medium']['url']
                                        })
                        
                        # If we still don't have enough tutorials, add some fallback ones
                        while len(topic_tutorials) < min_tutorials_per_topic:
                            topic_tutorials.append({
                                'topic': topic,
                                'title': f"Learn {topic} - Comprehensive Tutorial",
                                'url': f"https://www.youtube.com/results?search_query={topic}+tutorial",
                                'thumbnail': "https://via.placeholder.com/320x180.png"
                            })
                        
                        tutorials.extend(topic_tutorials)
                     
                except Exception as e:
                    print(f"YouTube API error for {topic}: {str(e)}")
                    # Add fallback tutorials if API fails
                    for i in range(min_tutorials_per_topic):
                        tutorials.append({
                            'topic': topic,
                            'title': f"Learn {topic} - Tutorial {i+1}",
                            'url': f"https://www.youtube.com/results?search_query={topic}+tutorial",
                            'thumbnail': "https://via.placeholder.com/320x180.png"
                        })

            # Ensure we have a good mix of tutorials
            tutorials = sorted(tutorials, key=lambda x: (x['topic'], x['title']))

            return Response({
                'tutorials': tutorials,
                'topics_found': topics,
                'career_recommendations': career_recommendations,
                'grades': grades  # Added grades to response
            }, status=status.HTTP_200_OK)

        except UserDocument.DoesNotExist:
            return Response({
                'error': 'No documents found for this user'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Final error: {str(e)}")
            return Response({
                'error': 'An error occurred while processing your request',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

