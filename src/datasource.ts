import { IntegrationBase } from "@budibase/types"
import { Client, Users } from "node-appwrite";

class CustomIntegration implements IntegrationBase {
  private readonly client: Client
  private readonly users: Users

  constructor(config: { endpoint: string; projectId: string; apiKey: string; }) {
    this.client = new Client()
    this.users = new Users(this.client)
    this.client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey)
  }

  async create(query: { userId: string; name: string; email: string; phone: string; password: string; passwordVersion: string; extra: { [key: string]: string } }) {
    if (query.extra.type === "Bcrypt") {
      return await this.users.createBcryptUser(query.userId, query.email, query.password, query.name)
    }
    if (query.extra.type === "MD5") {
      return await this.users.createMD5User(query.userId, query.email, query.password, query.name)
    }
    if (query.extra.type === "Argon2") {
      return await this.users.createArgon2User(query.userId, query.email, query.password, query.name)
    }
    if (query.extra.type === "SHA") {
      return await this.users.createSHAUser(query.userId, query.email, query.password, query.passwordVersion, query.name)
    }
    if (query.extra.type === "PHPass") {
      return await this.users.createPHPassUser(query.userId, query.email, query.password, query.name)
    }
    return await this.users.create(query.userId, query.email, query.phone, query.password, query.name)
  }

  async read(query: { userId: string; extra: { [key: string]: string } }) {
    if (!query.userId) {
      return await this.users.list()
    }
    if (query.extra.type === "Preferences") {
      return await this.users.getPrefs(query.userId)
    }
    if (query.extra.type === "Sessions") {
      return await this.users.listSessions(query.userId)
    }
    if (query.extra.type === "Memberships") {
      return await this.users.listMemberships(query.userId)
    }
    if (query.extra.type === "Logs") {
      return await this.users.listLogs(query.userId)
    }
    return await this.users.get(query.userId)
  }

  async update(query: { userId: string; name: string; email: string; number: string; password: string; status: string; emailVerification: string; phoneVerification: string; }) {
    let response
    if (query.status) {
      response = await this.users.updateStatus(query.userId, query.status === "true")
    }
    if (query.phoneVerification) {
      response = await this.users.updatePhoneVerification(query.userId, query.phoneVerification === "true")
    }
    if (query.name) {
      response = await this.users.updateName(query.userId, query.name)
    }
    if (query.password) {
      response = await this.users.updatePassword(query.userId, query.password)
    }
    if (query.email) {
      response = await this.users.updateEmail(query.userId, query.email)
    }
    if (query.number) {
      response = await this.users.updatePhone(query.userId, query.number)
    }
    if (query.emailVerification) {
      response = await this.users.updateEmailVerification(query.userId, query.emailVerification === "true")
    }
    if (response) {
      return response
    }
    throw new Error("No properties provided to update!")
  }

  async delete(query: { userId: string; sessionId: string; extra: { [key: string]: string } }) {
    if (query.extra.type === "Sessions") {
      if (query.sessionId) {
        return await this.users.deleteSession(query.userId, query.sessionId)
      }
      return await this.users.deleteSessions(query.userId)
    }
    return await this.users.delete(query.userId)
  }
}

export default CustomIntegration
