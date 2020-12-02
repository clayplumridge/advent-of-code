import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 2;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

interface PasswordTest {
	min: number;
	max: number;
	char: string;
	password: string;
}

async function p2020day2_part1(input: string) {
	const lines = input.split("\n");

	const tests = lines.map(x => {
		const [countSeg, charSeg, password] = x.split(" ");
		const [min, max] = countSeg.split("-").map(Number);
		return {
			min,
			max,
			char: trim(charSeg, ":"),
			password,
		} as PasswordTest;
	});

	return tests.map(testPassword).filter(Boolean).length;
}

const trim = (str: string, chars: string) => str.split(chars).filter(Boolean).join(chars);

function testPassword(test: PasswordTest) {
	const { min, max, char, password } = test;
	let count = 0;

	for (let i = 0; i < password.length; i++) {
		if (password.charAt(i) == char) {
			count++;
		}
	}

	return count >= min && count <= max;
}

interface PasswordTest2 {
	pos1: number;
	pos2: number;
	char: string;
	password: string;
}

async function p2020day2_part2(input: string) {
	const lines = input.split("\n");

	const tests = lines.map(x => {
		const [countSeg, charSeg, password] = x.split(" ");
		const [pos1, pos2] = countSeg.split("-").map(Number);
		return {
			pos1: pos1 - 1,
			pos2: pos2 - 1,
			char: trim(charSeg, ":"),
			password,
		} as PasswordTest2;
	});

	return tests.map(testPassword2).filter(Boolean).length;
}

function testPassword2(test: PasswordTest2) {
	const { pos1, pos2, char, password } = test;
	return (
		(password.charAt(pos1) == char && password.charAt(pos2) !== char) ||
		(password.charAt(pos1) !== char && password.charAt(pos2) == char)
	);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day2_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day2_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day2_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day2_part2(input));
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
