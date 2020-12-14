import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 13;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

async function p2020day13_part1(input: string) {
	const [targetTimeAsString, rest] = input.split("\n");
	const targetTime = Number(targetTimeAsString);
	const busses = rest
		.split(",")
		.filter(x => x !== "x")
		.map(Number);

	const best = _.minBy(busses, val => Math.ceil(targetTime / val) * val)!;
	const bestWaitTime = Math.ceil(targetTime / best) * best - targetTime;
	return best * bestWaitTime;
}

interface BusTiming {
	id: number;
	offset: number;
}

async function p2020day13_part2(input: string) {
	const busTimings: BusTiming[] = input
		.split("\n")[1]
		.split(",")
		.map(test => (test == "x" ? "x" : Number(test)))
		.map((slot, idx) => (slot == "x" ? undefined : ({ id: slot, offset: idx } as BusTiming)))
		.filter(x => x !== undefined) as BusTiming[];

	const leastCommonMultiple = lcm(busTimings.map(x => BigInt(x.id)));

	return (
		leastCommonMultiple -
		chineseRemainderTheorem(
			busTimings.map(x => BigInt(x.offset)),
			busTimings.map(x => BigInt(x.id))
		)
	);
}

function gcd(a: bigint, b: bigint) {
	while (b != 0n) {
		var swap = b;
		b = a % b;
		a = swap;
	}

	return a;
}

function lcm(nums: bigint[]) {
	return nums.reduce((acc, val) => (acc * val) / gcd(acc, val), 1n);
}

function modularMultiplicativeInverse(a: bigint, mod: bigint) {
	const b = a % mod;

	for (let i = 1n; i <= mod; i++) {
		if ((b * i) % mod == 1n) {
			return i;
		}
	}

	return 1n;
}

function chineseRemainderTheorem(remainders: bigint[], mods: bigint[]) {
	const prod = mods.reduce((acc, val) => acc * val, 1n);

	return (
		mods.reduce((sum, mod, idx) => {
			const p = prod / mod;
			return sum + remainders[idx] * modularMultiplicativeInverse(p, mod) * p;
		}, 0n) % prod
	);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day13_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day13_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day13_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day13_part2(input));
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
