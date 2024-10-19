import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 10 }, // Ramp up to 10 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 200 }, // Stay at 200 users
    { duration: '1m', target: 0 },  // Ramp down to 0 users
  ],
};

export default function () {
  const url1 = 'http://192.168.49.2:30002/multiply?size=2';
  const url2 = 'http://192.168.49.2:30001/multiply?size=2';

  // Run both requests in parallel
  const responses = http.batch([
    ['GET', url1, null, { tags: { name: 'Multiply1' } }],
    ['GET', url2, null, { tags: { name: 'Multiply2' } }]
  ]);

  // Optional checks for responses
  check(responses[0], {
    'Multiply1 is status 200': (r) => r.status === 200,
  });
  check(responses[1], {
    'Multiply2 is status 200': (r) => r.status === 200,
  });

  sleep(1); // Sleep between iterations
}
