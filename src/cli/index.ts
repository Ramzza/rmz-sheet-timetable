import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { Timetable, generate } from "../core";
import { uploadToSheet } from "./sheet";

const USAGE = `Usage:
  generate [--input prev.json] [--out timetable.json] "A M-F 10:00-16:00 work" ...
  upload --sheet <sheetId> [--file timetable.json]`;

/**
 * Reads a timetable JSON file.
 * @param path File path.
 * @returns Parsed timetable.
 */
function load(path: string): Timetable {
  return JSON.parse(readFileSync(path, "utf8")) as Timetable;
}

/** CLI entry point: dispatches the `generate` and `upload` commands. */
async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);
  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: { input: { type: "string" }, out: { type: "string" }, sheet: { type: "string" }, file: { type: "string" } },
  });
  if (cmd === "generate") {
    const table = generate(positionals, values.input ? load(values.input) : undefined);
    writeFileSync(values.out ?? "timetable.json", JSON.stringify(table, null, 2));
  } else if (cmd === "upload" && values.sheet) {
    await uploadToSheet(values.sheet, load(values.file ?? "timetable.json"));
  } else {
    console.log(USAGE);
    process.exitCode = 1;
  }
}

main().catch((e: Error) => {
  console.error(e.message);
  process.exitCode = 1;
});
