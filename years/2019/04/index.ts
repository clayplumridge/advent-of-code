import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2019;
const DAY = 4;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2019\04\index.ts
// data path    : D:\Development\advent-of-code\years\2019\04\data.txt
// problem url  : https://adventofcode.com/2019/day/4

async function p2019day4_part1(input: string) {
	const [min, max] = input.split("-").map(Number);

	let count = 0;

	for (let i = min; i < max; i++) {
		if (testNum(i)) {
			count++;
		}
	}

	return count;
}

function testNum(testNum: number): boolean {
	let hasRepeat = false;

	for (let pow = 6; pow > 1; pow--) {
		const first = getDigit(testNum, pow);
		const second = getDigit(testNum, pow - 1);

		if (second < first) {
			return false;
		}

		if (second == first) {
			hasRepeat = true;
		}
	}

	return hasRepeat;
}

function getDigit(num: number, pos: number) {
	return Math.floor((num / Math.pow(10, pos - 1)) % 10);
}

async function p2019day4_part2(input: string) {
	const [min, max] = input.split("-").map(Number);

	let count = 0;

	for (let i = min; i < max; i++) {
		if (testNum2(i)) {
			count++;
		}
	}

	return count;
}

function testNum2(testNum: number): boolean {
	let hasRepeat = false;

	for (let pow = 6; pow > 1; pow--) {
		const first = getDigit(testNum, pow);
		const second = getDigit(testNum, pow - 1);

		if (second < first) {
			return false;
		}

		if (!hasRepeat && second == first) {
			const prev = getDigit(testNum, pow + 1);
			const next = getDigit(testNum, pow - 2);

			hasRepeat = prev != first && next != first;
		}
	}

	return hasRepeat;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2019day4_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2019day4_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2019day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2019day4_part2(input));
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
