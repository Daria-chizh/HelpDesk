const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(cors());
app.use(bodyParser());

let freshId = 4;

const tickets = [
  {
    id: 1,
    name: '123',
    description: '444',
    status: false,
    created: new Date('2020-01-01 15:01:12'),
  },
  {
    id: 2,
    name: '3333',
    description: 'zzzz',
    status: false,
    created: new Date('2020-02-03 15:01:12'),
  },
  {
    id: 3,
    name: '787878',
    description: 'ffff',
    status: false,
    created: new Date('2021-01-01 12:01:12'),
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
    created: new Date(),
    name: ticket.name,
    status: false,
    description: ticket.description,
  });

  freshId += 1;
}

function updateTicket(id, params) {
  const numericId = parseInt(id, 10);
  const ticket = tickets.find((element) => element.id === numericId);
  const { name, status, description } = params;
  if (name !== undefined) {
    ticket.name = name;
  }
  if (description !== undefined) {
    ticket.description = description;
  }
  if (status !== undefined) {
    ticket.status = status === 'true' || status === true;
  }
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

http.createServer(app.callback()).listen(process.env.PORT || 5555, () => console.log('Server is working'));
