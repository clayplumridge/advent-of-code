import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
import { Grid } from "../../../util/grid";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 4;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

type Passport = { [key: string]: string };

async function p2020day4_part1(input: string) {
	return createPassports(input).filter(testPassport1).length;
}

function createPassports(input: string): Passport[] {
	const passportStrings = input.split("\n\n");
	const segments = passportStrings.map(x =>
		x
			.split("\n")
			.map(y => y.split(" "))
			.reduce((acc, val) => acc.concat(val), [])
	);
	return segments.map(x => toDict(x, ":"));
}

function toDict(arr: string[], split: string) {
	return arr
		.map(x => x.split(split))
		.reduce((acc, [key, val]) => {
			acc[key] = val;
			return acc;
		}, {} as Passport);
}

function testPassport1(passport: Passport) {
	const keys = Object.keys(passport);

	if (keys.length == 8) {
		return true;
	} else if (keys.length == 7) {
		return keys.indexOf("cid") == -1;
	} else {
		return false;
	}
}

async function p2020day4_part2(input: string) {
	return createPassports(input).filter(testPassport2).length;
}

function testPassport2(passport: Passport) {
	if (!testPassport1(passport)) {
		return false;
	}

	// BYR
	const byr = Number(passport["byr"]);
	if (byr < 1920 || byr > 2020) {
		return false;
	}

	// IYR
	const iyr = Number(passport["iyr"]);
	if (iyr < 2010 || iyr > 2020) {
		return false;
	}

	// EYR
	const eyr = Number(passport["eyr"]);
	if (eyr < 2020 || eyr > 2030) {
		return false;
	}

	// HGT
	const hgtUnit = passport["hgt"].substring(passport["hgt"].length - 2);
	const hgtNum = Number(passport["hgt"].split(hgtUnit)[0]);
	switch (hgtUnit) {
		case "in":
			if (hgtNum < 59 || hgtNum > 76) {
				return false;
			}
			break;
		case "cm":
			if (hgtNum < 150 || hgtNum > 193) {
				return false;
			}
			break;
		default:
			return false;
	}

	// HCL
	const hcl = passport["hcl"];
	if (hcl.charAt(0) != "#") {
		return false;
	}
	const hclNumString = hcl.slice(1);
	if (hclNumString.length != 6 || Number(hclNumString) == NaN) {
		return false;
	}

	// ECL
	const options = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
	const ecl = passport["ecl"];
	if (options.indexOf(ecl) == -1) {
		return false;
	}

	// PID
	const pid = passport["pid"];
	if (pid.length != 9 || Number(pid) == NaN) {
		return false;
	}

	return true;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day4_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day4_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day4_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day4_part2(input));
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
