import requests
from typing import List, Optional, Dict

class AgentMemory:
    """
    Python SDK for interacting with the Agent Memory Platform.
    Allows agents to recall skills, and save new learnings.
    """
    def __init__(self, api_url: str, api_key: str):
        self.api_url = api_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    def save_skill(self, title: str, content: str, tags: Optional[List[str]] = None) -> Dict:
        """Saves a newly learned skill as Markdown."""
        data = {
            "title": title,
            "content": content,
            "tags": tags or []
        }
        res = requests.post(f"{self.api_url}/api/skills", json=data, headers=self.headers)
        res.raise_for_status()
        return res.json()

    def list_skills(self) -> List[Dict]:
        """Lists all known skills."""
        res = requests.get(f"{self.api_url}/api/skills", headers=self.headers)
        res.raise_for_status()
        return res.json()

    def get_skill(self, skill_id: str) -> Dict:
        """Retrieves a specific skill's Markdown content by ID."""
        res = requests.get(f"{self.api_url}/api/skills/{skill_id}", headers=self.headers)
        res.raise_for_status()
        return res.json()
