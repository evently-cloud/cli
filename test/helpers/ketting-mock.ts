import { initClient } from '../../src/lib/client';

const client = initClient('fake token');
client.use( async req => {

  return new Response('{}', {
    status: 501
  });

});
