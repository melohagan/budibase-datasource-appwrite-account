import { IntegrationBase } from "@budibase/types"
import { Client, Account } from "appwrite";

class CustomIntegration implements IntegrationBase {
  private readonly client: Client
  private readonly account: Account

  constructor(config: { endpoint: string; projectId: string; }) {
    this.client = new Client()
    this.account = new Account(this.client)

    this.client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
  }

  async create(query: { userId: string, email: string; password: string; name: string; }) {
    return await this.account.create(query.userId, query.email, query.password, query.name)
  }

  async createEmailSession(query: { email: string; password: string; }) {
    return await this.account.createEmailSession(query.email, query.password);
  }

  async createOAuth2Session(query: { provider: string; success: string; failure: string; }) {
    return this.account.createOAuth2Session(query.provider, query.success, query.failure);
  }

  async createMagicURLSession(query: { userId: string; email: string; url: string; }) {
    return await this.account.createMagicURLSession(query.userId, query.email, query.url);
  }

  async createPhoneSession(query: { userId: string; phone: string; }) {
    return await this.account.createPhoneSession(query.userId, query.phone);
  }

  async createAnonymousSession() {
    return await this.account.createAnonymousSession();
  }

  async createJWT() {
    return await this.account.createJWT();
  }

  async read(query: { extra: { [key: string]: string } }) {
    if (query.extra.type === "Preferences") {
     return await this.account.getPrefs(); 
    }
    if (query.extra.type === "Sessions") {
      return await this.account.listSessions();
    }
    if (query.extra.type === "Logs") {
      return await this.account.listLogs();
    }
    return await this.account.get();
  }

  async readBySessionId(query: { sessionId: string; }) {
    return await this.account.getSession(query.sessionId)
  }

  async update(query: { name: string; email: string; phone: string; password: string; }) {
    let result = {}
    if (query.name) {
      result = await this.account.updateName(query.name)
    }
    if (query.email) {
      result = await this.account.updateEmail(query.email, query.password)
    }
    if (query.phone) {
      result = await this.account.updatePhone(query.phone, query.password)
    }
    return result
  }

  async updatePassword(query: { password: string; oldPassword: string }) {
    return await this.account.updatePassword(query.password, query.oldPassword)
  }

  async updatePrefs(query: { json: object }) {
    return await this.account.updatePrefs(query.json)
  }

  async updateStatus() {
    return await this.account.updateStatus()
  }

  async deleteSession(query: { sessionId: string }) {
    return await this.account.deleteSession(query.sessionId)
  }

  async deleteAllSessions() {
    return await this.account.deleteSessions()
  }
}

export default CustomIntegration
