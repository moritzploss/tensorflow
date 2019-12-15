export class ClientService {
  clients: { [x: string]: string[] };

  constructor() {
    this.clients = {};
  }

  addClient = (clientId: string, userId: string): void => {
    this.clients[userId] = this.clients[userId]
      ? [...this.clients[userId], clientId]
      : [clientId];
  }

  removeClient = (clientId: string, userId: string): void => {
    this.clients[userId] = this.clients[userId].filter((id: string) => id !== clientId);
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
