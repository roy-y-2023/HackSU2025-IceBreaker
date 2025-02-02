import {Elysia, t} from "elysia";
import {QueryService} from "../db/query";
import {Naming} from "../naming";
import {LLMService} from "../llm";

export const userRouter = new Elysia({prefix: "/v1/user"})