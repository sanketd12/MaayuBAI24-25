import flet as ft
import warnings
import requests

warnings.filterwarnings("ignore", category=DeprecationWarning)

API_URL = "http://localhost:8000/query"  # FastAPI backend

def main(page: ft.Page):
    page.title = "Maayu - Resume Query"
    page.bgcolor = ft.colors.WHITE
    page.padding = 50
    page.vertical_alignment = ft.MainAxisAlignment.CENTER

    # Logo/Header
    logo = ft.Row([
        ft.Text("maayu", size=28, weight=ft.FontWeight.BOLD, color=ft.colors.BLUE_900, italic=True),
        ft.Icon(ft.icons.ARROW_FORWARD, color=ft.colors.ORANGE_700)
    ], alignment=ft.MainAxisAlignment.START)

    heading = ft.Text("How can I assist you today?",
                      size=20, italic=True, color=ft.colors.BLUE_600, text_align=ft.TextAlign.CENTER)

    # Chat area
    chat_area = ft.Column(expand=True, scroll=ft.ScrollMode.ALWAYS)

    # Input field
    user_input = ft.TextField(
    hint_text="Type a message...",
    expand=True,
    border_radius=20,
    bgcolor=ft.colors.GREY_200,
    color=ft.colors.BLACK  # 👈 Add this
    )

    send_button = ft.IconButton(
        icon=ft.icons.SEND,
        icon_color=ft.colors.BLUE_700,
        tooltip="Send",
    )

    upload_button = ft.IconButton(
        icon=ft.icons.UPLOAD_FILE,
        icon_color=ft.colors.BLUE_700,
        tooltip="Upload (Not implemented)"
    )

    def fetch_results(query):
        try:
            response = requests.post(API_URL, json={"query": query})
            if response.status_code == 200:
                return response.json().get("results", [])
            else:
                return [f"Error: {response.status_code}"]
        except Exception as e:
            return [f"Exception occurred: {e}"]

    def send_query(e):
        query = user_input.value.strip()
        if not query:
            return

        # Show user message
        chat_area.controls.append(
            ft.Row([
                ft.Container(
                    content=ft.Text(f"You: {query}", size=14, color=ft.colors.BLACK),
                    padding=10,
                    bgcolor=ft.colors.BLUE_200,
                    border_radius=10
                ),
                ft.Icon(ft.icons.ACCOUNT_CIRCLE, size=30, color=ft.colors.BLUE_700)
                
            ], alignment=ft.MainAxisAlignment.END)
        )

        # Get results from backend
        results = fetch_results(query)
        for res in results:
            chat_area.controls.append(
                ft.Row([
                    ft.Container(
                        content=ft.Text(res, size=14, color = ft.colors.BLACK, no_wrap=False),
                        padding=10,
                        bgcolor=ft.colors.GREY_400,
                        border_radius=1,
                        width=500
                    )
                ], alignment=ft.MainAxisAlignment.START)
            )

        user_input.value = ""
        page.update()

    send_button.on_click = send_query

    # Input row with rounded container
    input_row = ft.Container(
        content=ft.Row([
            upload_button,
            user_input,
            send_button
        ], spacing=10, alignment=ft.MainAxisAlignment.CENTER),
        bgcolor=ft.colors.GREY_300,
        border_radius=25,
        height=60,
        padding=10
    )

    # Full page layout
    page.add(
        ft.Column([
            logo,
            heading,
            ft.Divider(),
            chat_area,
            input_row
        ], spacing=20, expand=True)
    )

ft.app(target=main, view=ft.AppView.WEB_BROWSER)
