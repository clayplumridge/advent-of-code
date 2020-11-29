import _ from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2019;
const DAY = 3;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2019\03\index.ts
// data path    : D:\Development\advent-of-code\years\2019\03\data.txt
// problem url  : https://adventofcode.com/2019/day/3

interface WireCommand {
	direction: "R" | "L" | "U" | "D";
	distance: number;
}

interface Position {
	x: number;
	y: number;
}

type PositionString = `${number},${number}`;

async function p2019day3_part1(input: string) {
	const wires = input
		.split("\n")
		.map(x => x.split(",").map(y => ({ direction: y[0], distance: Number(y.substr(1)) } as WireCommand)));

	const firstSet = new Set(calculatePositions(wires[0]));
	const secondSet = new Set(calculatePositions(wires[1]));
	const intersectionStrings = new Set([...firstSet].filter(x => secondSet.has(x)));

	const intersections: Position[] = Array.from(intersectionStrings.values()).map(parsePosition);

	return Math.min(...intersections.map(pos => Math.abs(pos.x) + Math.abs(pos.y)));
}

function calculatePositions(commands: WireCommand[]) {
	const positions: PositionString[] = [];
	let currentPosition: Position = { x: 0, y: 0 };

	for (let command of commands) {
		const [newPosition, coveredPositions] = executeCommand(currentPosition, command);
		currentPosition = newPosition;
		coveredPositions.forEach(pos => positions.push(`${pos.x},${pos.y}` as PositionString));
	}

	return positions;
}

function executeCommand(currentPosition: Position, command: WireCommand): [Position, Position[]] {
	const iterator = getIterator(command.direction);

	const covered = _.times(command.distance, () => {
		currentPosition = iterator(currentPosition);
		return currentPosition;
	});

	return [currentPosition, covered];
}

function getIterator(direction: WireCommand["direction"]): (prevPosition: Position) => Position {
	switch (direction) {
		case "R":
			return prev => ({ x: prev.x + 1, y: prev.y });
		case "L":
			return prev => ({ x: prev.x - 1, y: prev.y });
		case "U":
			return prev => ({ x: prev.x, y: prev.y + 1 });
		case "D":
			return prev => ({ x: prev.x, y: prev.y - 1 });
	}
}

function parsePosition(posString: PositionString) {
	const [x, y] = posString.split(",").map(Number);
	return { x, y };
}

async function p2019day3_part2(input: string) {
	const wires = input
		.split("\n")
		.map(x => x.split(",").map(y => ({ direction: y[0], distance: Number(y.substr(1)) } as WireCommand)));

	const firstWireStrings = calculatePositions(wires[0]);
	const secondWireStrings = calculatePositions(wires[1]);

	const firstSet = new Set(firstWireStrings);
	const secondSet = new Set(secondWireStrings);
	const intersectionStrings = new Set([...firstSet].filter(x => secondSet.has(x)));

	return Math.min(
		...Array.from(intersectionStrings.values()).map(
			x => calculateSteps(firstWireStrings, x) + calculateSteps(secondWireStrings, x)
		)
	);
}

function calculateSteps(positions: PositionString[], target: PositionString) {
	return positions.indexOf(target) + 1;
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2019day3_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2019day3_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2019day3_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2019day3_part2(input));
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
