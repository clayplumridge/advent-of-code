import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 9;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

async function p2020day9_part1(input: string) {
	const numbers = input.split("\n").map(Number);
	const preamble = numbers.slice(0, 25);
	const rest = numbers.slice(25);
	return rest.filter(x => {
		const sum = twoSum(preamble, x);
		addToRollingList(preamble, x);
		return sum == undefined;
	})[0];
}

function addToRollingList(list: number[], next: number) {
	list.shift();
	list.push(next);
}

function twoSum(arr: number[], target: number): [first: number, second: number] | undefined {
	const numberSet = new Set(arr);
	const res = arr.find(x => numberSet.has(target - x));
	if (res) {
		return [res, target - res];
	}
	return undefined;
}

async function p2020day9_part2(input: string) {
	const target = 25918798;
	const numbers = input.split("\n").map(Number);
	const res = nSum(numbers, target);

	if (res) {
		return Math.max(...res) + Math.min(...res);
	}

	return "Result of nsum is null";
}

function nSum(arr: number[], target: number): number[] | undefined {
	let start = 0;
	let end = 0;
	let currentSum = arr[start];

	while (end < arr.length) {
		if (currentSum > target) {
			currentSum -= arr[start];
			start += 1;
		} else if (currentSum < target) {
			end += 1;
			currentSum += arr[end];
		} else {
			return arr.slice(start, end);
		}
	}

	return undefined;
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
