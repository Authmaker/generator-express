module.exports = {
  cron: '10 */2 * * *', // twice a day at 10 mins past the hour
  job(queue) {
    return () => {
      // create a job to be processed
      queue.create('exampleJob').save();
    };
  },
};
