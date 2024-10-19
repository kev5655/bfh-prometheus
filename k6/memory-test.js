import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1s', target: 1 }, 
    { duration: '1m', target: 5 }, 
    { duration: '1m', target: 25 },

    { duration: '1s', target: 1 }, 
    { duration: '30s', target: 1 }, 
    { duration: '1m', target: 10 }, 
    { duration: '1m', target: 50 }, 

    { duration: '1s', target: 1 },  
    { duration: '30s', target: 1 }, 
    { duration: '1m', target: 20 }, 
    { duration: '1m', target: 70 }, 

    { duration: '20s', target: 0 }, 

  ],
};

export default function () {
  const url1 = 'http://192.168.49.2:30002/multiply?size=500';
  const url2 = 'http://192.168.49.2:30001/multiply?size=500';

  // Run both requests in parallel
  const responses = http.batch([
    ['GET', url1, null, { tags: { name: 'Go Matrix' }, timeout: '160s' }],
    ['GET', url2, null, { tags: { name: 'Node Matrix' }, timeout: '160s' }]
  ]);

  // Optional checks for responses
  check(responses[0], {
    'Go Matrix is status 200': (r) => r.status === 200,
  });
  check(responses[1], {
    'Node Matrix is status 200': (r) => r.status === 200,
  });

  sleep(1); // Sleep between iterations
}
