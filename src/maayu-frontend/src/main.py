import flet as ft
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
import requests

API_URL = "http://127.0.0.1:5000/query"  # Ensure Flask is running

def main(page: ft.Page):
    page.title = "Maayu - Resume Query"
    
    chat_container = ft.Column(scroll=ft.ScrollMode.ALWAYS, expand=True)

    def send_message(e):
        user_text = user_input.value.strip()
        if not user_text:
            return
        
        # Show user message
        chat_container.controls.append(ft.Row(
            [ft.Container(ft.Text(f"You: {user_text}", size=14), padding=8, bgcolor=ft.colors.BLUE_100, border_radius=8)],
            alignment=ft.MainAxisAlignment.END
        ))

        page.update()
    
    def fetch_results(query):
        try:
            response = requests.post("http://localhost:8000/query", json={"query": query})
            if response.status_code == 200:
                return response.json().get("results", [])
            else:
                return [f"Error: {response.status_code}"]
        except Exception as e:
            return [f"Exception occurred: {e}"]

    
    search_button.on_click = search_REMOVED_BUCKET_NAME
    
    # Input Container (Fix for border_radius issue)
    input_row = ft.Container(
        content=ft.Row([
            upload_button,
            query_input,
            search_button
        ], alignment=ft.MainAxisAlignment.CENTER, spacing=10),
        height=50,
        width=500,
        border_radius=25,
        bgcolor=ft.colors.GREY_300,
        padding=10
    )
    
    result_area = ft.Column(scroll=ft.ScrollMode.ALWAYS)
    
    page.add(
        ft.Container(
            content=chat_container,
            expand=True,
            padding=10,
            bgcolor=ft.colors.GREY_50
        ),
        ft.Row([user_input, send_button], alignment=ft.MainAxisAlignment.SPACE_BETWEEN)
    )

ft.app(target=main)