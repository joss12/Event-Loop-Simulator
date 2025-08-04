// scenarios.js
//

const {
  fakeSetTimeout,
  fakeQueueMicrotask,
  fakeAsync,
  fakePromiseThen,
} = require("./scheduler");

function basicOrder() {
  fakeSetTimeout(function T1() {
    console.log("-> T1 (task)");
  });

  fakePromiseThen(function M1() {
    console.log("-> M1 (microtask)");
  });

  //Expected orrder: M1-> T1
}

function nestedClassic() {
  // Mirrors real JS:
  // setTimeout(A); Promise.resolve().then(C);
  // Inside A -> then(B); Inside C -> setTimeout(D);
  fakeSetTimeout(function A() {
    console.log("→ A");
    fakePromiseThen(function B() {
      console.log("→ B (inside A)");
    });
  });

  fakePromiseThen(function C() {
    console.log("→ C");
    fakeSetTimeout(function D() {
      console.log("→ D (inside C)");
    });
  });

  // Expected: C → A → B → D (across ticks)
}
function chainMicrotasks() {
  //microtask scheduler microtask drain in the SAME tick
  fakePromiseThen(function M1() {
    console.log("-> M1");
    fakePromiseThen(function M2() {
      console.log("-> M2");
      fakePromiseThen(function M3() {
        console.log("-> M3");
      });
    });
  });

  fakeSetTimeout(function T1() {
    console.log("-> T1");
  });

  //Expected (same tick for microtasks): M1 -> M2 -> M3 -> T1
}

function tasksInterleaveMicrotasks() {
  fakeSetTimeout(function T1() {
    console.log("-> T1");
    fakePromiseThen(function mFromT1() {
      console.log("-> mFromT1 (microtask scheduled by T1)");
    });
  });

  fakeSetTimeout(function T2() {
    console.log("-> T2");
  });

  //Expected: T1 -> mFromT1 -> T2 (because mFromT1 runs next tick  before T2)
}

function asyncTasks() {
  fakeAsync("demoAsync", [
    function step1() {
      console.log(" await step1 resolved");
    },
    function step2() {
      console.log(" await step2 resolved");
    },
    function step3() {
      console.log(" await step3 resolved");
    },
  ]);

  fakeSetTimeout(function T() {
    console.log("-> T (task)");
  });

  // With fixed fakeAsync (1 step per tick):
  // Expected: (tick1) step1 → T, (tick2) step2, (tick3) step3
}

function microtaskStarvation() {
  //Show microtask "starvation": a chan that keeps the loop on microtask

  let count = 0;
  const LIMIT = 10;

  fakePromiseThen(function recur() {
    console.log(`-> M${count}`);
    count += 1;
    if (count < LIMIT) {
      //Keep adding microtask: still drains in thhe same tick
      fakePromiseThen(recur);
    }
  });

  fakeSetTimeout(function T() {
    console.log("-> T (runs after all M0..M9 in a later tick)");
  });

  //  Expected: M0..M9 (same tick) -> T (next tick)
}

function queueMicrotaskVsThen_order1() {
  fakePromiseThen(function thanA() {
    console.log("-> then-A");
  });
  fakeQueueMicrotask(function qmtB() {
    console.log("-> qmt-B");
  });

  //Expected: then-A -> qmt-B (FIFO within microtask queue)
}

function queueMicrotaskVsThen_order2() {
  fakeQueueMicrotask(function qmtB() {
    console.log("-> qmt-B");
  });
  fakePromiseThen(function thanA() {
    console.log("->ten-A");
  });

  //Expected: qmt-B -> then-A
}

module.exports = {
  basicOrder,
  nestedClassic,
  chainMicrotasks,
  tasksInterleaveMicrotasks,
  asyncTasks,
  microtaskStarvation,
  queueMicrotaskVsThen_order1,
  queueMicrotaskVsThen_order2,
};
