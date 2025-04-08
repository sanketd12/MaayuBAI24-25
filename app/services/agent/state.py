from dataclasses import dataclass, field

@dataclass(kw_only=True)
class SlackbotState:
    user_question: str = field(default=None) # User question
    final_response: str = field(default=None) # Final response

@dataclass(kw_only=True)
class SlackbotStateInput:
    user_question: str = field(default=None) # User question

@dataclass(kw_only=True)
class SlackbotStateOutput:
    final_response: str = field(default=None) # Final response