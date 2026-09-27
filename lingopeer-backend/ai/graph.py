import json
import os
import re
from typing import Any, Dict, List, Optional, TypedDict
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import END, StateGraph

from ai.agents import get_agent_persona, build_system_prompt

# Check if OpenAI API key is configured
openai_api_key = os.environ.get("OPENAI_API_KEY")


class GraphState(TypedDict):
    agent_id: str
    language: str
    user_message: str
    history: List[Dict[str, str]]
    custom_prompt: Optional[str]
    tutor_reply: str
    corrections: List[Dict[str, Any]]
    vocabulary_tips: List[Dict[str, Any]]
    xp_earned: int


# -----------------------------------------------------------------------------
# Node 1: Tutor Node
# -----------------------------------------------------------------------------
def tutor_node(state: GraphState) -> Dict[str, Any]:
    agent = get_agent_persona(state["agent_id"])
    system_prompt = build_system_prompt(agent, state["language"], state.get("custom_prompt"))

    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key:
        try:
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.7,
                api_key=api_key,
            )

            lc_messages = [SystemMessage(content=system_prompt)]
            for msg in state.get("history", [])[-6:]:
                if msg.get("role") == "user":
                    lc_messages.append(HumanMessage(content=msg.get("content", "")))
                elif msg.get("role") == "assistant":
                    lc_messages.append(AIMessage(content=msg.get("content", "")))

            lc_messages.append(HumanMessage(content=state["user_message"]))
            res = llm.invoke(lc_messages)
            return {"tutor_reply": res.content}
        except Exception as e:
            # Fall back to simulated tutor if OpenAI API fails or quota exceeded
            pass

    # Simulated intelligent persona response
    user_text = state["user_message"].lower()
    lang = state["language"]
    name = agent.name

    if "hola" in user_text or "hello" in user_text or "hi" in user_text:
        reply = (
            f"¡Hola! Soy {name}. Qué alegría tenerte aquí para practicar {lang}. "
            f"¿De qué te gustaría hablar hoy? ¿Tu día, tus pasatiempos, o algo nuevo?"
        )
    elif "como estas" in user_text or "cómo estás" in user_text or "how are you" in user_text:
        reply = (
            f"¡Estoy muy bien, gracias por preguntar! Me encanta ayudarte a aprender {lang}. "
            f"¿Y tú, cómo va tu día?"
        )
    elif "gracias" in user_text or "thank" in user_text:
        reply = f"¡De nada! Es un placer ayudarte. ¿Qué más te gustaría practicar en {lang}?"
    else:
        reply = (
            f"¡Muy bien! Te entiendo perfectamente. Practicar {lang} así te ayudará a ganar fluidez rápido. "
            f"Dime, ¿puedes contarme un poco más sobre eso en {lang}?"
        )

    return {"tutor_reply": reply}


# -----------------------------------------------------------------------------
# Node 2: Grammar & Feedback Evaluator Node
# -----------------------------------------------------------------------------
def evaluator_node(state: GraphState) -> Dict[str, Any]:
    user_msg = state["user_message"]
    lang = state["language"]
    api_key = os.environ.get("OPENAI_API_KEY")

    if api_key:
        try:
            from langchain_openai import ChatOpenAI

            eval_prompt = (
                f"You are a language learning evaluator for {lang}. "
                f"Analyze the user's input: '{user_msg}'.\n"
                f"Return ONLY valid JSON with this exact schema:\n"
                f"{{\n"
                f'  "corrections": [{{"original": "...", "corrected": "...", "explanation": "..."}}],\n'
                f'  "vocabulary_tips": [{{"word": "...", "translation": "...", "example": "..."}}]\n'
                f"}}\n"
                f"If there are no grammar mistakes, corrections should be an empty list []. "
                f"Provide 1-2 relevant vocabulary tips for their message."
            )

            llm = ChatOpenAI(
                model="gpt-4o-mini",
                temperature=0.2,
                api_key=api_key,
            )
            res = llm.invoke([SystemMessage(content=eval_prompt)])
            cleaned = res.content.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            data = json.loads(cleaned.strip())
            return {
                "corrections": data.get("corrections", []),
                "vocabulary_tips": data.get("vocabulary_tips", []),
            }
        except Exception:
            pass

    # Heuristic / fallback evaluator for testing and offline development
    corrections = []
    vocab_tips = []
    lower = user_msg.lower()

    # Spanish basic heuristic checks
    if lang.lower() == "spanish":
        if "yo querer" in lower:
            corrections.append({
                "original": "yo querer",
                "corrected": "yo quiero",
                "explanation": "In Spanish, conjugate 'querer' in present tense for 'yo' -> 'yo quiero'."
            })
        if "yo ser" in lower:
            corrections.append({
                "original": "yo ser",
                "corrected": "yo soy",
                "explanation": "Use 'yo soy' for present tense conjugation of 'ser'."
            })
        if "la problema" in lower:
            corrections.append({
                "original": "la problema",
                "corrected": "el problema",
                "explanation": "'Problema' is masculine despite ending in -a (el problema)."
            })

        # Provide a helpful vocabulary tip
        vocab_tips.append({
            "word": "Conversar",
            "translation": "To chat / to talk",
            "example": "Me gusta conversar en español."
        })

    return {
        "corrections": corrections,
        "vocabulary_tips": vocab_tips,
    }


# -----------------------------------------------------------------------------
# Node 3: Progress & XP Evaluator Node
# -----------------------------------------------------------------------------
def progress_node(state: GraphState) -> Dict[str, Any]:
    # Base XP for taking a turn
    xp = 15
    # Extra XP for sentence complexity and effort
    word_count = len(state["user_message"].split())
    if word_count > 5:
        xp += 5
    if word_count > 12:
        xp += 10
    # Bonus for clean grammar (no corrections needed)
    if not state.get("corrections"):
        xp += 5

    return {"xp_earned": xp}


# -----------------------------------------------------------------------------
# Graph Assembly
# -----------------------------------------------------------------------------
def create_chat_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("tutor", tutor_node)
    workflow.add_node("evaluator", evaluator_node)
    workflow.add_node("progress", progress_node)

    workflow.set_entry_point("tutor")
    workflow.add_edge("tutor", "evaluator")
    workflow.add_edge("evaluator", "progress")
    workflow.add_edge("progress", END)

    return workflow.compile()


chat_graph = create_chat_graph()


async def execute_agent_chat(
    agent_id: str,
    language: str,
    user_message: str,
    history: Optional[List[Dict[str, str]]] = None,
    custom_prompt: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Executes the multi-agent LangGraph workflow.
    """
    initial_state: GraphState = {
        "agent_id": agent_id,
        "language": language,
        "user_message": user_message,
        "history": history or [],
        "custom_prompt": custom_prompt,
        "tutor_reply": "",
        "corrections": [],
        "vocabulary_tips": [],
        "xp_earned": 0,
    }

    result = await chat_graph.ainvoke(initial_state)
    return {
        "tutor_reply": result.get("tutor_reply", ""),
        "corrections": result.get("corrections", []),
        "vocabulary_tips": result.get("vocabulary_tips", []),
        "xp_earned": result.get("xp_earned", 20),
    }
