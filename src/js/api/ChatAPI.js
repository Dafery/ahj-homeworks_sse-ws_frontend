import Entity from "./Entity";

export default class ChatAPI extends Entity {
  constructor() {
    super();
    this.httpURL = "http://localhost:3000";
    this.wsURL = "ws://localhost:3000";
  }

  async postNewUser(payload) {
    try {
      const response = await fetch(`${this.httpURL}/new-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return;
      }

      return await response.json();
    } catch {
      return { status: 500, message: "Network error" };
    }
  }
}
