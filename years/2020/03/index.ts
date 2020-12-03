import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid } from "../../../util/grid";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 3;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

async function p2020day3_part1(input: string) {
	const grid = new Grid({ serialized: input });
	return testSlope(grid, 3, 1);
}

function testSlope(grid: Grid, dx: number, dy: number) {
	let row = 0;
	let col = 0;
	let count = 0;
	while (row < grid.rowCount) {
		const char = grid.getCell([row, col])!;

		if (char.value == "#") {
			count++;
		}

		row += dy;
		col += dx;

		if (col >= grid.colCount) {
			col = col - grid.colCount;
		}
	}

	return count;
}

async function p2020day3_part2(input: string) {
	const grid = new Grid({ serialized: input });
	const slopes = [
		[1, 1],
		[3, 1],
		[5, 1],
		[7, 1],
		[1, 2],
	];

	return slopes.map(([dx, dy]) => testSlope(grid, dx, dy)).reduce((prev, curr) => prev * curr, 1);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day3_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day3_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day3_part2(input));
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
