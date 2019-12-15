/* eslint-disable @typescript-eslint/no-var-requires */
const { expect } = require('chai');
const uuid = require('uuid/v4');

const { ClientService } = require('../../dist/services/clients');

let clientId;
let userId;
let clients;

beforeEach(() => {
  clientId = uuid();
  userId = uuid();
  clients = new ClientService();
});

describe('the clients service add function', () => {
  it('should associate a client with a user', () => {
    clients.addClient(clientId, userId);
    expect(clients.clients).haveOwnProperty(userId);
    expect(clients.getClientsByUserId(userId)).contains(clientId);
  });

  it('should associate multiple clients with a user', () => {
    const clientId2 = uuid();
    clients.addClient(clientId, userId);
    clients.addClient(clientId2, userId);
    expect(clients.getClientsByUserId(userId)).contains(clientId);
    expect(clients.getClientsByUserId(userId)).contains(clientId2);
    expect(clients.getClientsByUserId(userId).length).equals(2);
  });
});

describe('the clients service remove function', () => {
  it('should remove a client from a users list', () => {
    clients.addClient(clientId, userId);
    clients.removeClient(clientId, userId);
    expect(clients.clients).not.haveOwnProperty(userId);
    expect(clients.getClientsByUserId(userId)).not.contains(clientId);
  });
});
