import _, { xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 6;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

async function p2020day6_part1(input: string) {
	return input
		.split("\n\n")
		.map(x => x.split("\n"))
		.map(group => {
			const set = new Set<string>();
			group.forEach(person => person.split("").forEach(char => set.add(char)));
			return set;
		})
		.map(set => set.size)
		.reduce((prev, curr) => prev + curr, 0);
}

async function p2020day6_part2(input: string) {
	return input
		.split("\n\n")
		.map(x => x.split("\n"))
		.map(group => {
			const map = new Map<string, number>();
			group.forEach(person => person.split("").forEach(char => setOrIncrement(map, char)));
			return Array.from(map.keys()).filter(key => map.get(key) == group.length).length;
		})
		.reduce((prev, curr) => prev + curr, 0);
}

function setOrIncrement(map: Map<string, number>, key: string) {
	map.set(key, (map.get(key) || 0) + 1);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day6_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day6_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day6_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day6_part2(input));
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
