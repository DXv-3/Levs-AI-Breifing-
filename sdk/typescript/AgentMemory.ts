export interface Skill {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export class AgentMemory {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private get headers(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Saves a newly learned skill as a Markdown file.
   */
  async saveSkill(title: string, content: string, tags: string[] = []): Promise<Skill> {
    const res = await fetch(`${this.apiUrl}/api/skills`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ title, content, tags })
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.statusText} - ${await res.text()}`);
    return res.json();
  }

  /**
   * Lists all available skills the agent has learned.
   */
  async listSkills(): Promise<Skill[]> {
    const res = await fetch(`${this.apiUrl}/api/skills`, {
      method: 'GET',
      headers: this.headers
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.statusText} - ${await res.text()}`);
    return res.json();
  }

  /**
   * Recalls a specific skill by its ID.
   */
  async getSkill(skillId: string): Promise<Skill> {
    const res = await fetch(`${this.apiUrl}/api/skills/${skillId}`, {
      method: 'GET',
      headers: this.headers
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.statusText} - ${await res.text()}`);
    return res.json();
  }
}
