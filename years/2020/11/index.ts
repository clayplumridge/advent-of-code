import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
import { Cell, Grid } from "../../../util/grid";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 11;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

type ConwayChar = "L" | "." | "#";

interface Change {
	x: number;
	y: number;
	newChar: ConwayChar;
}

async function p2020day11_part1(input: string) {
	const grid = new Grid({ serialized: input });

	let madeChanges = true;
	while (madeChanges) {
		madeChanges = false;
		grid.batchUpdates();

		for (let x = 0; x < grid.rowCount; x++) {
			for (let y = 0; y < grid.colCount; y++) {
				const val = grid.getValue([x, y]) as ConwayChar;
				const adjacents = getAdjacent(grid, x, y);
				const occupiedAdjacent = adjacents.filter(adj => adj == "#");

				if (val == "L" && occupiedAdjacent.length == 0) {
					grid.setCell([x, y], "#");
					madeChanges = true;
				} else if (val == "#" && occupiedAdjacent.length >= 4) {
					grid.setCell([x, y], "L");
					madeChanges = true;
				}
			}
		}

		grid.commit();
	}

	return grid
		.toString()
		.split("")
		.filter(x => x == "#").length;
}

function getAdjacent(grid: Grid, x: number, y: number): ConwayChar[] {
	return grid
		.getCell([x, y])!
		.neighbors(true)
		.map(cell => cell.value as ConwayChar);
}

async function p2020day11_part2(input: string) {
	const grid = new Grid({ serialized: input });

	let madeChanges = true;
	while (madeChanges) {
		madeChanges = false;
		grid.batchUpdates();

		for (let x = 0; x < grid.rowCount; x++) {
			for (let y = 0; y < grid.colCount; y++) {
				const val = grid.getValue([x, y]) as ConwayChar;
				const visible = getCanSee(grid, x, y);
				const occupiedVisible = visible.filter(adj => adj == "#");

				if (val == "L" && occupiedVisible.length == 0) {
					grid.setCell([x, y], "#");
					madeChanges = true;
				} else if (val == "#" && occupiedVisible.length >= 5) {
					grid.setCell([x, y], "L");
					madeChanges = true;
				}
			}
		}

		grid.commit();
	}

	return grid
		.toString()
		.split("")
		.filter(x => x == "#").length;
}

const stepList: ((cell: Cell) => Cell | undefined)[] = [
	cell => cell.north(1),
	cell => cell.south(1),
	cell => cell.east(1),
	cell => cell.west(1),
	cell => cell.north(1)?.east(1),
	cell => cell.north(1)?.west(1),
	cell => cell.south(1)?.east(1),
	cell => cell.south(1)?.west(1),
];

function getCanSee(grid: Grid, x: number, y: number): ConwayChar[] {
	const cell = grid.getCell([x, y])!;

	return stepList
		.map(stepFunction => {
			let currentCell: Cell | undefined = stepFunction(cell);
			while (currentCell !== undefined && currentCell.value == ".") {
				currentCell = stepFunction(currentCell);
			}

			return currentCell?.value;
		})
		.filter(x => x !== undefined) as ConwayChar[];
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day11_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day11_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day11_part2(input));
	const part2After = performance.now();

	logSolution(part1Solution, part2Solution);

	log(chalk.gray("--- Performance ---"));
	log(chalk.gray(`Part 1: ${util.msToString(part1After - part1Before)}`));
	log(chalk.gray(`Part 2: ${util.msToString(part2After - part2Before)}`));
	log();
}

run()
	.then(() => {
		process.exit();
	})
	.catch(error => {
		throw error;
	});
