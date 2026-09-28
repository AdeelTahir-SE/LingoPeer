from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CreateSessionRequest(BaseModel):
    agent_id: str = Field(..., description="ID of chosen agent (e.g. sofia, diego, lucia, mateo)")
    language: Optional[str] = Field("Spanish", description="Target learning language")
    title: Optional[str] = Field(None, description="Optional custom session title")
    custom_prompt: Optional[str] = Field(None, description="Optional focus area or custom goal")


class SendMessageRequest(BaseModel):
    content: str = Field(..., min_length=1, description="User message to the tutor")


class CorrectionItem(BaseModel):
    original: str
    corrected: str
    explanation: str


class VocabularyTipItem(BaseModel):
    word: str
    translation: str
    example: str


class MessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    corrections: Optional[List[CorrectionItem]] = []
    vocabulary_tips: Optional[List[VocabularyTipItem]] = []
    created_at: str


class ChatSessionResponse(BaseModel):
    id: str
    user_id: str
    agent_id: str
    language: str
    title: str
    system_prompt: Optional[str] = None
    created_at: str
    updated_at: str
    messages: Optional[List[MessageResponse]] = []


class ChatTurnResponse(BaseModel):
    session_id: str
    user_message: MessageResponse
    tutor_reply: MessageResponse
    corrections: List[CorrectionItem]
    vocabulary_tips: List[VocabularyTipItem]
    xp_earned: int


class UserProgressResponse(BaseModel):
    user_id: str
    language: str
    total_xp: int
    streak_days: int
    words_learned: int
    sessions_completed: int
    last_practice_date: str


class TranscribeAudioRequest(BaseModel):
    audio_base64: str = Field(..., description="Base64 encoded audio recording (m4a, wav, mp3)")
    language: Optional[str] = Field(None, description="Optional target language hint (e.g. es, en, fr)")


class TranscribeAudioResponse(BaseModel):
    text: str
    language: Optional[str] = None
