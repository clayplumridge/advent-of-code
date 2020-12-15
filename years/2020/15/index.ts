import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 15;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

async function p2020day15_part1(input: string) {
	const startingNumbers = input.split(",").map(Number);
	const memory = new Map<number, number[]>();
	startingNumbers.forEach((val, idx) => addOrUpdate(memory, val, idx));
	let prev = startingNumbers[startingNumbers.length - 1];

	for (let i = startingNumbers.length; i < 2020; i++) {
		if (memory.get(prev)!.length == 1) {
			addOrUpdate(memory, 0, i);
			prev = 0;
		} else {
			const arr = memory.get(prev)!;
			const newVal = arr[arr.length - 1] - arr[arr.length - 2];
			addOrUpdate(memory, newVal, i);
			prev = newVal;
		}
	}

	return prev;
}

function addOrUpdate(memory: Map<number, number[]>, key: number, value: number) {
	if (memory.has(key)) {
		memory.get(key)!.push(value);
	} else {
		memory.set(key, [value]);
	}
}

async function p2020day15_part2(input: string) {
	const startingNumbers = input.split(",").map(Number);
	const memory = new Map<number, number[]>();
	startingNumbers.forEach((val, idx) => addOrUpdate(memory, val, idx));
	let prev = startingNumbers[startingNumbers.length - 1];

	for (let i = startingNumbers.length; i < 30000000; i++) {
		if (memory.get(prev)!.length == 1) {
			addOrUpdate(memory, 0, i);
			prev = 0;
		} else {
			const arr = memory.get(prev)!;
			const newVal = arr[arr.length - 1] - arr[arr.length - 2];
			addOrUpdate(memory, newVal, i);
			prev = newVal;
		}
	}

	return prev;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day15_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day15_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day15_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day15_part2(input));
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
