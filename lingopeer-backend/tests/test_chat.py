import unittest
from fastapi.testclient import TestClient
from api.index import app

client = TestClient(app)


class TestChatAndAgents(unittest.TestCase):
    def test_list_agents(self):
        response = client.get("/agents")
        self.assertEqual(response.status_code, 200)
        agents = response.json()
        self.assertTrue(len(agents) >= 4)
        agent_names = [a["name"] for a in agents]
        self.assertIn("Sofia", agent_names)
        self.assertIn("Diego", agent_names)
        self.assertIn("Lucia", agent_names)
        self.assertIn("Mateo", agent_names)

    def test_get_single_agent(self):
        response = client.get("/agents/sofia")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], "sofia")
        self.assertEqual(data["name"], "Sofia")
        self.assertEqual(data["vibe"], "Casual")

    def test_create_and_get_chat_session(self):
        # 1. Create a session
        create_resp = client.post(
            "/chat/sessions",
            json={
                "agent_id": "sofia",
                "language": "Spanish",
                "title": "Practice Greetings",
            },
        )
        self.assertEqual(create_resp.status_code, 201)
        session = create_resp.json()
        session_id = session["id"]
        self.assertEqual(session["agent_id"], "sofia")
        self.assertEqual(session["language"], "Spanish")

        # 2. Get session details
        get_resp = client.get(f"/chat/sessions/{session_id}")
        self.assertEqual(get_resp.status_code, 200)
        fetched = get_resp.json()
        self.assertEqual(fetched["id"], session_id)
        self.assertEqual(fetched["title"], "Practice Greetings")

    def test_send_message_and_langgraph_workflow(self):
        # 1. Create session
        create_resp = client.post(
            "/chat/sessions",
            json={
                "agent_id": "diego",
                "language": "Spanish",
            },
        )
        self.assertEqual(create_resp.status_code, 201)
        session_id = create_resp.json()["id"]

        # 2. Send message with grammar error
        msg_resp = client.post(
            f"/chat/sessions/{session_id}/message",
            json={"content": "¡Hola Diego! Yo querer aprender español."},
        )
        self.assertEqual(msg_resp.status_code, 200)
        data = msg_resp.json()

        # Verify LangGraph output structure
        self.assertEqual(data["session_id"], session_id)
        self.assertTrue(len(data["tutor_reply"]["content"]) > 0)
        self.assertEqual(data["user_message"]["role"], "user")
        self.assertEqual(data["tutor_reply"]["role"], "assistant")
        self.assertGreater(data["xp_earned"], 0)

        # Check grammar feedback
        corrections = data["corrections"]
        self.assertTrue(len(corrections) > 0)
        first_correction = corrections[0]
        self.assertIn("querer", first_correction["original"].lower())
        self.assertIn("quiero", first_correction["corrected"].lower())

        # 3. Check history has 2 messages
        history_resp = client.get(f"/chat/sessions/{session_id}")
        self.assertEqual(history_resp.status_code, 200)
        history = history_resp.json()
        self.assertEqual(len(history["messages"]), 2)

    def test_user_progress(self):
        response = client.get("/user/progress?language=Spanish")
        self.assertEqual(response.status_code, 200)
        prog = response.json()
        self.assertEqual(prog["language"], "Spanish")
        self.assertGreaterEqual(prog["total_xp"], 0)
        self.assertGreaterEqual(prog["streak_days"], 1)


if __name__ == "__main__":
    unittest.main()
