import os
import json
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
import parser
from docx import Document
import io

# Load environment variables from .env
load_dotenv()

# Define the required Google Drive scope
SCOPES = ["https://www.googleapis.com/auth/drive"]

def authenticate():
    """Authenticate and return Google Drive API credentials."""
    creds = None

    # Check if token.json exists (for stored credentials)
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If no valid credentials, create new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Load credentials from environment variables
            client_config = {
                "installed": {
                    "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                    "project_id": os.getenv("GOOGLE_PROJECT_ID"),
                    "auth_uri": os.getenv("GOOGLE_AUTH_URI"),
                    "token_uri": os.getenv("GOOGLE_TOKEN_URI"),
                    "auth_provider_x509_cert_url": os.getenv("GOOGLE_AUTH_PROVIDER_CERT_URL"),
                    "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                }
            }

            # Run authentication flow
            flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
            creds = flow.run_local_server(port=3000)


    return creds

def find_folder_by_path(service, folder_path):
    """
    Finds a nested folder using its full path (e.g., 'SharedFolder/SubFolder/NestedFolder').
    
    :param service: Google Drive API service
    :param folder_path: Full folder path as a string
    :return: Folder ID if found, otherwise None
    """
    service = service

    folder_names = folder_path.split("/")  # Split path into individual folder names
    parent_id = None  # Start search from the root level (Shared With Me)

    for folder_name in folder_names:
        query = "mimeType = 'application/vnd.google-apps.folder'"
        if parent_id:
            query += f" and '{parent_id}' in parents"  
        else:
            query += " and sharedWithMe = true" 

        try:
            results = service.files().list(q=query, fields="files(id, name)").execute()
            folders = results.get("files", [])

            # Find the matching folder
            matched_folder = next((f for f in folders if f["name"] == folder_name), None)
            if not matched_folder:
                print(f"Folder '{folder_name}' not found in path '{folder_path}'")
                return None  # Stop if a folder in the chain is missing

            parent_id = matched_folder["id"]  # Move to the next folder in the hierarchy
            print(f"Found folder: {folder_name} (ID: {parent_id})")

        except HttpError as error:
            print(f"⚠️ Error searching for folder: {error}")
            return None

    return parent_id  # Returns the final folder ID if the whole path is valid


# def read_drive_file(service, file_id):
#     try:
#         request = service.files().get_media(fileId=file_id)
#         return request.execute().decode("utf-8", errors="ignore")  # Convert bytes to text
#     except HttpError as error:
#         print(f"Error reading file {file_id}: {error}")
#         return None

def read_drive_file(service, file_id):
    try:
        request = service.files().get_media(fileId=file_id)
        file_stream = io.BytesIO(request.execute())  # Read binary content into a BytesIO stream
        
        # Open DOCX file using python-docx
        doc = Document(file_stream)
        text = "\n".join([p.text for p in doc.paragraphs])  # Extract paragraphs
        
        return text
    except HttpError as error:
        print(f"Error reading file {file_id}: {error}")
        return None

def process_files_in_folder(service, folder_id, json_folder_path):
    query = f"'{folder_id}' in parents"
    results = service.files().list(q=query, fields="files(id, name, mimeType)").execute()
    files = results.get("files", [])

    for file in files:
        file_id = file["id"]
        file_name = file["name"]
        mime_type = file["mimeType"]

        if mime_type in ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"]:
            print(f"Processing: {file_name}")

            file_content = read_drive_file(service, file_id)  # Read without downloading
            
            if file_content:
                json_filename = os.path.join(json_folder_path, file_name + ".json")
                parser.generate_json(file_content, json_filename)
        
        break

def list_files_in_folder(folder_id):
    """Lists all files in a given folder iteratively."""
    creds = authenticate()

    try:
        service = build("drive", "v3", credentials=creds)

        # Query to list files inside the folder
        query = f"'{folder_id}' in parents"
        results = service.files().list(q=query, fields="files(id, name)").execute()
        files = results.get("files", [])

        if not files:
            print("No files found in the folder.")
            return []

        print("Files in folder:")
        for file in files:
            print(f"{file['name']} (ID: {file['id']})")

        return files  

    except HttpError as error:
        print(f"An error occurred: {error}")
        return None

def main():
    folder_name = "Maayu/Docs+Resources/Resume-Docs" 
    json_folder_path = "json_output"  # Folder to store processed JSON files

    creds = authenticate()
    service = build("drive", "v3", credentials=creds)

    folder_id = find_folder_by_path(service, folder_name)
    if folder_id:
        process_files_in_folder(service, folder_id, json_folder_path)

if __name__ == "__main__":
    main()