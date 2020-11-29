import _ from "lodash";

interface Machine {
	memory: number[];
	inputBuffer: number[];
	outputBuffer: number[];
	instructionCounter: number;
	didJump: boolean;
}

export function runProgram(program: number[], inputBuffer: number[]): Machine {
	const machine = {
		memory: program,
		inputBuffer,
		outputBuffer: [],
		instructionCounter: 0,
		didJump: false,
	};

	while (machine.memory[machine.instructionCounter] !== 99) {
		const advance = execCommand(machine);
		if (machine.didJump) {
			machine.didJump = false;
		} else {
			machine.instructionCounter += advance;
		}
	}

	console.log(`Program execution complete\n\n`);

	return machine;
}

const enum OpCode {
	Add = 1,
	Multiply = 2,
	Input = 3,
	Output = 4,
	JumpIfTrue = 5,
	JumpIfFalse = 6,
	LessThan = 7,
	Equals = 8,
	Halt = 99,
}

namespace Commands {
	export function add(resolvedParams: number[], machine: Machine) {
		const { memory } = machine;
		memory[resolvedParams[2]] = resolvedParams[0] + resolvedParams[1];
		console.log(
			`ADD ${resolvedParams[0]} ${resolvedParams[1]} ${resolvedParams[2]} => Store ${memory[resolvedParams[2]]}@${
				resolvedParams[2]
			}`
		);
	}

	export function multiply(resolvedParams: number[], machine: Machine) {
		const { memory } = machine;
		memory[resolvedParams[2]] = resolvedParams[0] * resolvedParams[1];
		console.log(
			`MULT ${resolvedParams[0]} ${resolvedParams[1]} ${resolvedParams[2]} => Store ${
				memory[resolvedParams[2]]
			}@${resolvedParams[2]}`
		);
	}

	export function input(resolvedParams: number[], machine: Machine) {
		const { memory } = machine;
		memory[resolvedParams[0]] = machine.inputBuffer.shift()!;

		console.log(
			`INPUT ${resolvedParams[0]} => Store ${memory[resolvedParams[0]]}@${
				resolvedParams[0]
			} from InputBuffer - now ${machine.inputBuffer}`
		);
	}

	export function output(resolvedParams: number[], machine: Machine) {
		const { memory } = machine;
		machine.outputBuffer.push(memory[resolvedParams[0]]);

		console.log(
			`OUTPUT ${resolvedParams[0]} => Push ${memory[resolvedParams[0]]}@${
				resolvedParams[0]
			} into OutputBuffer - now ${machine.outputBuffer}`
		);
	}

	export function jumpIfTrue(resolvedParams: number[], machine: Machine) {
		if (resolvedParams[0] != 0) {
			machine.instructionCounter = resolvedParams[1];
			machine.didJump = true;
			console.log(`JIT ${resolvedParams[0]} ${resolvedParams[1]} => Jump to ${resolvedParams[1]}`);
		} else {
			console.log(`JIT ${resolvedParams[0]} ${resolvedParams[1]} => Do nothing`);
		}
	}

	export function jumpIfFalse(resolvedParams: number[], machine: Machine) {
		if (resolvedParams[0] == 0) {
			machine.instructionCounter = resolvedParams[1];
			machine.didJump = true;
			console.log(`JIF ${resolvedParams[0]} ${resolvedParams[1]} => Jump to ${resolvedParams[1]}`);
		} else {
			console.log(`JIF ${resolvedParams[0]} ${resolvedParams[1]} => Do nothing`);
		}
	}

	export function lessThan(resolvedParams: number[], machine: Machine) {
		const { memory } = machine;
		let result = 0;
		if (resolvedParams[0] < resolvedParams[1]) {
			result = 1;
		}
		memory[resolvedParams[2]] = result;
		console.log(
			`LT ${resolvedParams[0]} ${resolvedParams[1]} ${resolvedParams[2]} => Store ${result}@${resolvedParams[2]}`
		);
	}

	export function equals(resolvedParams: number[], machine: Machine) {
		const { memory } = machine;
		let result = 0;
		if (resolvedParams[0] == resolvedParams[1]) {
			result = 1;
		}
		memory[resolvedParams[2]] = result;
		console.log(
			`EQ ${resolvedParams[0]} ${resolvedParams[1]} ${resolvedParams[2]} => Store ${result}@${resolvedParams[2]}`
		);
	}
}

interface OpCodeDetails {
	arity: number;
	resolvedParamCount: number;
	exec: (resolvedParams: number[], machine: Machine) => void;
}

const opCodeDetailsMap: { [key in OpCode]: OpCodeDetails } = {
	[OpCode.Add]: { arity: 3, resolvedParamCount: 2, exec: Commands.add },
	[OpCode.Multiply]: { arity: 3, resolvedParamCount: 2, exec: Commands.multiply },
	[OpCode.Input]: { arity: 1, resolvedParamCount: 0, exec: Commands.input },
	[OpCode.Output]: { arity: 1, resolvedParamCount: 0, exec: Commands.output },
	[OpCode.JumpIfTrue]: { arity: 2, resolvedParamCount: 2, exec: Commands.jumpIfTrue },
	[OpCode.JumpIfFalse]: { arity: 2, resolvedParamCount: 2, exec: Commands.jumpIfFalse },
	[OpCode.LessThan]: { arity: 3, resolvedParamCount: 2, exec: Commands.lessThan },
	[OpCode.Equals]: { arity: 3, resolvedParamCount: 2, exec: Commands.equals },
	[OpCode.Halt]: {
		arity: 0,
		resolvedParamCount: 0,
		exec: () => {
			throw new Error("Should not be executing HALT");
		},
	},
};

const enum ParameterMode {
	Positional = 0,
	Immediate = 1,
}

function execCommand(machine: Machine): number {
	const { memory, instructionCounter } = machine;
	const opCode = getOpCodeFromFullOpCode(memory[instructionCounter]);
	const opCodeDetails = opCodeDetailsMap[opCode];
	const params = resolveParametersForCurrentInstruction(machine);

	const rawCommand = memory.slice(instructionCounter, instructionCounter + opCodeDetails.arity + 1).join(",");
	console.log(`${instructionCounter}:${rawCommand}`);

	opCodeDetails.exec(params, machine);

	return opCodeDetails.arity + 1;
}

function resolveParametersForCurrentInstruction(machine: Machine): number[] {
	const { memory, instructionCounter } = machine;
	const fullOpCode = memory[instructionCounter];
	const opCode = getOpCodeFromFullOpCode(fullOpCode);
	const parameterModes = getParameterModes(fullOpCode);

	const { arity, resolvedParamCount } = opCodeDetailsMap[opCode];
	const paramStartPosition = instructionCounter + 1;
	const rawLeadingParams = memory.slice(paramStartPosition, paramStartPosition + resolvedParamCount);

	return [
		...rawLeadingParams.map((val, index) => (parameterModes[index] == ParameterMode.Immediate ? val : memory[val])),
		memory[instructionCounter + arity],
	];
}

function getParameterModes(fullOpCode: number) {
	const opCode = getOpCodeFromFullOpCode(fullOpCode);
	const { arity } = opCodeDetailsMap[opCode];
	return _.times(arity, n => getDigit(fullOpCode, n + 3));
}

function getOpCodeFromFullOpCode(fullOpCode: number) {
	return (getDigit(fullOpCode, 1) + 10 * getDigit(fullOpCode, 2)) as OpCode;
}

function getDigit(num: number, posFromRight: number) {
	return Math.floor((num / Math.pow(10, posFromRight - 1)) % 10);
}
