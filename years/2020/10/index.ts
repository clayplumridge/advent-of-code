import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 10;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

async function p2020day9_part1(input: string) {
	const joltages = input
		.split("\n")
		.map(Number)
		.sort((a, b) => a - b);

	let ones = 0;
	let threes = 0;
	let prev = 0;
	for (let i = 0; i < joltages.length; i++) {
		if (joltages[i] - prev == 1) {
			ones += 1;
		} else if (joltages[i] - prev == 3) {
			threes += 1;
		}

		prev = joltages[i];
	}

	// Device joltage is max(joltages) + 3
	threes += 1;

	return ones * threes;
}

async function p2020day9_part2(input: string) {
	const joltageArray = input.split("\n").map(Number);
	joltageArray.push(0);
	const maxJoltage = Math.max(...joltageArray);
	const joltageSet = new Set(joltageArray);

	return validPermutations(joltageSet, maxJoltage);
}

const memo: { [key: number]: number | undefined } = {};
function validPermutations(joltages: Set<number>, start: number): number {
	const memoVal = memo[start];
	if (memoVal !== undefined) {
		return memoVal;
	}

	if (start == 0) {
		return 1;
	}

	const result = ([start - 1, start - 2, start - 3]
		.map(x => {
			if (joltages.has(x)) {
				return validPermutations(joltages, x);
			}
			return undefined;
		})
		.filter(x => x !== undefined) as number[]).reduce((prev: number, curr: number) => prev + curr);

	memo[start] = result;
	return result;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day9_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day9_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day9_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day9_part2(input));
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
