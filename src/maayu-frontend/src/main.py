import flet as ft
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)


def main(page: ft.Page):
    page.title = "Maayu - Resume Query"
    page.bgcolor = ft.colors.WHITE
    page.padding = 50
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    
    # Logo
    logo = ft.Row([
        ft.Text("maayu", size=24, weight=ft.FontWeight.BOLD, color=ft.colors.BLUE_900, italic=True),
        ft.Icon(ft.icons.ARROW_FORWARD, color=ft.colors.ORANGE_700)
    ], alignment=ft.MainAxisAlignment.START)
    
    # Heading
    heading = ft.Text("How can I assist you today?",
                      size=20, italic=True, color=ft.colors.BLUE_600, text_align=ft.TextAlign.CENTER)
    
    # Query Input and Buttons
    query_input = ft.TextField(hint_text="Type a message...", border_radius=20, expand=True, bgcolor=ft.colors.GREY_300)
    upload_button = ft.IconButton(ft.icons.UPLOAD, icon_color=ft.colors.BLUE_700)
    search_button = ft.IconButton(ft.icons.SEND, icon_color=ft.colors.BLUE_700)
    
    def search_REMOVED_BUCKET_NAME(e):
        query = query_input.value
        if not query:
            page.snack_bar = ft.SnackBar(ft.Text("Please enter a query.", color="red"))
            page.snack_bar.open = True
        else:
            results = fetch_results(query)
            result_area.controls = [ft.Text(f"{r}") for r in results] if results else [ft.Text("No matches found.")]
        page.update()
    
    def fetch_results(query):
        sample_data = [
            "Alice - Python, ML, Data Science",
            "Bob - JavaScript, React, Node.js",
            "Charlie - Java, Spring, AWS"
        ]
        return [r for r in sample_data if any(skill.lower() in r.lower() for skill in query.split(","))]
    
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
        ft.Column([
            logo,
            heading,
            input_row,
            result_area
        ], alignment=ft.MainAxisAlignment.CENTER, horizontal_alignment=ft.CrossAxisAlignment.CENTER, spacing=20)
    )

ft.app(target=main)