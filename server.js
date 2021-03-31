const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

let freshId = 4;

const tickets = [
  {
    id: 1,
    name: '123',
    description: '444',
    status: false,
    created: Date.now(),
  },
  {
    id: 2,
    name: '3333',
    description: 'zzzz',
    status: false,
    created: Date.now(),
  },
  {
    id: 3,
    name: '787878',
    description: 'ffff',
    status: false,
    created: Date.now(),
  },
];

function getAllTickets() {
  const result = [];

  for (const element of tickets) {
    result.push({
      id: element.id, name: element.name, status: element.status, created: element.created,
    });
  }

  return result;
}

function getTicketById(id) {
  const numericId = parseInt(id, 10);
  return tickets.find((ticket) => ticket.id === numericId);
}

function createTicket(ticket) {
  tickets.push({
    id: freshId,
    created: Date.now(),
    name: ticket.name,
    status: ticket.status,
    description: ticket.description,
  });

  freshId += 1;
}

function updateTicket(id, params) {
  const numericId = parseInt(id, 10);
  const ticketToUpdate = tickets.find((ticket) => ticket.id === numericId);
  for (const propToUpdate of Object.keys(params)) {
    ticketToUpdate[propToUpdate] = params[propToUpdate];
  }
  return ticketToUpdate;
}

function deleteTicket(id) {
  const numericId = parseInt(id, 10);
  const idx = tickets.findIndex((ticket) => ticket.id === numericId);
  tickets.splice(idx, 1);
}

app.use(async (ctx) => {
  const { method } = ctx.request.query;

  switch (method) {
    case 'allTickets':
      ctx.response.body = getAllTickets();
      return;
    case 'ticketById':
      ctx.response.body = getTicketById(ctx.request.query.id);
      return;
    case 'createTicket':
      createTicket(ctx.request.body);
      ctx.response.status = 200;
      return;
    case 'updateTicket':
      updateTicket(ctx.request.query.id, ctx.request.body);
      ctx.response.status = 200;
      return;
    case 'deleteTicket':
      deleteTicket(ctx.request.query.id);
      ctx.response.status = 200;
      return;
    default:
      ctx.response.status = 404;
  }
});

http.createServer(app.callback()).listen(process.env.PORT || 5555);
