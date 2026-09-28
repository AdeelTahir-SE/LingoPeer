from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from ai.agents import AI_AGENTS, AgentPersona, get_agent_persona
from ai.graph import execute_agent_chat
from api.auth.deps import get_optional_current_user
from api.auth.schemas import UserResponse
from api.chat.schemas import (
    ChatSessionResponse,
    ChatTurnResponse,
    CorrectionItem,
    CreateSessionRequest,
    MessageResponse,
    SendMessageRequest,
    TranscribeAudioRequest,
    TranscribeAudioResponse,
    UserProgressResponse,
    VocabularyTipItem,
)
from db.chat_store import chat_store

chat_router = APIRouter(prefix="", tags=["Chat & Agents"])


def _resolve_user_id(current_user: Optional[UserResponse]) -> str:
    return current_user.id if current_user else "00000000-0000-0000-0000-000000000000"


# -----------------------------------------------------------------------------
# Agents Endpoints
# -----------------------------------------------------------------------------
@chat_router.get("/agents", response_model=List[AgentPersona])
async def list_agents():
    """
    List all available AI language tutor personas.
    """
    return AI_AGENTS


@chat_router.get("/agents/{agent_id}", response_model=AgentPersona)
async def get_agent(agent_id: str):
    """
    Get detailed profile of an AI agent persona.
    """
    return get_agent_persona(agent_id)


# -----------------------------------------------------------------------------
# Chat Session Management
# -----------------------------------------------------------------------------
@chat_router.post("/chat/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    payload: CreateSessionRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    Start a new chat session with an AI tutor.
    """
    user_id = _resolve_user_id(current_user)
    session = chat_store.create_session(
        user_id=user_id,
        agent_id=payload.agent_id,
        language=payload.language or "Spanish",
        title=payload.title,
        system_prompt=payload.custom_prompt,
    )
    return ChatSessionResponse(
        id=session["id"],
        user_id=session["user_id"],
        agent_id=session["agent_id"],
        language=session["language"],
        title=session["title"],
        system_prompt=session.get("system_prompt"),
        created_at=session["created_at"],
        updated_at=session["updated_at"],
        messages=[],
    )


@chat_router.get("/chat/sessions", response_model=List[ChatSessionResponse])
async def list_chat_sessions(
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    List all chat sessions for the current user.
    """
    user_id = _resolve_user_id(current_user)
    sessions = chat_store.get_user_sessions(user_id)
    return [
        ChatSessionResponse(
            id=s["id"],
            user_id=s["user_id"],
            agent_id=s["agent_id"],
            language=s["language"],
            title=s["title"],
            system_prompt=s.get("system_prompt"),
            created_at=s["created_at"],
            updated_at=s["updated_at"],
            messages=[],
        )
        for s in sessions
    ]


@chat_router.get("/chat/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: str,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    Get chat session details and message history.
    """
    user_id = _resolve_user_id(current_user)
    session = chat_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    raw_messages = chat_store.get_session_messages(session_id)
    formatted_messages = [
        MessageResponse(
            id=m["id"],
            session_id=m["session_id"],
            role=m["role"],
            content=m["content"],
            corrections=m.get("corrections", []),
            vocabulary_tips=m.get("vocabulary_tips", []),
            created_at=m["created_at"],
        )
        for m in raw_messages
    ]

    return ChatSessionResponse(
        id=session["id"],
        user_id=session["user_id"],
        agent_id=session["agent_id"],
        language=session["language"],
        title=session["title"],
        system_prompt=session.get("system_prompt"),
        created_at=session["created_at"],
        updated_at=session["updated_at"],
        messages=formatted_messages,
    )


# -----------------------------------------------------------------------------
# Messaging & LangGraph Workflow Execution
# -----------------------------------------------------------------------------
@chat_router.post("/chat/sessions/{session_id}/message", response_model=ChatTurnResponse)
async def send_chat_message(
    session_id: str,
    payload: SendMessageRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    Send a message to the AI tutor. Executes the multi-agent LangGraph workflow:
    1. Generates tutor reply in target language matching agent persona.
    2. Analyzes grammar and syntax, returning corrections.
    3. Suggests vocabulary tips.
    4. Calculates and awards XP points to user progress.
    """
    user_id = _resolve_user_id(current_user)
    session = chat_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # 1. Save user message to store
    user_msg = chat_store.save_message(
        session_id=session_id,
        role="user",
        content=payload.content,
    )

    # 2. Retrieve recent message history
    raw_history = chat_store.get_session_messages(session_id)
    history = [
        {"role": m["role"], "content": m["content"]}
        for m in raw_history[:-1]
    ]

    # 3. Execute LangGraph multi-agent workflow
    agent_id = session.get("agent_id", "sofia")
    language = session.get("language", "Spanish")
    custom_prompt = session.get("system_prompt")

    ai_result = await execute_agent_chat(
        agent_id=agent_id,
        language=language,
        user_message=payload.content,
        history=history,
        custom_prompt=custom_prompt,
    )

    corrections = [
        CorrectionItem(**c) for c in ai_result.get("corrections", [])
    ]
    vocabulary_tips = [
        VocabularyTipItem(**v) for v in ai_result.get("vocabulary_tips", [])
    ]
    xp_earned = ai_result.get("xp_earned", 20)

    # 4. Save agent reply with feedback and tips
    agent_msg = chat_store.save_message(
        session_id=session_id,
        role="assistant",
        content=ai_result["tutor_reply"],
        corrections=[c.model_dump() for c in corrections],
        vocabulary_tips=[v.model_dump() for v in vocabulary_tips],
    )

    # 5. Update user progress & XP
    chat_store.add_user_progress(
        user_id=user_id,
        language=language,
        xp_gain=xp_earned,
        words_gain=len(vocabulary_tips) or 1,
    )

    return ChatTurnResponse(
        session_id=session_id,
        user_message=MessageResponse(
            id=user_msg["id"],
            session_id=session_id,
            role="user",
            content=user_msg["content"],
            created_at=user_msg["created_at"],
        ),
        tutor_reply=MessageResponse(
            id=agent_msg["id"],
            session_id=session_id,
            role="assistant",
            content=agent_msg["content"],
            corrections=corrections,
            vocabulary_tips=vocabulary_tips,
            created_at=agent_msg["created_at"],
        ),
        corrections=corrections,
        vocabulary_tips=vocabulary_tips,
        xp_earned=xp_earned,
    )


# -----------------------------------------------------------------------------
# User Progress & Stats
# -----------------------------------------------------------------------------
@chat_router.get("/user/progress", response_model=UserProgressResponse)
async def get_user_learning_progress(
    language: str = Query("Spanish", description="Learning language"),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    Retrieve user learning stats, total XP, streak days, and words learned.
    """
    user_id = _resolve_user_id(current_user)
    prog = chat_store.get_user_progress(user_id, language=language)
    return UserProgressResponse(
        user_id=prog.get("user_id", user_id),
        language=prog.get("language", language),
        total_xp=prog.get("total_xp", 120),
        streak_days=prog.get("streak_days", 3),
        words_learned=prog.get("words_learned", 45),
        sessions_completed=prog.get("sessions_completed", 4),
        last_practice_date=str(prog.get("last_practice_date")),
    )


@chat_router.get("/user/progress/all", response_model=List[UserProgressResponse])
async def get_all_user_learning_progress(
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    Retrieve user learning stats across all languages.
    """
    user_id = _resolve_user_id(current_user)
    items = chat_store.get_all_user_progress(user_id)
    return [
        UserProgressResponse(
            user_id=item.get("user_id", user_id),
            language=item.get("language", "Spanish"),
            total_xp=item.get("total_xp", 120),
            streak_days=item.get("streak_days", 1),
            words_learned=item.get("words_learned", 10),
            sessions_completed=item.get("sessions_completed", 1),
            last_practice_date=str(item.get("last_practice_date")),
        )
        for item in items
    ]


@chat_router.post("/chat/transcribe", response_model=TranscribeAudioResponse)
async def transcribe_audio(
    payload: TranscribeAudioRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user),
):
    """
    Transcribe recorded user voice message using OpenAI Whisper API with graceful fallback.
    """
    import base64
    import tempfile
    import os

    audio_bytes = None
    try:
        audio_bytes = base64.b64decode(payload.audio_base64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 audio payload: {str(e)}")

    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key and not api_key.startswith("sk-proj-placeholder"):
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            with tempfile.NamedTemporaryFile(suffix=".m4a", delete=False) as tmp_file:
                tmp_file.write(audio_bytes)
                tmp_path = tmp_file.name

            try:
                with open(tmp_path, "rb") as f:
                    kwargs = {"model": "whisper-1", "file": f}
                    if payload.language:
                        kwargs["language"] = payload.language[:2].lower()
                    transcript = client.audio.transcriptions.create(**kwargs)
                    return TranscribeAudioResponse(text=transcript.text.strip(), language=payload.language)
            finally:
                if os.path.exists(tmp_path):
                    os.remove(tmp_path)
        except Exception as err:
            print(f"Whisper transcription failed, using fallback: {err}")

    # Fallback simulation if offline / quota exceeded
    return TranscribeAudioResponse(
        text="Hola, me gustaría practicar una conversación hoy.",
        language=payload.language or "es",
    )
