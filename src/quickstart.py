import os
import json
from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load environment variables from .env file
load_dotenv()

# Set scopes for API access
SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly"]

def get_credentials():
    """Retrieve Google API credentials from .env variables."""
    creds = None
    
    # Check if token.json exists
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    # If no valid credentials, create new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            client_config = {
                "installed": {
                    "client_id": os.getenv("CLIENT_ID"),
                    "project_id": os.getenv("PROJECT_ID"),
                    "auth_uri": os.getenv("AUTH_URI"),
                    "token_uri": os.getenv("TOKEN_URI"),
                    "auth_provider_x509_cert_url": os.getenv("AUTH_PROVIDER_CERT_URL"),
                    "client_secret": os.getenv("CLIENT_SECRET"),
                }
            }
            
            flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
            creds = flow.run_local_server(port=0)

            # Save the credentials for next use
            with open("token.json", "w") as token:
                token.write(creds.to_json())

    return creds

def main():
    """Lists the first 10 files in Google Drive using API."""
    creds = get_credentials()

    try:
        service = build("drive", "v3", credentials=creds)

        # Call the Drive API
        results = service.files().list(pageSize=10, fields="files(id, name)").execute()
        items = results.get("files", [])

        if not items:
            print("No files found.")
            return

        print("Files:")
        for item in items:
            print(f"{item['name']} ({item['id']})")
    except HttpError as error:
        print(f"An error occurred: {error}")

if __name__ == "__main__":
    main()
