// Inngest is optional for the take-home: use it if your solution needs durable
// background work (scheduled syncs, retries, fan-out), or ignore it entirely.
// https://www.inngest.com/docs
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "hospital-take-home",
});
