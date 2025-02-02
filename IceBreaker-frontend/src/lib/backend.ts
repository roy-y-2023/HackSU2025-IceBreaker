import {treaty} from "@elysiajs/eden";
import type {IceBreakerAPI} from "../../../IceBreaker-api/src/index";

export const backend = treaty<IceBreakerAPI>("localhost:8017");