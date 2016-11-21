module.exports = (queue) => {
  // concurrency of 5
  queue.process('exampleJob', 5, (job, done) => {
    // do some stuff ...

    // you can even create jobs from in here
    queue.create('otherJob').save();

    // ... and then done
    done();
  });
};
