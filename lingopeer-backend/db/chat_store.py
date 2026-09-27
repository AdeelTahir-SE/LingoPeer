import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from db.client import client


class ChatStore:
    """
    Data Access Layer for chat sessions, messages, and user progress.
    Interacts with Supabase PostgreSQL tables with an in-memory fallback
    if the database tables are pending creation.
    """

    def __init__(self):
        # In-memory stores for resilience / local development
        self._local_sessions: Dict[str, Dict[str, Any]] = {}
        self._local_messages: Dict[str, List[Dict[str, Any]]] = {}
        self._local_progress: Dict[str, Dict[str, Any]] = {}

    def _now_iso(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    # -------------------------------------------------------------------------
    # Sessions
    # -------------------------------------------------------------------------
    def create_session(
        self,
        user_id: str,
        agent_id: str,
        language: str = "Spanish",
        title: Optional[str] = None,
        system_prompt: Optional[str] = None,
    ) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        created_at = self._now_iso()
        session_data = {
            "id": session_id,
            "user_id": user_id,
            "agent_id": agent_id,
            "language": language,
            "title": title or f"Practice {language} with {agent_id.capitalize()}",
            "system_prompt": system_prompt,
            "created_at": created_at,
            "updated_at": created_at,
        }

        try:
            res = client.table("chat_sessions").insert(session_data).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass  # Fall back to local memory

        self._local_sessions[session_id] = session_data
        self._local_messages[session_id] = []
        return session_data

    def get_user_sessions(self, user_id: str) -> List[Dict[str, Any]]:
        try:
            res = (
                client.table("chat_sessions")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            if res.data is not None:
                return res.data
        except Exception:
            pass

        return [
            s for s in self._local_sessions.values() if s.get("user_id") == user_id
        ]

    def get_session(self, session_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        try:
            query = client.table("chat_sessions").select("*").eq("id", session_id)
            if user_id:
                query = query.eq("user_id", user_id)
            res = query.execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

        session = self._local_sessions.get(session_id)
        if session and (not user_id or session.get("user_id") == user_id):
            return session
        return None

    # -------------------------------------------------------------------------
    # Messages
    # -------------------------------------------------------------------------
    def save_message(
        self,
        session_id: str,
        role: str,
        content: str,
        corrections: Optional[List[Dict[str, Any]]] = None,
        vocabulary_tips: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        msg_id = str(uuid.uuid4())
        created_at = self._now_iso()
        msg_data = {
            "id": msg_id,
            "session_id": session_id,
            "role": role,
            "content": content,
            "corrections": corrections or [],
            "vocabulary_tips": vocabulary_tips or [],
            "created_at": created_at,
        }

        try:
            res = client.table("messages").insert(msg_data).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

        if session_id not in self._local_messages:
            self._local_messages[session_id] = []
        self._local_messages[session_id].append(msg_data)
        return msg_data

    def get_session_messages(self, session_id: str) -> List[Dict[str, Any]]:
        try:
            res = (
                client.table("messages")
                .select("*")
                .eq("session_id", session_id)
                .order("created_at", desc=False)
                .execute()
            )
            if res.data is not None:
                return res.data
        except Exception:
            pass

        return self._local_messages.get(session_id, [])

    # -------------------------------------------------------------------------
    # User Progress
    # -------------------------------------------------------------------------
    def get_user_progress(self, user_id: str, language: str = "Spanish") -> Dict[str, Any]:
        try:
            res = (
                client.table("user_progress")
                .select("*")
                .eq("user_id", user_id)
                .eq("language", language)
                .execute()
            )
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

        key = f"{user_id}:{language}"
        if key not in self._local_progress:
            self._local_progress[key] = {
                "user_id": user_id,
                "language": language,
                "total_xp": 120,
                "streak_days": 3,
                "words_learned": 45,
                "sessions_completed": 4,
                "last_practice_date": self._now_iso(),
            }
        return self._local_progress[key]

    def add_user_progress(
        self,
        user_id: str,
        language: str = "Spanish",
        xp_gain: int = 20,
        words_gain: int = 1,
    ) -> Dict[str, Any]:
        curr = self.get_user_progress(user_id, language)
        new_xp = curr.get("total_xp", 0) + xp_gain
        new_words = curr.get("words_learned", 0) + words_gain
        updated_data = {
            "user_id": user_id,
            "language": language,
            "total_xp": new_xp,
            "streak_days": curr.get("streak_days", 1),
            "words_learned": new_words,
            "sessions_completed": curr.get("sessions_completed", 0) + 1,
            "last_practice_date": self._now_iso(),
        }

        try:
            res = (
                client.table("user_progress")
                .upsert(updated_data, on_conflict="user_id,language")
                .execute()
            )
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception:
            pass

        key = f"{user_id}:{language}"
        self._local_progress[key] = updated_data
        return updated_data


chat_store = ChatStore()
