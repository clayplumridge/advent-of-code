import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 14;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

interface MaskLine {
	type: "mask";
	value: string;
}

interface MemLine {
	type: "mem";
	address: number;
	value: number;
}

type Line = MaskLine | MemLine;

async function p2020day14_part1(input: string) {
	const lines: Line[] = input.split("\n").map(line => {
		const [first, rest] = line.split(" = ");

		if (_.startsWith(first, "mask")) {
			return {
				type: "mask",
				value: rest,
			} as MaskLine;
		} else {
			return {
				type: "mem",
				address: Number(first.slice(4, first.length - 1)),
				value: Number(rest),
			} as MemLine;
		}
	});

	return Array.from(runProgram(lines).values()).reduce((acc, curr) => acc + curr, 0);
}

function runProgram(lines: Line[]): Map<number, number> {
	let currMask = (lines[0] as MaskLine).value;
	const memory = new Map<number, number>();

	lines.forEach(line => {
		if (line.type == "mask") {
			currMask = line.value;
		} else {
			memory.set(line.address, maskValue(currMask, line.value));
		}
	});

	return memory;
}

function maskValue(mask: string, value: number) {
	const valAsBinaryString = _.padStart(value.toString(2), mask.length, "0");
	const resultBinaryString = mask
		.split("")
		.map((x, idx) => {
			if (x == "X") {
				return valAsBinaryString[idx] || "0";
			}

			return x;
		})
		.join("");

	return parseInt(resultBinaryString, 2);
}

async function p2020day14_part2(input: string) {
	const lines: Line[] = input.split("\n").map(line => {
		const [first, rest] = line.split(" = ");

		if (_.startsWith(first, "mask")) {
			return {
				type: "mask",
				value: rest,
			} as MaskLine;
		} else {
			return {
				type: "mem",
				address: Number(first.slice(4, first.length - 1)),
				value: Number(rest),
			} as MemLine;
		}
	});

	let currMask = (lines[0] as MaskLine).value;
	const memory = new Map<number, number>();

	lines.forEach(line => {
		if (line.type == "mask") {
			currMask = line.value;
		} else {
			writeRecursive(zipWithAddressMask(currMask, line.address), line.value, memory);
		}
	});

	return Array.from(memory.values()).reduce((acc, curr) => acc + curr, 0);
}

function zipWithAddressMask(mask: string, address: number): string {
	const valAsBinaryString = _.padStart(address.toString(2), mask.length, "0");
	return mask
		.split("")
		.map((char, idx) => {
			if (char == "0") {
				return valAsBinaryString[idx];
			}

			return char;
		})
		.join("");
}

function writeRecursive(maskedBitString: string, value: number, memory: Map<number, number>) {
	if (maskedBitString.indexOf("X") >= 0) {
		writeRecursive(maskedBitString.replace("X", "0"), value, memory);
		writeRecursive(maskedBitString.replace("X", "1"), value, memory);
	} else {
		const address = parseInt(maskedBitString, 2);
		memory.set(address, value);
	}
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day14_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day14_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day14_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day14_part2(input));
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
