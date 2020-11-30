import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2019;
const DAY = 8;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2019\08\index.ts
// data path    : D:\Development\advent-of-code\years\2019\08\data.txt
// problem url  : https://adventofcode.com/2019/day/8

async function p2019day8_part1(input: string) {
	const chunks = chunk(input, 150);
	const leastZeros = _.minBy(chunks, x => countChar(x, "0"))!;
	return countChar(leastZeros, "1") * countChar(leastZeros, "2");
}

function chunk(array: string, chunkSize: number): string[] {
	const result: string[] = [];

	for (let i = 0; i < array.length; i += chunkSize) {
		result[Math.ceil(i / chunkSize)] = array.slice(i, i + chunkSize);
	}

	return result;
}

function countChar(text: string, character: string) {
	let count = 0;
	for (let pos = 0; pos < text.length; pos++) {
		if (text.charAt(pos) == character) {
			count += 1;
		}
	}

	return count;
}

async function p2019day8_part2(input: string) {
	const chunks = chunk(input, 150);
	let currentImage = chunks[chunks.length - 1];
	for (let layer = chunks.length - 2; layer >= 0; layer--) {
		currentImage = mergeChunks(currentImage, chunks[layer]);
	}

	const resultStrings = chunk(currentImage, 25);
	return "\n" + resultStrings.join("\n");
}

function mergeChunks(bottomChunk: string, topChunk: string): string {
	let result = "";

	for (let i = 0; i < bottomChunk.length; i++) {
		if (topChunk.charAt(i) == "2") {
			result += bottomChunk.charAt(i);
		} else {
			result += topChunk.charAt(i);
		}
	}

	return result;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2019day8_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2019day8_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2019day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2019day8_part2(input));
	const part2After = performance.now();

	logSolution(part1Solution, "");
	let printSolution = "";
	for (let i = 0; i < part2Solution.length; i++) {
		if (part2Solution.charAt(i) == "0") {
			printSolution += chalk.bgBlack("0");
		} else if (part2Solution.charAt(i) == "1") {
			printSolution += chalk.bgWhite("1");
		} else if (part2Solution.charAt(i) == "\n") {
			printSolution += "\n";
		}
	}
	console.log(printSolution);

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
