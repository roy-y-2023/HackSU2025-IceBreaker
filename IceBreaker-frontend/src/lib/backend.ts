import {treaty} from "@elysiajs/eden";
import type {IceBreakerAPI} from "../../../IceBreaker-api/src/index";

export const backend = treaty<IceBreakerAPI>("https://project-icebreaker-api.pan.sh");
