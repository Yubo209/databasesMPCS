import { initAnalyticsDb } from "./sync/init";
import { validate } from "./sync/validate";
import { fullLoadDimDate } from "./sync/fullLoadDimDate";
import { fullLoadDimFilm } from "./sync/fullLoadDimFilm";
import { fullLoadDimActor } from "./sync/fullLoadDimActor";
import { fullLoadDimCategory } from "./sync/fullLoadDimCategory";
import { fullLoadDimCustomer } from "./sync/fullLoadDimCustomer";
import { fullLoadDimStore } from "./sync/fullLoadDimStore";
import { fullLoadBridgeFilmActor } from "./sync/fullLoadBridgeFilmActor";
import { fullLoadBridgeFilmCategory } from "./sync/fullLoadBridgeFilmCategory";

import { fullLoadFactRental } from "./sync/fullLoadFactRental";
import { fullLoadFactPayment } from "./sync/fullLoadFactPayment";

import { syncDimFilm } from "./sync/syncDimFilm";
import { syncDimActor } from "./sync/syncDimActor";
import { syncDimCategory } from "./sync/syncDimCategory";
import { syncDimCustomer } from "./sync/syncDimCustomer";
import { syncDimStore } from "./sync/syncDimStore";

import { syncFactRental } from "./sync/syncFactRental";
import { syncFactPayment } from "./sync/syncFactPayment";

const cmd = process.argv[2];

async function run() {

  if (cmd === "init") {
    await initAnalyticsDb();
    console.log("init done.");
    return;
  }

  if (cmd === "full") {
    await fullLoadDimDate();
    await fullLoadDimFilm();
    await fullLoadDimActor();
    await fullLoadDimCategory();
    await fullLoadDimCustomer();
    await fullLoadDimStore();
    await fullLoadBridgeFilmActor();
    await fullLoadBridgeFilmCategory();
    await fullLoadFactRental();
    await fullLoadFactPayment();

    console.log("full-load done.");
    return;
  }

  if (cmd === "sync") {
    await syncDimFilm();
    await syncDimActor();
    await syncDimCategory();
    await syncDimCustomer();
    await syncDimStore();

    await syncFactRental();
    await syncFactPayment();

    console.log("incremental sync done.");
    return;

  }
  if (cmd === "validate") {

    await validate();
    console.log("validate done.");
    return;

  }
  console.log("Usage:");
  console.log("  npm run cli -- init");
  console.log("  npm run cli -- full");
  console.log("  npm run cli -- sync");
  console.log("  npm run cli -- validate");

}
run();

