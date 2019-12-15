export class ClientService {
  clients: {};

  constructor() {
    this.clients = {};
  }

  addClient = (clientId: string, userId: string): void => {
    this.clients[userId] = this.clients[userId]
      ? [...this.clients[userId], clientId]
      : [clientId];
  }

  removeClient = (clientId: string, userId: string): void => {
    this.clients[userId] = this.clients[userId].filter((client: string) => client !== clientId);
    if (!this.hasClients(userId)) {
      this.removeUser(userId);
    }
  }

  removeUser = (userId: string): boolean => delete this.clients[userId]

  hasClients = (userId: string): boolean => (
    Boolean(this.getClientsByUserId(userId).length)
  );

  getClientsByUserId = (userId: string): string[] => (
    this.clients[userId]
      ? this.clients[userId]
      : []
  );
}

export const clients = new ClientService();
