import unittest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from api.index import app
from supabase_auth.errors import AuthApiError

client = TestClient(app)


class TestAuthEndpoints(unittest.TestCase):
    def test_root_endpoint(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "running")

    def test_google_auth_url(self):
        response = client.get("/auth/google/url?redirect_to=http://localhost:8081/callback")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["provider"], "google")
        self.assertIn("https://", data["url"])
        self.assertIn("provider=google", data["url"])

    def test_api_google_auth_url_alias(self):
        response = client.get("/api/auth/google/url")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["provider"], "google")
        self.assertIn("url", data)

    def test_register_validation_error(self):
        # Invalid email and short password (< 6 chars)
        response = client.post("/auth/register", json={"email": "notanemail", "password": "123"})
        self.assertEqual(response.status_code, 422)

    def test_login_validation_error(self):
        # Empty body
        response = client.post("/auth/login", json={})
        self.assertEqual(response.status_code, 422)

    def test_protected_me_without_token(self):
        response = client.get("/auth/me")
        # FastAPI HTTPBearer returns 401 when Authorization header is missing
        self.assertIn(response.status_code, [401, 403])

    def test_protected_me_with_invalid_token(self):
        response = client.get("/auth/me", headers={"Authorization": "Bearer invalid.token.value"})
        self.assertEqual(response.status_code, 401)

    @patch("api.auth.router.sign_in_with_password")
    def test_login_success_mock(self, mock_sign_in):
        mock_user = MagicMock()
        mock_user.id = "user-123-uuid"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {"full_name": "Test User"}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "mock-access-token"
        mock_session.refresh_token = "mock-refresh-token"
        mock_session.token_type = "bearer"
        mock_session.expires_in = 3600

        mock_auth_res = MagicMock()
        mock_auth_res.user = mock_user
        mock_auth_res.session = mock_session
        mock_sign_in.return_value = mock_auth_res

        response = client.post(
            "/auth/login",
            json={"email": "test@example.com", "password": "securepassword123"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["access_token"], "mock-access-token")
        self.assertEqual(data["user"]["email"], "test@example.com")
        self.assertEqual(data["user"]["id"], "user-123-uuid")

    @patch("api.auth.router.sign_in_with_password")
    def test_login_failure_auth_error(self, mock_sign_in):
        mock_sign_in.side_effect = AuthApiError("Invalid login credentials", 400, "invalid_grant")

        response = client.post(
            "/auth/login",
            json={"email": "test@example.com", "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("Invalid login credentials", data["detail"])

    @patch("api.auth.router.sign_up_user")
    def test_register_success_mock(self, mock_sign_up):
        mock_user = MagicMock()
        mock_user.id = "new-user-uuid"
        mock_user.email = "newuser@example.com"
        mock_user.user_metadata = {"full_name": "New User"}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_auth_res = MagicMock()
        mock_auth_res.user = mock_user
        mock_auth_res.session = None  # simulates email confirmation flow
        mock_sign_up.return_value = mock_auth_res

        response = client.post(
            "/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "strongpassword123",
                "full_name": "New User",
            },
        )
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["user"]["email"], "newuser@example.com")
        self.assertIn("verify your email", data["message"].lower())

    @patch("api.auth.deps.get_user_by_token")
    def test_protected_me_success_mock(self, mock_get_user):
        mock_user = MagicMock()
        mock_user.id = "user-123-uuid"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {"full_name": "Test User"}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_user_res = MagicMock()
        mock_user_res.user = mock_user
        mock_get_user.return_value = mock_user_res

        response = client.get(
            "/auth/me",
            headers={"Authorization": "Bearer valid-mock-token"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], "user-123-uuid")
        self.assertEqual(data["email"], "test@example.com")

    @patch("api.auth.router.sign_in_with_id_token")
    def test_google_id_token_success_mock(self, mock_sign_in_id_token):
        mock_user = MagicMock()
        mock_user.id = "google-user-uuid"
        mock_user.email = "googleuser@gmail.com"
        mock_user.user_metadata = {"full_name": "Google User"}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "google-access-token"
        mock_session.refresh_token = "google-refresh-token"
        mock_session.token_type = "bearer"
        mock_session.expires_in = 3600

        mock_auth_res = MagicMock()
        mock_auth_res.user = mock_user
        mock_auth_res.session = mock_session
        mock_sign_in_id_token.return_value = mock_auth_res

        response = client.post(
            "/auth/google/id-token",
            json={"id_token": "valid-google-id-token"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["access_token"], "google-access-token")
        self.assertEqual(data["user"]["email"], "googleuser@gmail.com")

    @patch("api.auth.router.exchange_code_for_session")
    def test_oauth_callback_success_mock(self, mock_exchange):
        mock_user = MagicMock()
        mock_user.id = "oauth-user-uuid"
        mock_user.email = "oauth@gmail.com"
        mock_user.user_metadata = {}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "oauth-access-token"
        mock_session.refresh_token = "oauth-refresh-token"
        mock_session.token_type = "bearer"
        mock_session.expires_in = 3600

        mock_auth_res = MagicMock()
        mock_auth_res.user = mock_user
        mock_auth_res.session = mock_session
        mock_exchange.return_value = mock_auth_res

        response = client.get("/auth/callback?code=mock_oauth_code")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["access_token"], "oauth-access-token")

    @patch("api.auth.router.refresh_session")
    def test_refresh_session_mock(self, mock_refresh):
        mock_user = MagicMock()
        mock_user.id = "user-123-uuid"
        mock_user.email = "user@example.com"
        mock_user.user_metadata = {}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "new-access-token"
        mock_session.refresh_token = "new-refresh-token"
        mock_session.token_type = "bearer"
        mock_session.expires_in = 3600

        mock_auth_res = MagicMock()
        mock_auth_res.user = mock_user
        mock_auth_res.session = mock_session
        mock_refresh.return_value = mock_auth_res

        response = client.post("/auth/refresh", json={"refresh_token": "valid-refresh-token"})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["access_token"], "new-access-token")

    @patch("api.auth.deps.get_user_by_token")
    @patch("api.auth.router.sign_out")
    def test_logout_success_mock(self, mock_sign_out, mock_get_user):
        mock_user = MagicMock()
        mock_user.id = "user-123-uuid"
        mock_user.email = "test@example.com"
        mock_user.user_metadata = {}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_user_res = MagicMock()
        mock_user_res.user = mock_user
        mock_get_user.return_value = mock_user_res

        response = client.post(
            "/auth/logout",
            headers={"Authorization": "Bearer valid-mock-token"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("logged out", data["message"].lower())

    def test_vercel_rewrite_path_recovery(self):
        response = client.get("/api/index.py?__path__=/")
        self.assertEqual(response.status_code, 200)

        response2 = client.get("/api/index.py?__path__=/api/auth/google/url")
        self.assertEqual(response2.status_code, 200)
        data = response2.json()
        self.assertIn("url", data)

    def test_browser_html_callback_fallback(self):
        response = client.get("/auth/callback")
        self.assertEqual(response.status_code, 200)
        self.assertIn("text/html", response.headers["content-type"])
        self.assertIn("lingopeer://auth/callback", response.text)

    @patch("api.auth.router.exchange_code_for_session")
    def test_oauth_callback_deep_link_redirect(self, mock_exchange):
        mock_user = MagicMock()
        mock_user.id = "oauth-user-uuid"
        mock_user.email = "oauth@gmail.com"
        mock_user.user_metadata = {}
        mock_user.created_at = "2026-09-27T00:00:00Z"

        mock_session = MagicMock()
        mock_session.access_token = "oauth-access-token"
        mock_session.refresh_token = "oauth-refresh-token"
        mock_session.token_type = "bearer"
        mock_session.expires_in = 3600

        mock_auth_res = MagicMock()
        mock_auth_res.user = mock_user
        mock_auth_res.session = mock_session
        mock_exchange.return_value = mock_auth_res

        response = client.get(
            "/auth/callback?code=mock_code&redirect_to=lingopeer://auth/callback",
            follow_redirects=False,
        )
        self.assertEqual(response.status_code, 302)
        self.assertIn("lingopeer://auth/callback#access_token=oauth-access-token", response.headers["location"])


if __name__ == "__main__":
    unittest.main()
