import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
import { Cell, Grid } from "../../../util/grid";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 12;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

const enum Heading {
	N = 0,
	E = 1,
	S = 2,
	W = 3,
}

type CommandCode = "N" | "S" | "E" | "W" | "L" | "R" | "F";

interface Command {
	code: CommandCode;
	arg: number;
}

interface ShipState {
	heading: Heading;
	position: [number, number];
}

async function p2020day11_part1(input: string) {
	const commands: Command[] = input.split("\n").map(x => ({
		code: x.charAt(0) as CommandCode,
		arg: Number(x.slice(1)),
	}));

	const startState: ShipState = {
		heading: Heading.E,
		position: [0, 0],
	};

	const result = commands.reduce((state, cmd) => {
		const result = step(state, cmd);
		console.log(`Applied ${JSON.stringify(cmd)} on ${JSON.stringify(state)} => ${JSON.stringify(result)}`);
		return result;
	}, startState);
	return manhattan(result.position);
}

const HeadingMatrix: { [key in Heading]: [number, number] } = {
	[Heading.N]: [0, 1],
	[Heading.S]: [0, -1],
	[Heading.E]: [1, 0],
	[Heading.W]: [-1, 0],
};

function step(state: ShipState, command: Command): ShipState {
	const { code, arg } = command;

	let deltaMatrix: [number, number] | undefined = undefined;
	let rotationModifier: number | undefined = undefined;

	switch (code) {
		case "N":
			deltaMatrix = HeadingMatrix[Heading.N];
			break;
		case "E":
			deltaMatrix = HeadingMatrix[Heading.E];
			break;
		case "S":
			deltaMatrix = HeadingMatrix[Heading.S];
			break;
		case "W":
			deltaMatrix = HeadingMatrix[Heading.W];
			break;
		case "F":
			deltaMatrix = HeadingMatrix[state.heading];
			break;
		case "L":
			rotationModifier = -1;
			break;
		case "R":
			rotationModifier = 1;
			break;
	}

	if (deltaMatrix) {
		return { ...state, position: zip(state.position, deltaMatrix.map(x => x * arg) as [number, number]) };
	} else if (rotationModifier) {
		const deltaHeading = (rotationModifier * arg) / 90;
		const newHeading = (state.heading + deltaHeading) % 4;
		return { ...state, heading: newHeading >= 0 ? newHeading : newHeading + 4 };
	}

	return state;
}

function manhattan(position: [number, number], origin: [number, number] = [0, 0]): number {
	return zip(position, origin).reduce((prev, curr) => prev + Math.abs(curr), 0);
}

function zip(arr1: [number, number], arr2: [number, number]): [number, number] {
	return [arr1[0] + arr2[0], arr1[1] + arr2[1]];
}

async function p2020day11_part2(input: string) {
	const commands: Command[] = input.split("\n").map(x => ({
		code: x.charAt(0) as CommandCode,
		arg: Number(x.slice(1)),
	}));

	const startState = [
		[0, 0],
		[10, 1],
	] as [[number, number], [number, number]];

	const result = commands.reduce((state, cmd) => {
		const [ship, waypoint] = state;
		const result = step2(ship, waypoint, cmd);
		console.log(`Applied ${JSON.stringify(cmd)} on ${JSON.stringify(state)} => ${JSON.stringify(result)}`);
		return result;
	}, startState);

	return manhattan(result[0]);
}

function step2(
	shipState: [number, number],
	waypointState: [number, number],
	command: Command
): [[number, number], [number, number]] {
	const { code, arg } = command;

	switch (code) {
		case "N":
			return [shipState, zip(waypointState, HeadingMatrix[Heading.N].map(x => x * arg) as [number, number])];
		case "S":
			return [shipState, zip(waypointState, HeadingMatrix[Heading.S].map(x => x * arg) as [number, number])];
		case "E":
			return [shipState, zip(waypointState, HeadingMatrix[Heading.E].map(x => x * arg) as [number, number])];
		case "W":
			return [shipState, zip(waypointState, HeadingMatrix[Heading.W].map(x => x * arg) as [number, number])];
		case "R":
			return [shipState, right(arg, waypointState)];
		case "L":
			return [shipState, left(arg, waypointState)];
		case "F":
			return [zip(shipState, waypointState.map(x => x * arg) as [number, number]), waypointState];
	}
}

function right(deg: number, pos: [number, number]): [number, number] {
	deg = deg % 360;
	const [x, y] = pos;

	switch (deg) {
		case 0:
			return pos;
		case 90:
			return [y, -x];
		case 180:
			return [-x, -y];
		case 270:
			return [-y, x];
		default:
			throw new Error(`Unable to rotate ${deg} degrees`);
	}
}

function left(deg: number, pos: [number, number]): [number, number] {
	deg = deg % 360;
	return right(360 - deg, pos);
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day11_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day11_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day11_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day11_part2(input));
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
