import flet as ft
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

        # Send request to Flask API
        response = requests.post(API_URL, json={"query": user_text})
        bot_response = response.json().get("response", "Error fetching response")

        # Show bot response
        chat_container.controls.append(ft.Row(
            [ft.Container(ft.Text(f"maayu: {bot_response}", size=14), padding=8, bgcolor=ft.colors.GREY_200, border_radius=8)],
            alignment=ft.MainAxisAlignment.START
        ))

        user_input.value = ""
        page.update()

    user_input = ft.TextField(hint_text="Type a message...", expand=True)
    send_button = ft.IconButton(icon=ft.icons.SEND, tooltip="Send", on_click=send_message)

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