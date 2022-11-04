import { Subject } from "rxjs";

export enum events {
  OPEN_DRAWER,
  CLOSE_DRAWER,
}

const eventStream = new Subject<events>();

export default eventStream;
