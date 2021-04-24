import {Controller, Get} from "@tsed/common";

@Controller("/bitpanda")
export class BitpandaController {
  @Get()
  findAll(): string {
    return "This action returns all calendars";
  }
}