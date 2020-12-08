import _, { last, replace, result, xor } from "lodash";
import * as util from "../../../util/util";
import * as test from "../../../util/test";
import chalk from "chalk";
import * as LOGUTIL from "../../../util/log";
import { performance } from "perf_hooks";
const { log, logSolution, trace } = LOGUTIL;

const YEAR = 2020;
const DAY = 8;
const DEBUG = true;
LOGUTIL.setDebug(DEBUG);

// solution path: D:\Development\advent-of-code\years\2020\1\index.ts
// data path    : D:\Development\advent-of-code\years\2020\1\data.txt
// problem url  : https://adventofcode.com/2020/day/1

interface Instruction {
	opcode: "acc" | "jmp" | "nop";
	argument: number;
}

interface MachineState {
	instructionCounter: number;
	accumulator: number;
}

async function p2020day8_part1(input: string) {
	const instructions = instructionsFromInput(input);
	const machineState: MachineState = {
		instructionCounter: 0,
		accumulator: 0,
	};

	const visitedInstructions = new Set<number>();
	while (!visitedInstructions.has(machineState.instructionCounter)) {
		visitedInstructions.add(machineState.instructionCounter);
		step(machineState, instructions);
	}

	return machineState.accumulator;
}

function step(machineState: MachineState, instructions: Instruction[]) {
	const instruction = instructions[machineState.instructionCounter];

	let didJump = false;
	switch (instruction.opcode) {
		case "acc":
			machineState.accumulator += instruction.argument;
			break;
		case "jmp":
			machineState.instructionCounter += instruction.argument;
			didJump = true;
			break;
		case "nop":
			break;
	}

	if (!didJump) {
		machineState.instructionCounter += 1;
	}
}

function instructionsFromInput(input: string) {
	return input.split("\n").map(line => {
		const [opcode, argument] = line.split(" ");
		return { opcode, argument: Number(argument) } as Instruction;
	});
}

async function p2020day8_part2(input: string) {
	const instructions = instructionsFromInput(input);
	const machineState: MachineState = {
		instructionCounter: 0,
		accumulator: 0,
	};

	let accumulatorResult: number | undefined = undefined;
	instructions.forEach((instr, idx) => {
		if (accumulatorResult) {
			return;
		}

		if (instr.opcode == "nop" || instr.opcode == "jmp") {
			const firstHalf = instructions.slice(0, idx);
			const lastHalf = instructions.slice(idx + 1, instructions.length);
			const newInstructions = [...firstHalf, flip(instr), ...lastHalf];

			const result = testInstructionSet(newInstructions);

			if (result.didHalt) {
				accumulatorResult = result.machineState.accumulator;
			}
		}
	});

	return accumulatorResult;
}

function testInstructionSet(instructions: Instruction[]): { didHalt: boolean; machineState: MachineState } {
	const machineState: MachineState = {
		accumulator: 0,
		instructionCounter: 0,
	};

	const visitedInstructions = new Set<number>();
	while (!visitedInstructions.has(machineState.instructionCounter)) {
		if (machineState.instructionCounter >= instructions.length) {
			return { didHalt: true, machineState };
		}

		visitedInstructions.add(machineState.instructionCounter);
		step(machineState, instructions);
	}

	return {
		didHalt: false,
		machineState,
	};
}

function flip(instruction: Instruction): Instruction {
	switch (instruction.opcode) {
		case "nop":
			return toJmp(instruction);
		case "jmp":
			return toNop(instruction);
		default:
			return instruction;
	}
}

function toNop(instruction: Instruction): Instruction {
	return { opcode: "nop", argument: instruction.argument };
}

function toJmp(instruction: Instruction): Instruction {
	return { opcode: "jmp", argument: instruction.argument };
}

async function run() {
	const part1tests: TestCase[] = [];
	const part2tests: TestCase[] = [];

	// Run tests
	test.beginTests();
	test.beginSection();
	for (const testCase of part1tests) {
		test.logTestResult(testCase, String(await p2020day8_part1(testCase.input)));
	}
	test.beginSection();
	for (const testCase of part2tests) {
		test.logTestResult(testCase, String(await p2020day8_part2(testCase.input)));
	}
	test.endTests();

	// Get input and run program while measuring performance
	const input = await util.getInput(DAY, YEAR);

	const part1Before = performance.now();
	const part1Solution = String(await p2020day8_part1(input));
	const part1After = performance.now();

	const part2Before = performance.now();
	const part2Solution = String(await p2020day8_part2(input));
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
