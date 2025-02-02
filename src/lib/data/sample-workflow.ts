export const workflowData = {
	responseStatus: "SUCCESS",
	workflowData: {
		moduleNodes: [
			[
				{
					identity: { low: 146, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "tailwind.config.ts",
						moduleSourceCode:
							'import type { Config } from "tailwindcss"\n\nconst config: Config = {\n\tcontent: [\n\t\t"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",\n\t\t"./src/components/**/*.{js,ts,jsx,tsx,mdx}",\n\t\t"./src/app/**/*.{js,ts,jsx,tsx,mdx}",\n\t],\n\tplugins: [],\n\ttheme: {\n\t\textend: {\n\t\t\tfontFamily: {\n\t\t\t\tmono: ["Jetbrains Mono", "monospace"],\n\t\t\t},\n\t\t\tcolors: {\n\t\t\t\ttermgrey: "#222222",\n\t\t\t\ttermwhite: "#DDDDDD",\n\t\t\t},\n\t\t},\n\t},\n}\nexport default config\n',
					},
					elementId: "146",
				},
			],
			[
				{
					identity: { low: 148, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/components/ShellOutput.tsx",
						moduleSourceCode:
							'import { isURL } from "@/utils/common"\n\nexport type ShellOutputProps = {\n\ttextContent: string\n\toverrideColor?: string\n}\n\nexport function ShellOutput(props: ShellOutputProps) {\n\tconst { overrideColor = "termwhite", textContent } = props\n\n\tconst isContentURL = isURL(textContent)\n\n\tconst forceDeadText = (\n\t\t<>\n\t\t\t<p className={"text-green-400"}></p>\n\t\t\t<p className={"text-red-400"}></p>\n\t\t\t<p className={"text-blue-400"}></p>\n\t\t\t<p className={"text-yellow-400"}></p>\n\t\t\t<p className={"text-pink-400"}></p>\n\t\t</>\n\t)\n\n\treturn (\n\t\t<p className={`text-${overrideColor}-400`}>\n\t\t\t{isContentURL ? (\n\t\t\t\t<a\n\t\t\t\t\thref={textContent}\n\t\t\t\t\tclassName={"hover:underline hover:decoration-termwhite"}\n\t\t\t\t\ttarget={"_blank"}\n\t\t\t\t>\n\t\t\t\t\t{textContent}\n\t\t\t\t</a>\n\t\t\t) : (\n\t\t\t\ttextContent\n\t\t\t)}\n\t\t</p>\n\t)\n}\n',
					},
					elementId: "148",
				},
			],
			[
				{
					identity: { low: 149, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/components/ShellWindow.tsx",
						moduleSourceCode:
							'import { ShellOutput } from "@/components/ShellOutput"\nimport { execCommand, parseCommandInput } from "@/utils/commandREPL"\nimport { KONAMI_CODE, generateInitString } from "@/utils/common"\nimport { useCommandHistory } from "@/utils/hooks/useCommandHistory"\nimport { useSecretCode } from "@/utils/hooks/useSecretCode"\nimport { ShellHandle } from "@/utils/typedef"\nimport { useCallback, useEffect, useMemo, useRef, useState } from "react"\n\nexport type ShellWindowProps = {}\n\nexport function ShellWindow(props: ShellWindowProps) {\n\tconst [shellLocked, setShellLocked] = useState<boolean>(false)\n\n\tconst commandHistory = useCommandHistory()\n\n\tconst [shellContent, setShellContent] = useState<string[]>([\n\t\tgenerateInitString(),\n\t])\n\n\tconst [inputText, setInputText] = useState<string>("")\n\n\tconst [shellColor, setShellColor] = useState("termwhite")\n\n\tconst inputRef = useRef<HTMLInputElement>(null)\n\tconst termOutputRef = useRef<HTMLElement>(null)\n\tconst lastOutputRef = useRef<HTMLElement>(null)\n\n\tconst shellHandle: ShellHandle = useMemo(() => {\n\t\tconst memoHandle: ShellHandle = {\n\t\t\tlockHandle: () => {\n\t\t\t\tsetShellLocked(true)\n\t\t\t},\n\t\t\tunlockHandle: () => {\n\t\t\t\tsetShellLocked(false)\n\t\t\t},\n\t\t\twriteLine: (outString) => {\n\t\t\t\tsetShellContent((prevContent) => {\n\t\t\t\t\treturn [...prevContent, outString]\n\t\t\t\t})\n\t\t\t},\n\t\t\tclearShell: () => {\n\t\t\t\tsetShellContent([generateInitString()])\n\t\t\t},\n\t\t\tsetShellColor: (newColor) => {\n\t\t\t\tsetShellColor(newColor)\n\t\t\t},\n\t\t}\n\t\treturn memoHandle\n\t}, [setShellLocked, setShellContent])\n\n\tconst { onKeyPress } = useSecretCode({\n\t\tcodeSequence: KONAMI_CODE,\n\t\tonUnlock: () => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Buffer overflow! You\'ve unlocked SUDO mode. This doesn\'t do much as of now!",\n\t\t\t)\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t})\n\n\tconst executeUserInput = useCallback(() => {\n\t\tconst parsedCommand = parseCommandInput(inputText)\n\t\tif (parsedCommand.commandName !== "NOOP") {\n\t\t\tcommandHistory.addCommand(parsedCommand)\n\t\t}\n\t\tsetShellContent((prevContent) => {\n\t\t\treturn [...prevContent, `> ${inputText}`]\n\t\t})\n\t\tif (parsedCommand.commandName !== "NOOP") {\n\t\t\texecCommand(parsedCommand, shellHandle)\n\t\t}\n\t\tsetInputText("")\n\t}, [commandHistory, inputText, shellHandle])\n\n\tuseEffect(() => {\n\t\tconst textRef = inputRef.current\n\t\tif (!textRef) {\n\t\t\treturn\n\t\t}\n\n\t\tconst eventHandler = (eventData: KeyboardEvent) => {\n\t\t\tif (shellLocked) {\n\t\t\t\t// Some command is writing\n\t\t\t\treturn\n\t\t\t}\n\t\t\tif (eventData.isComposing) {\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tconst keyData = eventData.key\n\n\t\t\tonKeyPress(keyData)\n\n\t\t\tif (keyData.startsWith("Arrow")) {\n\t\t\t\tif (keyData === "ArrowLeft" || keyData === "ArrowRight") {\n\t\t\t\t\t// Do nothing\n\t\t\t\t} else if (keyData === "ArrowUp") {\n\t\t\t\t\tconst partialCommand = parseCommandInput(inputText)\n\t\t\t\t\tconst prevCommand = commandHistory.rewindCommand()\n\t\t\t\t\tsetInputText(prevCommand.rawCommand)\n\t\t\t\t} else {\n\t\t\t\t\tconst nextCommand = commandHistory.forwardCommand()\n\t\t\t\t\tsetInputText(nextCommand.rawCommand)\n\t\t\t\t}\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tif (keyData === "Enter") {\n\t\t\t\texecuteUserInput()\n\t\t\t\treturn\n\t\t\t}\n\t\t}\n\n\t\ttextRef.addEventListener("keydown", eventHandler)\n\n\t\treturn () => {\n\t\t\tif (!textRef) {\n\t\t\t\treturn\n\t\t\t}\n\t\t\ttextRef.removeEventListener("keydown", eventHandler)\n\t\t}\n\t}, [\n\t\tcommandHistory,\n\t\texecuteUserInput,\n\t\tinputText,\n\t\tonKeyPress,\n\t\tshellHandle,\n\t\tshellLocked,\n\t])\n\n\tuseEffect(() => {\n\t\tif (lastOutputRef.current && termOutputRef.current) {\n\t\t\ttermOutputRef.current.scrollTop = lastOutputRef.current.offsetTop\n\t\t}\n\t})\n\n\t// If you\'re seeing ugly scrollbars blame Chrome / Chromium / Edge or whatever fork you are running.\n\t// Works perfectly fucking fine in firefox\n\n\treturn (\n\t\t<div\n\t\t\tclassName={\n\t\t\t\t"flex flex-grow flex-col justify-between border-4 border-termwhite"\n\t\t\t}\n\t\t>\n\t\t\t<div className={"scrollbar-hidden flex flex-col overflow-y-scroll"}>\n\t\t\t\t<div\n\t\t\t\t\tclassName={\n\t\t\t\t\t\t"flex flex-row items-center justify-between gap-4 border-termwhite bg-termwhite p-2 text-xl text-termgrey"\n\t\t\t\t\t}\n\t\t\t\t>\n\t\t\t\t\t<svg\n\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\t\t\tfill="none"\n\t\t\t\t\t\tviewBox="0 0 24 24"\n\t\t\t\t\t\tstrokeWidth={1.5}\n\t\t\t\t\t\tstroke="currentColor"\n\t\t\t\t\t\tclassName="h-6 w-6"\n\t\t\t\t\t>\n\t\t\t\t\t\t<path\n\t\t\t\t\t\t\tstrokeLinecap="round"\n\t\t\t\t\t\t\tstrokeLinejoin="round"\n\t\t\t\t\t\t\td="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</svg>\n\t\t\t\t\t{`ArnitDOS ${shellLocked ? ":O" : ":)"}`}\n\t\t\t\t\t<button\n\t\t\t\t\t\tclassName={\n\t\t\t\t\t\t\t"text-lg hover:underline hover:decoration-termgrey"\n\t\t\t\t\t\t}\n\t\t\t\t\t\tonClick={shellHandle.clearShell}\n\t\t\t\t\t>\n\t\t\t\t\t\tClear\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\t{/* @ts-ignore */}\n\t\t\t\t<div\n\t\t\t\t\tclassName={\n\t\t\t\t\t\t"scrollbar-hidden flex-grow-0 overflow-y-scroll p-2"\n\t\t\t\t\t}\n\t\t\t\t\t// @ts-ignore\n\t\t\t\t\tref={termOutputRef}\n\t\t\t\t>\n\t\t\t\t\t{shellContent.map((contentString, contentIdx) => {\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t// @ts-ignore\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tkey={`${contentIdx}.${contentString}`}\n\t\t\t\t\t\t\t\t{...(contentIdx === shellContent.length - 1\n\t\t\t\t\t\t\t\t\t? {\n\t\t\t\t\t\t\t\t\t\t\tref: lastOutputRef,\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t: {})}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<ShellOutput\n\t\t\t\t\t\t\t\t\ttextContent={contentString}\n\t\t\t\t\t\t\t\t\toverrideColor={shellColor}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t)\n\t\t\t\t\t})}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div\n\t\t\t\tclassName={\n\t\t\t\t\t"flex flex-row items-center justify-between border-0 border-t-4 border-termwhite"\n\t\t\t\t}\n\t\t\t>\n\t\t\t\t<div className={"flex flex-grow flex-row gap-2 p-4"}>\n\t\t\t\t\t{shellLocked ? "Locked" : "Input"}\n\t\t\t\t\t<div className={shellLocked ? "hidden" : "blink"}>\n\t\t\t\t\t\t{">"}\n\t\t\t\t\t</div>\n\t\t\t\t\t<input\n\t\t\t\t\t\tdisabled={shellLocked}\n\t\t\t\t\t\tclassName={`text-${shellColor}-400 flex-grow bg-termgrey focus:underline focus:decoration-dashed focus:outline-none`}\n\t\t\t\t\t\t/*// @ts-ignore */\n\t\t\t\t\t\tref={inputRef}\n\t\t\t\t\t\ttype={"text"}\n\t\t\t\t\t\tonChange={(ev) => {\n\t\t\t\t\t\t\tsetInputText(ev.target.value)\n\t\t\t\t\t\t}}\n\t\t\t\t\t\tvalue={inputText}\n\t\t\t\t\t/>\n\t\t\t\t\t<div className={shellLocked ? "hidden" : "blink"}>\n\t\t\t\t\t\t{"<"}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div className={"border-l-4 border-l-termwhite p-4"}>\n\t\t\t\t\t<button onClick={executeUserInput} disabled={shellLocked}>\n\t\t\t\t\t\t{/* Thank you JBMono Ligatures!*/}\n\t\t\t\t\t\t{shellLocked ? "Waiting -_-" : "Execute ->"}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t)\n}\n',
					},
					elementId: "149",
				},
			],
			[
				{
					identity: { low: 151, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/pages/_app.tsx",
						moduleSourceCode:
							'import "@/styles/globals.css"\nimport type { AppProps } from "next/app"\n\nexport default function App({ Component, pageProps }: AppProps) {\n\treturn <Component {...pageProps} />\n}\n',
					},
					elementId: "151",
				},
			],
			[
				{
					identity: { low: 154, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/pages/_document.tsx",
						moduleSourceCode:
							'import { Head, Html, Main, NextScript } from "next/document"\n\nexport default function Document() {\n\treturn (\n\t\t<Html lang="en">\n\t\t\t<Head />\n\t\t\t<body>\n\t\t\t\t<Main />\n\t\t\t\t<NextScript />\n\t\t\t</body>\n\t\t</Html>\n\t)\n}\n',
					},
					elementId: "154",
				},
			],
			[
				{
					identity: { low: 156, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/pages/index.tsx",
						moduleSourceCode:
							'import { ShellWindow } from "@/components/ShellWindow"\nimport { getVersionString } from "@/utils/common"\nimport Head from "next/head"\n\nexport default function IndexPage() {\n\treturn (\n\t\t<>\n\t\t\t<Head>\n\t\t\t\t<title>{`ArnitDOS ${getVersionString()}`}</title>\n\t\t\t\t<meta\n\t\t\t\t\tname={"description"}\n\t\t\t\t\tcontent={\n\t\t\t\t\t\t"Welcome to arnitdo\'s portfolio page! This has been designed like an intuitive terminal interface. Give it a try!"\n\t\t\t\t\t}\n\t\t\t\t/>\n\t\t\t</Head>\n\t\t\t<div\n\t\t\t\tclassName={\n\t\t\t\t\t"flex h-screen w-screen bg-termgrey font-mono text-termwhite"\n\t\t\t\t}\n\t\t\t>\n\t\t\t\t<ShellWindow />\n\t\t\t</div>\n\t\t</>\n\t)\n}\n',
					},
					elementId: "156",
				},
			],
			[
				{
					identity: { low: 158, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/commandREPL.ts",
						moduleSourceCode:
							'import { EXECUTABLE_COMMANDS, isValidExecCommand } from "@/utils/commands"\nimport { COMMAND_SPLIT_REGEXP } from "@/utils/globals"\nimport {\n\tCommand,\n\tCommandOption,\n\tCommandOptionType,\n\tShellHandle,\n} from "@/utils/typedef"\n\n/**\n * @summary Generates a Command structure from a given input string\n * **/\nexport function parseCommandInput(commandString: string): Command {\n\tlet inputString = commandString.trim()\n\tinputString = inputString.toLowerCase()\n\n\tif (inputString.length === 0) {\n\t\t// Empty command\n\t\treturn {\n\t\t\tcommandName: "NOOP",\n\t\t\trawCommand: "",\n\t\t\tcommandArgs: [],\n\t\t\tcommandOptions: [],\n\t\t}\n\t}\n\n\tconst stringTokens = inputString.split(COMMAND_SPLIT_REGEXP)\n\tconst cleanTokens = stringTokens.filter((stringToken) => {\n\t\treturn (\n\t\t\tstringToken.length > 0 || // Empty string\n\t\t\tstringToken == "-" ||\n\t\t\tstringToken == "--" // Only long/short opt flag passed, we need more data after -\n\t\t)\n\t})\n\tconst firstKeyword = cleanTokens[0]\n\n\tconst inputArgs = cleanTokens.slice(1)\n\n\tconst argList = inputArgs.filter((argString) => {\n\t\treturn !argString.startsWith("-")\n\t})\n\n\tconst rawOptList = inputArgs.filter((optString) => {\n\t\treturn optString.startsWith("-")\n\t})\n\n\tconst mappedOptList = rawOptList.map((optString): CommandOption => {\n\t\tif (optString.startsWith("--")) {\n\t\t\tconst trimmedOptString = optString.slice(2)\n\t\t\treturn {\n\t\t\t\toptType: CommandOptionType.LONG_OPT,\n\t\t\t\toptionValue: trimmedOptString,\n\t\t\t}\n\t\t} else {\n\t\t\tconst trimmedOptString = optString.slice(1)\n\t\t\treturn {\n\t\t\t\toptType: CommandOptionType.SHORT_OPT,\n\t\t\t\toptionValue: trimmedOptString[0],\n\t\t\t}\n\t\t}\n\t})\n\n\treturn {\n\t\tcommandName: firstKeyword.toUpperCase(),\n\t\trawCommand: commandString.trim(),\n\t\tcommandArgs: argList,\n\t\tcommandOptions: mappedOptList,\n\t}\n}\n\nexport function execCommand(targetCommand: Command, shellHandle: ShellHandle) {\n\tconst isValidCommand = isValidExecCommand(targetCommand.commandName)\n\tif (!isValidCommand) {\n\t\tshellHandle.lockHandle()\n\t\tshellHandle.writeLine(\n\t\t\t`${targetCommand.rawCommand}: Not a valid command!`,\n\t\t)\n\t\tshellHandle.unlockHandle()\n\t} else {\n\t\tconst matchingCommand = EXECUTABLE_COMMANDS.find((execCommand) => {\n\t\t\treturn execCommand.commandExecutable === targetCommand.commandName\n\t\t})\n\t\tif (matchingCommand === undefined) {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(`${targetCommand.rawCommand}: Error!`)\n\t\t\tshellHandle.unlockHandle()\n\t\t} else {\n\t\t\tmatchingCommand.executeCommand(\n\t\t\t\ttargetCommand.commandArgs,\n\t\t\t\ttargetCommand.commandOptions,\n\t\t\t\tshellHandle,\n\t\t\t)\n\t\t}\n\t}\n}\n',
					},
					elementId: "158",
				},
			],
			[
				{
					identity: { low: 159, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/commands.ts",
						moduleSourceCode:
							'import {\n\tLIST_DATA,\n\tPROJECT_DATA,\n\tRESUME_LINK,\n\tgetVersionString,\n} from "@/utils/common"\nimport { ExecutableCommand } from "@/utils/typedef"\n\nconst HELP_STRING_MAP: Record<string, string> = {\n\tHELP: "Great, now we\'re stuck in a loop! Try a different command, maybe that will break it...",\n\tHELLO: "Do you need an introduction? Say `Hello!`",\n\tLIST: "Enumerate some stuff - such as `projects`, `experience`, `hobbies` or `academics`",\n\tCONTACT: "Want to get in touch with me?, say `contact` and find out how!",\n\tRESUME: "Now we\'re talking! Punch in `resume` to get a quick link to my latest Resume",\n\tPROJECT:\n\t\t"Want to dig deeper into my works? Hit `project <name>`, you\'ll find more information there!",\n\tSOCIAL: "There\'s more to me than bits and bytes! Give me a ping on any of my `social` links!",\n\tCLEAR: "Two well-dressed men in black pull out a very suspicious device that emits a bright flash...",\n\tCOLOR: "Bring out the colors! Usage: `color <colorname>`. Accepts `red|green|yellow|blue|pink`. Run without arguments to reset",\n\tSLEEP: "*Yawn* I\'ve been up too long! Put me to sleep with `sleep <seconds>`",\n}\n\nexport const EXECUTABLE_COMMANDS: ExecutableCommand[] = [\n\t{\n\t\tcommandExecutable: "NOOP",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tvoid 0\n\t\t\t// Do nothing, this is a noop command!\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "CLEAR",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.clearShell()\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "HELLO",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Hey there! Welcome to ArnitDOS, I\'m an interactive shell, here to guide you through Arnav\'s Portfolio!\\nType `help` to list all available commands.",\n\t\t\t)\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "HELP",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tconst verString = getVersionString()\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Need help? Got you covered - try running one of the following commands, or `help <name>` for more information",\n\t\t\t\t)\n\t\t\t\tVALID_COMMAND_NAMES.forEach((commandKey, commandIdx) => {\n\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t`${commandIdx + 1}) ${commandKey.toLowerCase()}`,\n\t\t\t\t\t)\n\t\t\t\t})\n\t\t\t} else {\n\t\t\t\tfor (let commandArg of commandArgs) {\n\t\t\t\t\tcommandArg = commandArg.toUpperCase()\n\t\t\t\t\tif (VALID_COMMAND_NAMES.includes(commandArg)) {\n\t\t\t\t\t\tconst helpText = HELP_STRING_MAP[commandArg]\n\t\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t\t`${commandArg.toLowerCase()}: ${helpText}`,\n\t\t\t\t\t\t)\n\t\t\t\t\t} else {\n\t\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t\t"Sorry, can\'t really help with that :(",\n\t\t\t\t\t\t)\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "LIST",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Tell me something to list! Like `list projects|academics|experience|hobbies`",\n\t\t\t\t)\n\t\t\t} else if (commandArgs.length === 1) {\n\t\t\t\tconst firstArg = commandArgs[0]\n\t\t\t\tconst uppercaseArg = firstArg.toUpperCase()\n\t\t\t\tif (Object.keys(LIST_DATA).includes(uppercaseArg)) {\n\t\t\t\t\tconst listPoints = LIST_DATA[uppercaseArg]\n\t\t\t\t\tfor (const listPoint of listPoints) {\n\t\t\t\t\t\tshellHandle.writeLine(listPoint)\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t"I can\'t list that, try something relevant!",\n\t\t\t\t\t)\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Too many things to list! Try one at a time!",\n\t\t\t\t)\n\t\t\t}\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "CONTACT",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Shoot me a mail at the address below, and I\'ll get in touch with you",\n\t\t\t)\n\t\t\tshellHandle.writeLine("mailto:hello@arnitdo.dev")\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "RESUME",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine("View my resume at the link below!")\n\t\t\tshellHandle.writeLine("")\n\t\t\tshellHandle.writeLine(RESUME_LINK)\n\t\t\tshellHandle.writeLine("")\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "PROJECT",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Give me a project id, I\'ll tell you more! Use the `list` command",\n\t\t\t\t)\n\t\t\t} else if (commandArgs.length === 1) {\n\t\t\t\tconst projectId = commandArgs[0].toUpperCase()\n\t\t\t\tif (Object.keys(PROJECT_DATA).includes(projectId)) {\n\t\t\t\t\tconst projectData = PROJECT_DATA[projectId]\n\t\t\t\t\tconst {\n\t\t\t\t\t\tprojectTitle,\n\t\t\t\t\t\tprojectDescription,\n\t\t\t\t\t\tgithubLink,\n\t\t\t\t\t\tprojectDuration,\n\t\t\t\t\t\tprojectNote,\n\t\t\t\t\t} = projectData\n\t\t\t\t\tshellHandle.writeLine(`Title: ${projectTitle}`)\n\t\t\t\t\tshellHandle.writeLine(`Description: ${projectDescription}`)\n\t\t\t\t\tshellHandle.writeLine("GitHub Link")\n\t\t\t\t\tshellHandle.writeLine(githubLink)\n\t\t\t\t\tif (projectDuration) {\n\t\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t\t`Developed from: ${projectDuration}`,\n\t\t\t\t\t\t)\n\t\t\t\t\t} else {\n\t\t\t\t\t\tshellHandle.writeLine(`Still under development`)\n\t\t\t\t\t}\n\t\t\t\t\tif (projectNote) {\n\t\t\t\t\t\tshellHandle.writeLine(`Note: ${projectNote}`)\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tshellHandle.writeLine("That\'s not a valid project ID!")\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"That\'s way too many projects! Try one at a time.",\n\t\t\t\t)\n\t\t\t}\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "SOCIAL",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Reach out to me on any of the below links, and I\'ll get in touch!",\n\t\t\t)\n\t\t\tshellHandle.writeLine("GitHub @arnitdo")\n\t\t\tshellHandle.writeLine("https://github.com/arnitdo")\n\t\t\tshellHandle.writeLine("Instagram: @arnitdo")\n\t\t\tshellHandle.writeLine("https://instagram.com/arnitdo")\n\t\t\tshellHandle.writeLine("LinkedIn: @arnitdo")\n\t\t\tshellHandle.writeLine("https://linkedin.com/in/arnitdo")\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "COLOR",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.setShellColor("termwhite")\n\t\t\t} else {\n\t\t\t\tconst colorArg = commandArgs[0]\n\t\t\t\tshellHandle.setShellColor(colorArg)\n\t\t\t}\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "SLEEP",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"I can\'t just go to sleep forever, you know?",\n\t\t\t\t)\n\t\t\t\tshellHandle.unlockHandle()\n\t\t\t} else {\n\t\t\t\tconst firstArg = commandArgs[0]\n\t\t\t\tconst numericArg = Number.parseInt(firstArg)\n\t\t\t\tif (Number.isNaN(numericArg) || numericArg < 1) {\n\t\t\t\t\tshellHandle.writeLine("That\'s not a valid input!")\n\t\t\t\t\tshellHandle.unlockHandle()\n\t\t\t\t} else {\n\t\t\t\t\tsetTimeout(\n\t\t\t\t\t\tshellHandle.unlockHandle,\n\t\t\t\t\t\tnumericArg * 1000, // ms\n\t\t\t\t\t)\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t},\n]\n\nconst FORBIDDEN_COMMANDS = ["NOOP"]\n\nconst VALID_COMMAND_NAMES = EXECUTABLE_COMMANDS.map((commandStruct) => {\n\treturn commandStruct.commandExecutable\n}).filter((commandName) => {\n\treturn !FORBIDDEN_COMMANDS.includes(commandName)\n})\n\nexport function isValidExecCommand(commandName: string) {\n\treturn VALID_COMMAND_NAMES.includes(commandName)\n}\n',
					},
					elementId: "159",
				},
			],
			[
				{
					identity: { low: 160, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/common.ts",
						moduleSourceCode:
							'export function getVersionString(): string {\n\tconst nowDate = new Date()\n\tconst nowYear = nowDate.getFullYear()\n\tconst nowMonth = nowDate.getMonth() + 1\n\tconst nowDayDate = nowDate.getDate()\n\n\treturn `v${nowYear}.${nowMonth}.${nowDayDate}`\n}\n\nexport function generateInitString(): string {\n\treturn (\n\t\t"ArnitDOS" + getVersionString() + ". Type `help` for more information."\n\t)\n}\n\nexport const RESUME_LINK =\n\t"https://drive.google.com/file/d/1LjvdoobpPFOk9vGUV5reF9N_pN5UfO5i/view" as const\n\nexport const LIST_DATA = {\n\tEXPERIENCE: [\n\t\t"I have worked as a Backend Developer Intern at Engaze.in from June 2024 to August 2024",\n\t\t"I\'ve also worked as a Freelance Web Developer for Pixels and Grids, developing websites and web applications",\n\t\t"I\'ve worked as a MERN Stack Developer Intern at CTO-Ninja from June 2023 to October 2023",\n\t\t"I was also a part of GDSC DJSCE\'s Web Development Co-Committee for the academic year 2023-2024",\n\t\t"I\'m currently at the forefront of GDG DJSCE, as the Co-Lead for the academic year 2024-2025",\n\t],\n\tPROJECTS: [\n\t\t"I\'ve worked on various projects in Typescript, Javascript, Postgres, Python, C++ and the MERN/PERN Stack. Here are some of my personal favorites.",\n\t\t"To learn more about each project, use the `project <name>` command, and use one of the names in the [square brackets] below",\n\t\t"[mimicai] A customisable AI mimc for having custom conversations",\n\t\t"[thinq] ThinQ a full stack online education platform using NextJS and PostgreSQL",\n\t\t"[blitzai] BlitzAI is a cutting-edge SaaS platform designed to empower content creators by integrating AI seamlessly into their video creation workflows",\n\t\t"[nutrino] Nutrino is a web application designed to help individuals with allergies and dietary restrictions navigate the world of food effortlessly",\n\t\t"[versura] Versura is a revolutionary blockchain based crowdfunding platform, developed as an academic project at SVKM\'s SBMP",\n\t\t"[axess] Axess is a prize-winning QR-Code based access control system integrating fine-tuned permissions and user management",\n\t\t"[gpiostudio] GPIOStudio is a GUI for developing Python scripts for the Raspberry Pi GPIO, built using Qt5 and C++11",\n\t\t"[drone] I\'ve worked on developing software for integrating voice control with PixHawk drones using Raspberry Pis",\n\t],\n\tHOBBIES: [\n\t\t"I love astronomy, stargazing, working out, and last but not the least, tinkering! You\'ll always find a spare screwdriver or patch cord in my bag ;)",\n\t],\n\tACADEMICS: [\n\t\t"Here are some of my academic achievements -",\n\t\t"I\'m currently pursuing a B.Tech Degree in Computer Engineering at SVKM\'s DJSCE",\n\t\t"I hold a Diploma in Computer Engineering from SVKM\'s Shri Bhagubhai Mafatlal Polytechnic",\n\t\t"I\'ve participated in various technical competitions and hackathons, mosty notably winning the 2nd Prize at KJSCE Devopia Hackathon",\n\t\t"I have also had the honor of being part of the organising committee as the Technical Head for PolyHacks 1.0 Hackathon at SVKM\'s SBMP",\n\t],\n} as Record<string, string[]>\n\ntype ProjectInfo = {\n\tprojectTitle: string\n\tprojectDescription: string\n\tgithubLink: string\n\tprojectNote?: string\n\tprojectDuration?: string\n}\n\nexport const PROJECT_DATA: Record<string, ProjectInfo> = {\n\tMIMICAI: {\n\t\tprojectTitle: "MimicAI - A customisable AI mimic for conversations",\n\t\tprojectDescription:\n\t\t\t"MimicAI is a customisable AI mimic for users to have conversations with. " +\n\t\t\t"It allows users to fork conversations from a message, trying out different messages and responses",\n\t\tgithubLink: "https://mimicai.arnitdo.dev",\n\t\tprojectDuration: "12/2024 - 12/2024",\n\t\tprojectNote: "Developed in under 24 hours",\n\t},\n\tTHINQ: {\n\t\tprojectTitle: "ThinQ - A virtual classroom enhancement platform",\n\t\tprojectDescription:\n\t\t\t"ThinQ is a comprehensive solution for virtual classrooms, providing a wide range of features to enhance the online learning experience." +\n\t\t\t"It features calendar integrations, video calling, attention detection among a wide variety of features designed to improve online classroom teaching",\n\t\tprojectNote: "This project was developed at PICT TechFiesta 2024",\n\t\tgithubLink: "https://github.com/arnitdo/ThinQ",\n\t\tprojectDuration: "02/2024 - 04/2023",\n\t},\n\tBLITZAI: {\n\t\tprojectTitle: "BlitzAI: Next-Gen AI Video Creation SaaS",\n\t\tprojectDescription:\n\t\t\t"BlitzAI is a cutting-edge SaaS platform designed to empower content creators by integrating AI seamlessly into their video creation workflows." +\n\t\t\t"With a user-friendly UI and a modular approach, BlitzAI allows users to pick and choose AI-driven features at any step of the content creation process.",\n\t\tprojectNote: "This project was developed at Datathon 3.0 at KJSCE",\n\t\tgithubLink: "https://github.com/arnitdo/Blitz.AI-Datathon-3",\n\t\tprojectDuration: "02/2024",\n\t},\n\tNUTRINO: {\n\t\tprojectTitle: "Nutrino: Your Own Food Assistant",\n\t\tprojectDescription:\n\t\t\t"Nutrino is a web application designed to help individuals with allergies and dietary restrictions navigate the world of food effortlessly. " +\n\t\t\t"By utilizing advanced machine learning models, Nutrino provides users with powerful tools to detect ingredients, " +\n\t\t\t"suggest alternatives, and offer a delightful cooking experience.",\n\t\tprojectNote: "This project was developed at TSEC Hack24",\n\t\tgithubLink: "https://github.com/arnitdo/Nutrino",\n\t\tprojectDuration: "01/2024 - 02/2024",\n\t},\n\tVERSURA: {\n\t\tprojectTitle:\n\t\t\t"Versura - A revolutionary blockchain based crowdfunding platform",\n\t\tprojectDescription:\n\t\t\t"Versura is a web+blockchain based crowdfunding platform developed as part of " +\n\t\t\t"academic curriculum. Integrated AWS RDS for database provisioning and storage. " +\n\t\t\t"Implemented project front-end using NextJS and Elastic UI. Blockchain" +\n\t\t\t"functionality implemented using Metamask and Web3.js",\n\t\tprojectNote:\n\t\t\t"This project was developed as part of an academic project requirement for completing my Diploma in Computer Engineering",\n\t\tgithubLink: "https://github.com/arnitdo/versura",\n\t\tprojectDuration: "02/2023 - 06/2023",\n\t},\n\tAXESS: {\n\t\tprojectTitle: "Axess - A innovative access control system",\n\t\tprojectDescription:\n\t\t\t"Axess is an innovative QR-Code based access control management system developed at VESP\'s " +\n\t\t\t"Technothon 2023. It integrates a fine-tuned permission system with a scalable QR-based location and entry/exit " +\n\t\t\t"point-of-transit systems. Such functionality was achieved using NextUI, Google Cloud Firebase Firestore, and NextJS",\n\t\tgithubLink: "https://github.com/arnitdo/Axess",\n\t\tprojectNote:\n\t\t\t"This project won the Third Prize at VESP\'s Technothon 2023",\n\t\tprojectDuration: "04/2023",\n\t},\n\tGPIOSTUDIO: {\n\t\tprojectTitle: "GPIO Studio",\n\t\tprojectDescription:\n\t\t\t"Created a GPIO-Interfacing script generator GUI for Raspberry Pis and other IoT " +\n\t\t\t"devices. Developed and utilized skills acquired in C++11 and Qt5 GUI Framework. " +\n\t\t\t"Integrated various open source third-party libraries to provide data parsing and " +\n\t\t\t"storage.",\n\t\tgithubLink: "https://github.com/arnitdo/GPIOStudio",\n\t\tprojectDuration: "08/2021 - 01/2022",\n\t},\n\tDRONE: {\n\t\tprojectTitle: "Voice Controlled Drone",\n\t\tprojectDescription:\n\t\t\t"Developed a Voice Controlled Drone, implementing various protocols to enable " +\n\t\t\t"communication between a PixHawk Flight Controller and Raspberry Pi SBC. Uses " +\n\t\t\t"Google Cloud-based speech to text processing to analyze voice commands",\n\t\tprojectDuration: "01/2023 - 06/2023",\n\t\tgithubLink: "https://github.com/arnitdo/Voice-Controlled-Drone",\n\t\tprojectNote:\n\t\t\t"This was a collaborative effort as part of an academic project",\n\t},\n} as const\n\nexport function isURL(urlLikeString: string) {\n\ttry {\n\t\tconst actualURL = new URL(urlLikeString)\n\t\treturn (\n\t\t\tactualURL.protocol.startsWith("http") ||\n\t\t\tactualURL.protocol.startsWith("mailto")\n\t\t)\n\t} catch {\n\t\treturn false\n\t}\n}\n\n// ^^vv<><>ba\nexport const KONAMI_CODE = [\n\t"ArrowUp",\n\t"ArrowUp",\n\t"ArrowDown",\n\t"ArrowDown",\n\t"ArrowLeft",\n\t"ArrowRight",\n\t"ArrowLeft",\n\t"ArrowRight",\n\t"b",\n\t"a",\n]\n',
					},
					elementId: "160",
				},
			],
			[
				{
					identity: { low: 161, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/globals.ts",
						moduleSourceCode:
							"export const COMMAND_SPLIT_REGEXP = /\\s|\\./gi\n\nexport const EXIT_TIMEOUT = 5\n",
					},
					elementId: "161",
				},
			],
			[
				{
					identity: { low: 162, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/typedef.ts",
						moduleSourceCode:
							"export enum CommandOptionType {\n\tSHORT_OPT,\n\tLONG_OPT,\n}\n\nexport type CommandOption = {\n\toptType: CommandOptionType\n\toptionValue: string\n}\n\nexport type Command = {\n\tcommandName: string\n\trawCommand: string\n\tcommandArgs: string[]\n\tcommandOptions: CommandOption[]\n}\n\nexport type ShellHandle = {\n\tlockHandle: () => void\n\tunlockHandle: () => void\n\twriteLine: (outString: string) => void\n\tclearShell: () => void\n\tsetShellColor: (colorName: string) => void\n}\n\nexport type ExecutableCommand = {\n\tcommandExecutable: string\n\texecuteCommand: (\n\t\tcommandArgs: string[],\n\t\tcommandOpts: CommandOption[],\n\t\tshellHandle: ShellHandle,\n\t) => void\n}\n",
					},
					elementId: "162",
				},
			],
			[
				{
					identity: { low: 163, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/hooks/useCommandHistory.ts",
						moduleSourceCode:
							'import { Command } from "@/utils/typedef"\nimport { useCallback, useState } from "react"\n\ntype UseCommandHistoryOptions = {}\n\ntype CommandHistory = {\n\thistoryStack: Command[]\n\tcurrIndex: number\n\taddCommand: (commandData: Command) => void\n\tclearHistory: () => void\n\trewindCommand: () => Command\n\tforwardCommand: () => Command\n}\n\nexport function useCommandHistory(\n\topts: UseCommandHistoryOptions = {},\n): CommandHistory {\n\tconst [historyStack, setHistoryStack] = useState<Command[]>([])\n\tconst [historyIdx, setHistoryIdx] = useState<number>(-1)\n\n\tconst addCommand = useCallback(\n\t\t(commandStr: Command) => {\n\t\t\tsetHistoryStack((prevStack) => {\n\t\t\t\t// Bring index forward to current index again\n\t\t\t\tsetHistoryIdx(prevStack.length)\n\t\t\t\treturn [...prevStack, commandStr]\n\t\t\t})\n\t\t},\n\t\t[setHistoryStack],\n\t)\n\n\tconst clearHistory = useCallback(() => {\n\t\tsetHistoryStack([])\n\t\tsetHistoryIdx(-1)\n\t}, [])\n\n\tconst forwardCommand = useCallback((): Command => {\n\t\tconst currIdx = historyIdx\n\t\tif (currIdx >= historyStack.length - 1) {\n\t\t\treturn {\n\t\t\t\tcommandName: "",\n\t\t\t\trawCommand: "",\n\t\t\t\tcommandArgs: [],\n\t\t\t\tcommandOptions: [],\n\t\t\t}\n\t\t} else {\n\t\t\tsetHistoryIdx((prevIdx) => {\n\t\t\t\treturn prevIdx + 1\n\t\t\t})\n\t\t\treturn historyStack[currIdx + 1]\n\t\t}\n\t}, [historyStack, historyIdx, setHistoryIdx])\n\n\tconst rewindCommand = useCallback((): Command => {\n\t\tconst currIdx = historyIdx\n\t\tif (currIdx === -1) {\n\t\t\treturn {\n\t\t\t\tcommandName: "",\n\t\t\t\trawCommand: "",\n\t\t\t\tcommandArgs: [],\n\t\t\t\tcommandOptions: [],\n\t\t\t}\n\t\t} else if (currIdx === 0) {\n\t\t\treturn historyStack[0]\n\t\t} else {\n\t\t\tsetHistoryIdx((prevIdx) => {\n\t\t\t\treturn prevIdx - 1\n\t\t\t})\n\t\t\treturn historyStack[currIdx]\n\t\t}\n\t}, [historyStack, historyIdx, setHistoryIdx])\n\n\treturn {\n\t\thistoryStack: historyStack,\n\t\tcurrIndex: historyIdx,\n\t\taddCommand: addCommand,\n\t\tforwardCommand: forwardCommand,\n\t\trewindCommand: rewindCommand,\n\t\tclearHistory: clearHistory,\n\t}\n}\n',
					},
					elementId: "163",
				},
			],
			[
				{
					identity: { low: 164, high: 0 },
					labels: ["Module"],
					properties: {
						modulePath: "src/utils/hooks/useSecretCode.ts",
						moduleSourceCode:
							'import { useCallback, useState } from "react"\n\nexport type UseSecretCodeArgs = {\n\tonUnlock: () => void\n\tcodeSequence: string[]\n}\n\nexport type SecretCodeRet = {\n\tonKeyPress: (keyCode: string) => void\n}\n\nexport function useSecretCode(args: UseSecretCodeArgs): SecretCodeRet {\n\tconst { onUnlock, codeSequence } = args\n\tconst [keyQueue, setKeyQueue] = useState<string[]>([])\n\n\tconst onKeyPress = useCallback(\n\t\t(keyCode: string) => {\n\t\t\tlet mergedQueue: string[] = []\n\t\t\tif (keyQueue.length >= codeSequence.length) {\n\t\t\t\tconst copyQueue = [...keyQueue]\n\t\t\t\tconst slicedQueue = copyQueue.slice(1, 12)\n\t\t\t\tmergedQueue = [...slicedQueue, keyCode]\n\t\t\t} else {\n\t\t\t\tmergedQueue = [...keyQueue, keyCode]\n\t\t\t}\n\t\t\tif (mergedQueue.length === codeSequence.length) {\n\t\t\t\tlet matchFlag = true\n\t\t\t\tfor (let idx = 0; idx < codeSequence.length; idx++) {\n\t\t\t\t\tif (mergedQueue[idx] !== codeSequence[idx]) {\n\t\t\t\t\t\tmatchFlag = false\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif (matchFlag) {\n\t\t\t\t\tonUnlock()\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\t// Do nothing, code cannot be input\n\t\t\t}\n\t\t\tsetKeyQueue(mergedQueue)\n\t\t},\n\t\t[codeSequence, keyQueue, onUnlock],\n\t)\n\n\treturn {\n\t\tonKeyPress: onKeyPress,\n\t}\n}\n',
					},
					elementId: "164",
				},
			],
		],
		symbolNodes: [
			[
				{
					identity: { low: 165, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "default",
						symbolPath: "tailwind.config.ts",
						symbolSourceCode:
							' config: Config = {\n\tcontent: [\n\t\t"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",\n\t\t"./src/components/**/*.{js,ts,jsx,tsx,mdx}",\n\t\t"./src/app/**/*.{js,ts,jsx,tsx,mdx}",\n\t],\n\tplugins: [],\n\ttheme: {\n\t\textend: {\n\t\t\tfontFamily: {\n\t\t\t\tmono: ["Jetbrains Mono", "monospace"],\n\t\t\t},\n\t\t\tcolors: {\n\t\t\t\ttermgrey: "#222222",\n\t\t\t\ttermwhite: "#DDDDDD",\n\t\t\t},\n\t\t},\n\t},\n}',
					},
					elementId: "165",
				},
			],
			[
				{
					identity: { low: 166, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "ShellOutput",
						symbolPath: "src/components/ShellOutput.tsx",
						symbolSourceCode:
							'\n\nexport function ShellOutput(props: ShellOutputProps) {\n\tconst { overrideColor = "termwhite", textContent } = props\n\n\tconst isContentURL = isURL(textContent)\n\n\tconst forceDeadText = (\n\t\t<>\n\t\t\t<p className={"text-green-400"}></p>\n\t\t\t<p className={"text-red-400"}></p>\n\t\t\t<p className={"text-blue-400"}></p>\n\t\t\t<p className={"text-yellow-400"}></p>\n\t\t\t<p className={"text-pink-400"}></p>\n\t\t</>\n\t)\n\n\treturn (\n\t\t<p className={`text-${overrideColor}-400`}>\n\t\t\t{isContentURL ? (\n\t\t\t\t<a\n\t\t\t\t\thref={textContent}\n\t\t\t\t\tclassName={"hover:underline hover:decoration-termwhite"}\n\t\t\t\t\ttarget={"_blank"}\n\t\t\t\t>\n\t\t\t\t\t{textContent}\n\t\t\t\t</a>\n\t\t\t) : (\n\t\t\t\ttextContent\n\t\t\t)}\n\t\t</p>\n\t)\n}',
					},
					elementId: "166",
				},
			],
			[
				{
					identity: { low: 167, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "ShellOutputProps",
						symbolPath: "src/components/ShellOutput.tsx",
						symbolSourceCode:
							"\n\nexport type ShellOutputProps = {\n\ttextContent: string\n\toverrideColor?: string\n}",
					},
					elementId: "167",
				},
			],
			[
				{
					identity: { low: 168, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "ShellWindow",
						symbolPath: "src/components/ShellWindow.tsx",
						symbolSourceCode:
							'\n\nexport function ShellWindow(props: ShellWindowProps) {\n\tconst [shellLocked, setShellLocked] = useState<boolean>(false)\n\n\tconst commandHistory = useCommandHistory()\n\n\tconst [shellContent, setShellContent] = useState<string[]>([\n\t\tgenerateInitString(),\n\t])\n\n\tconst [inputText, setInputText] = useState<string>("")\n\n\tconst [shellColor, setShellColor] = useState("termwhite")\n\n\tconst inputRef = useRef<HTMLInputElement>(null)\n\tconst termOutputRef = useRef<HTMLElement>(null)\n\tconst lastOutputRef = useRef<HTMLElement>(null)\n\n\tconst shellHandle: ShellHandle = useMemo(() => {\n\t\tconst memoHandle: ShellHandle = {\n\t\t\tlockHandle: () => {\n\t\t\t\tsetShellLocked(true)\n\t\t\t},\n\t\t\tunlockHandle: () => {\n\t\t\t\tsetShellLocked(false)\n\t\t\t},\n\t\t\twriteLine: (outString) => {\n\t\t\t\tsetShellContent((prevContent) => {\n\t\t\t\t\treturn [...prevContent, outString]\n\t\t\t\t})\n\t\t\t},\n\t\t\tclearShell: () => {\n\t\t\t\tsetShellContent([generateInitString()])\n\t\t\t},\n\t\t\tsetShellColor: (newColor) => {\n\t\t\t\tsetShellColor(newColor)\n\t\t\t},\n\t\t}\n\t\treturn memoHandle\n\t}, [setShellLocked, setShellContent])\n\n\tconst { onKeyPress } = useSecretCode({\n\t\tcodeSequence: KONAMI_CODE,\n\t\tonUnlock: () => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Buffer overflow! You\'ve unlocked SUDO mode. This doesn\'t do much as of now!",\n\t\t\t)\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t})\n\n\tconst executeUserInput = useCallback(() => {\n\t\tconst parsedCommand = parseCommandInput(inputText)\n\t\tif (parsedCommand.commandName !== "NOOP") {\n\t\t\tcommandHistory.addCommand(parsedCommand)\n\t\t}\n\t\tsetShellContent((prevContent) => {\n\t\t\treturn [...prevContent, `> ${inputText}`]\n\t\t})\n\t\tif (parsedCommand.commandName !== "NOOP") {\n\t\t\texecCommand(parsedCommand, shellHandle)\n\t\t}\n\t\tsetInputText("")\n\t}, [commandHistory, inputText, shellHandle])\n\n\tuseEffect(() => {\n\t\tconst textRef = inputRef.current\n\t\tif (!textRef) {\n\t\t\treturn\n\t\t}\n\n\t\tconst eventHandler = (eventData: KeyboardEvent) => {\n\t\t\tif (shellLocked) {\n\t\t\t\t// Some command is writing\n\t\t\t\treturn\n\t\t\t}\n\t\t\tif (eventData.isComposing) {\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tconst keyData = eventData.key\n\n\t\t\tonKeyPress(keyData)\n\n\t\t\tif (keyData.startsWith("Arrow")) {\n\t\t\t\tif (keyData === "ArrowLeft" || keyData === "ArrowRight") {\n\t\t\t\t\t// Do nothing\n\t\t\t\t} else if (keyData === "ArrowUp") {\n\t\t\t\t\tconst partialCommand = parseCommandInput(inputText)\n\t\t\t\t\tconst prevCommand = commandHistory.rewindCommand()\n\t\t\t\t\tsetInputText(prevCommand.rawCommand)\n\t\t\t\t} else {\n\t\t\t\t\tconst nextCommand = commandHistory.forwardCommand()\n\t\t\t\t\tsetInputText(nextCommand.rawCommand)\n\t\t\t\t}\n\t\t\t\treturn\n\t\t\t}\n\n\t\t\tif (keyData === "Enter") {\n\t\t\t\texecuteUserInput()\n\t\t\t\treturn\n\t\t\t}\n\t\t}\n\n\t\ttextRef.addEventListener("keydown", eventHandler)\n\n\t\treturn () => {\n\t\t\tif (!textRef) {\n\t\t\t\treturn\n\t\t\t}\n\t\t\ttextRef.removeEventListener("keydown", eventHandler)\n\t\t}\n\t}, [\n\t\tcommandHistory,\n\t\texecuteUserInput,\n\t\tinputText,\n\t\tonKeyPress,\n\t\tshellHandle,\n\t\tshellLocked,\n\t])\n\n\tuseEffect(() => {\n\t\tif (lastOutputRef.current && termOutputRef.current) {\n\t\t\ttermOutputRef.current.scrollTop = lastOutputRef.current.offsetTop\n\t\t}\n\t})\n\n\t// If you\'re seeing ugly scrollbars blame Chrome / Chromium / Edge or whatever fork you are running.\n\t// Works perfectly fucking fine in firefox\n\n\treturn (\n\t\t<div\n\t\t\tclassName={\n\t\t\t\t"flex flex-grow flex-col justify-between border-4 border-termwhite"\n\t\t\t}\n\t\t>\n\t\t\t<div className={"scrollbar-hidden flex flex-col overflow-y-scroll"}>\n\t\t\t\t<div\n\t\t\t\t\tclassName={\n\t\t\t\t\t\t"flex flex-row items-center justify-between gap-4 border-termwhite bg-termwhite p-2 text-xl text-termgrey"\n\t\t\t\t\t}\n\t\t\t\t>\n\t\t\t\t\t<svg\n\t\t\t\t\t\txmlns="http://www.w3.org/2000/svg"\n\t\t\t\t\t\tfill="none"\n\t\t\t\t\t\tviewBox="0 0 24 24"\n\t\t\t\t\t\tstrokeWidth={1.5}\n\t\t\t\t\t\tstroke="currentColor"\n\t\t\t\t\t\tclassName="h-6 w-6"\n\t\t\t\t\t>\n\t\t\t\t\t\t<path\n\t\t\t\t\t\t\tstrokeLinecap="round"\n\t\t\t\t\t\t\tstrokeLinejoin="round"\n\t\t\t\t\t\t\td="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"\n\t\t\t\t\t\t/>\n\t\t\t\t\t</svg>\n\t\t\t\t\t{`ArnitDOS ${shellLocked ? ":O" : ":)"}`}\n\t\t\t\t\t<button\n\t\t\t\t\t\tclassName={\n\t\t\t\t\t\t\t"text-lg hover:underline hover:decoration-termgrey"\n\t\t\t\t\t\t}\n\t\t\t\t\t\tonClick={shellHandle.clearShell}\n\t\t\t\t\t>\n\t\t\t\t\t\tClear\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t\t{/* @ts-ignore */}\n\t\t\t\t<div\n\t\t\t\t\tclassName={\n\t\t\t\t\t\t"scrollbar-hidden flex-grow-0 overflow-y-scroll p-2"\n\t\t\t\t\t}\n\t\t\t\t\t// @ts-ignore\n\t\t\t\t\tref={termOutputRef}\n\t\t\t\t>\n\t\t\t\t\t{shellContent.map((contentString, contentIdx) => {\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t// @ts-ignore\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tkey={`${contentIdx}.${contentString}`}\n\t\t\t\t\t\t\t\t{...(contentIdx === shellContent.length - 1\n\t\t\t\t\t\t\t\t\t? {\n\t\t\t\t\t\t\t\t\t\t\tref: lastOutputRef,\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t: {})}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<ShellOutput\n\t\t\t\t\t\t\t\t\ttextContent={contentString}\n\t\t\t\t\t\t\t\t\toverrideColor={shellColor}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t)\n\t\t\t\t\t})}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div\n\t\t\t\tclassName={\n\t\t\t\t\t"flex flex-row items-center justify-between border-0 border-t-4 border-termwhite"\n\t\t\t\t}\n\t\t\t>\n\t\t\t\t<div className={"flex flex-grow flex-row gap-2 p-4"}>\n\t\t\t\t\t{shellLocked ? "Locked" : "Input"}\n\t\t\t\t\t<div className={shellLocked ? "hidden" : "blink"}>\n\t\t\t\t\t\t{">"}\n\t\t\t\t\t</div>\n\t\t\t\t\t<input\n\t\t\t\t\t\tdisabled={shellLocked}\n\t\t\t\t\t\tclassName={`text-${shellColor}-400 flex-grow bg-termgrey focus:underline focus:decoration-dashed focus:outline-none`}\n\t\t\t\t\t\t/*// @ts-ignore */\n\t\t\t\t\t\tref={inputRef}\n\t\t\t\t\t\ttype={"text"}\n\t\t\t\t\t\tonChange={(ev) => {\n\t\t\t\t\t\t\tsetInputText(ev.target.value)\n\t\t\t\t\t\t}}\n\t\t\t\t\t\tvalue={inputText}\n\t\t\t\t\t/>\n\t\t\t\t\t<div className={shellLocked ? "hidden" : "blink"}>\n\t\t\t\t\t\t{"<"}\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div className={"border-l-4 border-l-termwhite p-4"}>\n\t\t\t\t\t<button onClick={executeUserInput} disabled={shellLocked}>\n\t\t\t\t\t\t{/* Thank you JBMono Ligatures!*/}\n\t\t\t\t\t\t{shellLocked ? "Waiting -_-" : "Execute ->"}\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t)\n}',
					},
					elementId: "168",
				},
			],
			[
				{
					identity: { low: 169, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "ShellWindowProps",
						symbolPath: "src/components/ShellWindow.tsx",
						symbolSourceCode:
							"\n\nexport type ShellWindowProps = {}",
					},
					elementId: "169",
				},
			],
			[
				{
					identity: { low: 170, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "default",
						symbolPath: "src/pages/_app.tsx",
						symbolSourceCode:
							"\n\nexport default function App({ Component, pageProps }: AppProps) {\n\treturn <Component {...pageProps} />\n}",
					},
					elementId: "170",
				},
			],
			[
				{
					identity: { low: 171, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "default",
						symbolPath: "src/pages/_document.tsx",
						symbolSourceCode:
							'\n\nexport default function Document() {\n\treturn (\n\t\t<Html lang="en">\n\t\t\t<Head />\n\t\t\t<body>\n\t\t\t\t<Main />\n\t\t\t\t<NextScript />\n\t\t\t</body>\n\t\t</Html>\n\t)\n}',
					},
					elementId: "171",
				},
			],
			[
				{
					identity: { low: 172, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "default",
						symbolPath: "src/pages/index.tsx",
						symbolSourceCode:
							'\n\nexport default function IndexPage() {\n\treturn (\n\t\t<>\n\t\t\t<Head>\n\t\t\t\t<title>{`ArnitDOS ${getVersionString()}`}</title>\n\t\t\t\t<meta\n\t\t\t\t\tname={"description"}\n\t\t\t\t\tcontent={\n\t\t\t\t\t\t"Welcome to arnitdo\'s portfolio page! This has been designed like an intuitive terminal interface. Give it a try!"\n\t\t\t\t\t}\n\t\t\t\t/>\n\t\t\t</Head>\n\t\t\t<div\n\t\t\t\tclassName={\n\t\t\t\t\t"flex h-screen w-screen bg-termgrey font-mono text-termwhite"\n\t\t\t\t}\n\t\t\t>\n\t\t\t\t<ShellWindow />\n\t\t\t</div>\n\t\t</>\n\t)\n}',
					},
					elementId: "172",
				},
			],
			[
				{
					identity: { low: 173, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "parseCommandInput",
						symbolPath: "src/utils/commandREPL.ts",
						symbolSourceCode:
							'\n\n/**\n * @summary Generates a Command structure from a given input string\n * **/\nexport function parseCommandInput(commandString: string): Command {\n\tlet inputString = commandString.trim()\n\tinputString = inputString.toLowerCase()\n\n\tif (inputString.length === 0) {\n\t\t// Empty command\n\t\treturn {\n\t\t\tcommandName: "NOOP",\n\t\t\trawCommand: "",\n\t\t\tcommandArgs: [],\n\t\t\tcommandOptions: [],\n\t\t}\n\t}\n\n\tconst stringTokens = inputString.split(COMMAND_SPLIT_REGEXP)\n\tconst cleanTokens = stringTokens.filter((stringToken) => {\n\t\treturn (\n\t\t\tstringToken.length > 0 || // Empty string\n\t\t\tstringToken == "-" ||\n\t\t\tstringToken == "--" // Only long/short opt flag passed, we need more data after -\n\t\t)\n\t})\n\tconst firstKeyword = cleanTokens[0]\n\n\tconst inputArgs = cleanTokens.slice(1)\n\n\tconst argList = inputArgs.filter((argString) => {\n\t\treturn !argString.startsWith("-")\n\t})\n\n\tconst rawOptList = inputArgs.filter((optString) => {\n\t\treturn optString.startsWith("-")\n\t})\n\n\tconst mappedOptList = rawOptList.map((optString): CommandOption => {\n\t\tif (optString.startsWith("--")) {\n\t\t\tconst trimmedOptString = optString.slice(2)\n\t\t\treturn {\n\t\t\t\toptType: CommandOptionType.LONG_OPT,\n\t\t\t\toptionValue: trimmedOptString,\n\t\t\t}\n\t\t} else {\n\t\t\tconst trimmedOptString = optString.slice(1)\n\t\t\treturn {\n\t\t\t\toptType: CommandOptionType.SHORT_OPT,\n\t\t\t\toptionValue: trimmedOptString[0],\n\t\t\t}\n\t\t}\n\t})\n\n\treturn {\n\t\tcommandName: firstKeyword.toUpperCase(),\n\t\trawCommand: commandString.trim(),\n\t\tcommandArgs: argList,\n\t\tcommandOptions: mappedOptList,\n\t}\n}',
					},
					elementId: "173",
				},
			],
			[
				{
					identity: { low: 174, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "execCommand",
						symbolPath: "src/utils/commandREPL.ts",
						symbolSourceCode:
							"\n\nexport function execCommand(targetCommand: Command, shellHandle: ShellHandle) {\n\tconst isValidCommand = isValidExecCommand(targetCommand.commandName)\n\tif (!isValidCommand) {\n\t\tshellHandle.lockHandle()\n\t\tshellHandle.writeLine(\n\t\t\t`${targetCommand.rawCommand}: Not a valid command!`,\n\t\t)\n\t\tshellHandle.unlockHandle()\n\t} else {\n\t\tconst matchingCommand = EXECUTABLE_COMMANDS.find((execCommand) => {\n\t\t\treturn execCommand.commandExecutable === targetCommand.commandName\n\t\t})\n\t\tif (matchingCommand === undefined) {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(`${targetCommand.rawCommand}: Error!`)\n\t\t\tshellHandle.unlockHandle()\n\t\t} else {\n\t\t\tmatchingCommand.executeCommand(\n\t\t\t\ttargetCommand.commandArgs,\n\t\t\t\ttargetCommand.commandOptions,\n\t\t\t\tshellHandle,\n\t\t\t)\n\t\t}\n\t}\n}",
					},
					elementId: "174",
				},
			],
			[
				{
					identity: { low: 175, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "isValidExecCommand",
						symbolPath: "src/utils/commands.ts",
						symbolSourceCode:
							"\n\nexport function isValidExecCommand(commandName: string) {\n\treturn VALID_COMMAND_NAMES.includes(commandName)\n}",
					},
					elementId: "175",
				},
			],
			[
				{
					identity: { low: 176, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "EXECUTABLE_COMMANDS",
						symbolPath: "src/utils/commands.ts",
						symbolSourceCode:
							' EXECUTABLE_COMMANDS: ExecutableCommand[] = [\n\t{\n\t\tcommandExecutable: "NOOP",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tvoid 0\n\t\t\t// Do nothing, this is a noop command!\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "CLEAR",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.clearShell()\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "HELLO",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Hey there! Welcome to ArnitDOS, I\'m an interactive shell, here to guide you through Arnav\'s Portfolio!\\nType `help` to list all available commands.",\n\t\t\t)\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "HELP",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tconst verString = getVersionString()\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Need help? Got you covered - try running one of the following commands, or `help <name>` for more information",\n\t\t\t\t)\n\t\t\t\tVALID_COMMAND_NAMES.forEach((commandKey, commandIdx) => {\n\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t`${commandIdx + 1}) ${commandKey.toLowerCase()}`,\n\t\t\t\t\t)\n\t\t\t\t})\n\t\t\t} else {\n\t\t\t\tfor (let commandArg of commandArgs) {\n\t\t\t\t\tcommandArg = commandArg.toUpperCase()\n\t\t\t\t\tif (VALID_COMMAND_NAMES.includes(commandArg)) {\n\t\t\t\t\t\tconst helpText = HELP_STRING_MAP[commandArg]\n\t\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t\t`${commandArg.toLowerCase()}: ${helpText}`,\n\t\t\t\t\t\t)\n\t\t\t\t\t} else {\n\t\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t\t"Sorry, can\'t really help with that :(",\n\t\t\t\t\t\t)\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "LIST",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Tell me something to list! Like `list projects|academics|experience|hobbies`",\n\t\t\t\t)\n\t\t\t} else if (commandArgs.length === 1) {\n\t\t\t\tconst firstArg = commandArgs[0]\n\t\t\t\tconst uppercaseArg = firstArg.toUpperCase()\n\t\t\t\tif (Object.keys(LIST_DATA).includes(uppercaseArg)) {\n\t\t\t\t\tconst listPoints = LIST_DATA[uppercaseArg]\n\t\t\t\t\tfor (const listPoint of listPoints) {\n\t\t\t\t\t\tshellHandle.writeLine(listPoint)\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t"I can\'t list that, try something relevant!",\n\t\t\t\t\t)\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Too many things to list! Try one at a time!",\n\t\t\t\t)\n\t\t\t}\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "CONTACT",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Shoot me a mail at the address below, and I\'ll get in touch with you",\n\t\t\t)\n\t\t\tshellHandle.writeLine("mailto:hello@arnitdo.dev")\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "RESUME",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine("View my resume at the link below!")\n\t\t\tshellHandle.writeLine("")\n\t\t\tshellHandle.writeLine(RESUME_LINK)\n\t\t\tshellHandle.writeLine("")\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "PROJECT",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"Give me a project id, I\'ll tell you more! Use the `list` command",\n\t\t\t\t)\n\t\t\t} else if (commandArgs.length === 1) {\n\t\t\t\tconst projectId = commandArgs[0].toUpperCase()\n\t\t\t\tif (Object.keys(PROJECT_DATA).includes(projectId)) {\n\t\t\t\t\tconst projectData = PROJECT_DATA[projectId]\n\t\t\t\t\tconst {\n\t\t\t\t\t\tprojectTitle,\n\t\t\t\t\t\tprojectDescription,\n\t\t\t\t\t\tgithubLink,\n\t\t\t\t\t\tprojectDuration,\n\t\t\t\t\t\tprojectNote,\n\t\t\t\t\t} = projectData\n\t\t\t\t\tshellHandle.writeLine(`Title: ${projectTitle}`)\n\t\t\t\t\tshellHandle.writeLine(`Description: ${projectDescription}`)\n\t\t\t\t\tshellHandle.writeLine("GitHub Link")\n\t\t\t\t\tshellHandle.writeLine(githubLink)\n\t\t\t\t\tif (projectDuration) {\n\t\t\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t\t\t`Developed from: ${projectDuration}`,\n\t\t\t\t\t\t)\n\t\t\t\t\t} else {\n\t\t\t\t\t\tshellHandle.writeLine(`Still under development`)\n\t\t\t\t\t}\n\t\t\t\t\tif (projectNote) {\n\t\t\t\t\t\tshellHandle.writeLine(`Note: ${projectNote}`)\n\t\t\t\t\t}\n\t\t\t\t} else {\n\t\t\t\t\tshellHandle.writeLine("That\'s not a valid project ID!")\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"That\'s way too many projects! Try one at a time.",\n\t\t\t\t)\n\t\t\t}\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "SOCIAL",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tshellHandle.writeLine(\n\t\t\t\t"Reach out to me on any of the below links, and I\'ll get in touch!",\n\t\t\t)\n\t\t\tshellHandle.writeLine("GitHub @arnitdo")\n\t\t\tshellHandle.writeLine("https://github.com/arnitdo")\n\t\t\tshellHandle.writeLine("Instagram: @arnitdo")\n\t\t\tshellHandle.writeLine("https://instagram.com/arnitdo")\n\t\t\tshellHandle.writeLine("LinkedIn: @arnitdo")\n\t\t\tshellHandle.writeLine("https://linkedin.com/in/arnitdo")\n\t\t\tshellHandle.unlockHandle()\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "COLOR",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.setShellColor("termwhite")\n\t\t\t} else {\n\t\t\t\tconst colorArg = commandArgs[0]\n\t\t\t\tshellHandle.setShellColor(colorArg)\n\t\t\t}\n\t\t},\n\t},\n\t{\n\t\tcommandExecutable: "SLEEP",\n\t\texecuteCommand: (commandArgs, commandOpts, shellHandle) => {\n\t\t\tshellHandle.lockHandle()\n\t\t\tif (commandArgs.length === 0) {\n\t\t\t\tshellHandle.writeLine(\n\t\t\t\t\t"I can\'t just go to sleep forever, you know?",\n\t\t\t\t)\n\t\t\t\tshellHandle.unlockHandle()\n\t\t\t} else {\n\t\t\t\tconst firstArg = commandArgs[0]\n\t\t\t\tconst numericArg = Number.parseInt(firstArg)\n\t\t\t\tif (Number.isNaN(numericArg) || numericArg < 1) {\n\t\t\t\t\tshellHandle.writeLine("That\'s not a valid input!")\n\t\t\t\t\tshellHandle.unlockHandle()\n\t\t\t\t} else {\n\t\t\t\t\tsetTimeout(\n\t\t\t\t\t\tshellHandle.unlockHandle,\n\t\t\t\t\t\tnumericArg * 1000, // ms\n\t\t\t\t\t)\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t},\n]',
					},
					elementId: "176",
				},
			],
			[
				{
					identity: { low: 177, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "getVersionString",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							"export function getVersionString(): string {\n\tconst nowDate = new Date()\n\tconst nowYear = nowDate.getFullYear()\n\tconst nowMonth = nowDate.getMonth() + 1\n\tconst nowDayDate = nowDate.getDate()\n\n\treturn `v${nowYear}.${nowMonth}.${nowDayDate}`\n}",
					},
					elementId: "177",
				},
			],
			[
				{
					identity: { low: 178, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "generateInitString",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							'\n\nexport function generateInitString(): string {\n\treturn (\n\t\t"ArnitDOS" + getVersionString() + ". Type `help` for more information."\n\t)\n}',
					},
					elementId: "178",
				},
			],
			[
				{
					identity: { low: 179, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "isURL",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							'\n\nexport function isURL(urlLikeString: string) {\n\ttry {\n\t\tconst actualURL = new URL(urlLikeString)\n\t\treturn (\n\t\t\tactualURL.protocol.startsWith("http") ||\n\t\t\tactualURL.protocol.startsWith("mailto")\n\t\t)\n\t} catch {\n\t\treturn false\n\t}\n}',
					},
					elementId: "179",
				},
			],
			[
				{
					identity: { low: 180, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "RESUME_LINK",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							' RESUME_LINK =\n\t"https://drive.google.com/file/d/1LjvdoobpPFOk9vGUV5reF9N_pN5UfO5i/view" as const',
					},
					elementId: "180",
				},
			],
			[
				{
					identity: { low: 181, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "LIST_DATA",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							' LIST_DATA = {\n\tEXPERIENCE: [\n\t\t"I have worked as a Backend Developer Intern at Engaze.in from June 2024 to August 2024",\n\t\t"I\'ve also worked as a Freelance Web Developer for Pixels and Grids, developing websites and web applications",\n\t\t"I\'ve worked as a MERN Stack Developer Intern at CTO-Ninja from June 2023 to October 2023",\n\t\t"I was also a part of GDSC DJSCE\'s Web Development Co-Committee for the academic year 2023-2024",\n\t\t"I\'m currently at the forefront of GDG DJSCE, as the Co-Lead for the academic year 2024-2025",\n\t],\n\tPROJECTS: [\n\t\t"I\'ve worked on various projects in Typescript, Javascript, Postgres, Python, C++ and the MERN/PERN Stack. Here are some of my personal favorites.",\n\t\t"To learn more about each project, use the `project <name>` command, and use one of the names in the [square brackets] below",\n\t\t"[mimicai] A customisable AI mimc for having custom conversations",\n\t\t"[thinq] ThinQ a full stack online education platform using NextJS and PostgreSQL",\n\t\t"[blitzai] BlitzAI is a cutting-edge SaaS platform designed to empower content creators by integrating AI seamlessly into their video creation workflows",\n\t\t"[nutrino] Nutrino is a web application designed to help individuals with allergies and dietary restrictions navigate the world of food effortlessly",\n\t\t"[versura] Versura is a revolutionary blockchain based crowdfunding platform, developed as an academic project at SVKM\'s SBMP",\n\t\t"[axess] Axess is a prize-winning QR-Code based access control system integrating fine-tuned permissions and user management",\n\t\t"[gpiostudio] GPIOStudio is a GUI for developing Python scripts for the Raspberry Pi GPIO, built using Qt5 and C++11",\n\t\t"[drone] I\'ve worked on developing software for integrating voice control with PixHawk drones using Raspberry Pis",\n\t],\n\tHOBBIES: [\n\t\t"I love astronomy, stargazing, working out, and last but not the least, tinkering! You\'ll always find a spare screwdriver or patch cord in my bag ;)",\n\t],\n\tACADEMICS: [\n\t\t"Here are some of my academic achievements -",\n\t\t"I\'m currently pursuing a B.Tech Degree in Computer Engineering at SVKM\'s DJSCE",\n\t\t"I hold a Diploma in Computer Engineering from SVKM\'s Shri Bhagubhai Mafatlal Polytechnic",\n\t\t"I\'ve participated in various technical competitions and hackathons, mosty notably winning the 2nd Prize at KJSCE Devopia Hackathon",\n\t\t"I have also had the honor of being part of the organising committee as the Technical Head for PolyHacks 1.0 Hackathon at SVKM\'s SBMP",\n\t],\n} as Record<string, string[]>',
					},
					elementId: "181",
				},
			],
			[
				{
					identity: { low: 182, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "PROJECT_DATA",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							' PROJECT_DATA: Record<string, ProjectInfo> = {\n\tMIMICAI: {\n\t\tprojectTitle: "MimicAI - A customisable AI mimic for conversations",\n\t\tprojectDescription:\n\t\t\t"MimicAI is a customisable AI mimic for users to have conversations with. " +\n\t\t\t"It allows users to fork conversations from a message, trying out different messages and responses",\n\t\tgithubLink: "https://mimicai.arnitdo.dev",\n\t\tprojectDuration: "12/2024 - 12/2024",\n\t\tprojectNote: "Developed in under 24 hours",\n\t},\n\tTHINQ: {\n\t\tprojectTitle: "ThinQ - A virtual classroom enhancement platform",\n\t\tprojectDescription:\n\t\t\t"ThinQ is a comprehensive solution for virtual classrooms, providing a wide range of features to enhance the online learning experience." +\n\t\t\t"It features calendar integrations, video calling, attention detection among a wide variety of features designed to improve online classroom teaching",\n\t\tprojectNote: "This project was developed at PICT TechFiesta 2024",\n\t\tgithubLink: "https://github.com/arnitdo/ThinQ",\n\t\tprojectDuration: "02/2024 - 04/2023",\n\t},\n\tBLITZAI: {\n\t\tprojectTitle: "BlitzAI: Next-Gen AI Video Creation SaaS",\n\t\tprojectDescription:\n\t\t\t"BlitzAI is a cutting-edge SaaS platform designed to empower content creators by integrating AI seamlessly into their video creation workflows." +\n\t\t\t"With a user-friendly UI and a modular approach, BlitzAI allows users to pick and choose AI-driven features at any step of the content creation process.",\n\t\tprojectNote: "This project was developed at Datathon 3.0 at KJSCE",\n\t\tgithubLink: "https://github.com/arnitdo/Blitz.AI-Datathon-3",\n\t\tprojectDuration: "02/2024",\n\t},\n\tNUTRINO: {\n\t\tprojectTitle: "Nutrino: Your Own Food Assistant",\n\t\tprojectDescription:\n\t\t\t"Nutrino is a web application designed to help individuals with allergies and dietary restrictions navigate the world of food effortlessly. " +\n\t\t\t"By utilizing advanced machine learning models, Nutrino provides users with powerful tools to detect ingredients, " +\n\t\t\t"suggest alternatives, and offer a delightful cooking experience.",\n\t\tprojectNote: "This project was developed at TSEC Hack24",\n\t\tgithubLink: "https://github.com/arnitdo/Nutrino",\n\t\tprojectDuration: "01/2024 - 02/2024",\n\t},\n\tVERSURA: {\n\t\tprojectTitle:\n\t\t\t"Versura - A revolutionary blockchain based crowdfunding platform",\n\t\tprojectDescription:\n\t\t\t"Versura is a web+blockchain based crowdfunding platform developed as part of " +\n\t\t\t"academic curriculum. Integrated AWS RDS for database provisioning and storage. " +\n\t\t\t"Implemented project front-end using NextJS and Elastic UI. Blockchain" +\n\t\t\t"functionality implemented using Metamask and Web3.js",\n\t\tprojectNote:\n\t\t\t"This project was developed as part of an academic project requirement for completing my Diploma in Computer Engineering",\n\t\tgithubLink: "https://github.com/arnitdo/versura",\n\t\tprojectDuration: "02/2023 - 06/2023",\n\t},\n\tAXESS: {\n\t\tprojectTitle: "Axess - A innovative access control system",\n\t\tprojectDescription:\n\t\t\t"Axess is an innovative QR-Code based access control management system developed at VESP\'s " +\n\t\t\t"Technothon 2023. It integrates a fine-tuned permission system with a scalable QR-based location and entry/exit " +\n\t\t\t"point-of-transit systems. Such functionality was achieved using NextUI, Google Cloud Firebase Firestore, and NextJS",\n\t\tgithubLink: "https://github.com/arnitdo/Axess",\n\t\tprojectNote:\n\t\t\t"This project won the Third Prize at VESP\'s Technothon 2023",\n\t\tprojectDuration: "04/2023",\n\t},\n\tGPIOSTUDIO: {\n\t\tprojectTitle: "GPIO Studio",\n\t\tprojectDescription:\n\t\t\t"Created a GPIO-Interfacing script generator GUI for Raspberry Pis and other IoT " +\n\t\t\t"devices. Developed and utilized skills acquired in C++11 and Qt5 GUI Framework. " +\n\t\t\t"Integrated various open source third-party libraries to provide data parsing and " +\n\t\t\t"storage.",\n\t\tgithubLink: "https://github.com/arnitdo/GPIOStudio",\n\t\tprojectDuration: "08/2021 - 01/2022",\n\t},\n\tDRONE: {\n\t\tprojectTitle: "Voice Controlled Drone",\n\t\tprojectDescription:\n\t\t\t"Developed a Voice Controlled Drone, implementing various protocols to enable " +\n\t\t\t"communication between a PixHawk Flight Controller and Raspberry Pi SBC. Uses " +\n\t\t\t"Google Cloud-based speech to text processing to analyze voice commands",\n\t\tprojectDuration: "01/2023 - 06/2023",\n\t\tgithubLink: "https://github.com/arnitdo/Voice-Controlled-Drone",\n\t\tprojectNote:\n\t\t\t"This was a collaborative effort as part of an academic project",\n\t},\n} as const',
					},
					elementId: "182",
				},
			],
			[
				{
					identity: { low: 183, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "KONAMI_CODE",
						symbolPath: "src/utils/common.ts",
						symbolSourceCode:
							' KONAMI_CODE = [\n\t"ArrowUp",\n\t"ArrowUp",\n\t"ArrowDown",\n\t"ArrowDown",\n\t"ArrowLeft",\n\t"ArrowRight",\n\t"ArrowLeft",\n\t"ArrowRight",\n\t"b",\n\t"a",\n]',
					},
					elementId: "183",
				},
			],
			[
				{
					identity: { low: 184, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "COMMAND_SPLIT_REGEXP",
						symbolPath: "src/utils/globals.ts",
						symbolSourceCode: " COMMAND_SPLIT_REGEXP = /\\s|\\./gi",
					},
					elementId: "184",
				},
			],
			[
				{
					identity: { low: 185, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "EXIT_TIMEOUT",
						symbolPath: "src/utils/globals.ts",
						symbolSourceCode: " EXIT_TIMEOUT = 5",
					},
					elementId: "185",
				},
			],
			[
				{
					identity: { low: 186, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "CommandOptionType",
						symbolPath: "src/utils/typedef.ts",
						symbolSourceCode:
							"export enum CommandOptionType {\n\tSHORT_OPT,\n\tLONG_OPT,\n}",
					},
					elementId: "186",
				},
			],
			[
				{
					identity: { low: 187, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "CommandOption",
						symbolPath: "src/utils/typedef.ts",
						symbolSourceCode:
							"\n\nexport type CommandOption = {\n\toptType: CommandOptionType\n\toptionValue: string\n}",
					},
					elementId: "187",
				},
			],
			[
				{
					identity: { low: 188, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "Command",
						symbolPath: "src/utils/typedef.ts",
						symbolSourceCode:
							"\n\nexport type Command = {\n\tcommandName: string\n\trawCommand: string\n\tcommandArgs: string[]\n\tcommandOptions: CommandOption[]\n}",
					},
					elementId: "188",
				},
			],
			[
				{
					identity: { low: 189, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "ShellHandle",
						symbolPath: "src/utils/typedef.ts",
						symbolSourceCode:
							"\n\nexport type ShellHandle = {\n\tlockHandle: () => void\n\tunlockHandle: () => void\n\twriteLine: (outString: string) => void\n\tclearShell: () => void\n\tsetShellColor: (colorName: string) => void\n}",
					},
					elementId: "189",
				},
			],
			[
				{
					identity: { low: 190, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "ExecutableCommand",
						symbolPath: "src/utils/typedef.ts",
						symbolSourceCode:
							"\n\nexport type ExecutableCommand = {\n\tcommandExecutable: string\n\texecuteCommand: (\n\t\tcommandArgs: string[],\n\t\tcommandOpts: CommandOption[],\n\t\tshellHandle: ShellHandle,\n\t) => void\n}",
					},
					elementId: "190",
				},
			],
			[
				{
					identity: { low: 191, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "useCommandHistory",
						symbolPath: "src/utils/hooks/useCommandHistory.ts",
						symbolSourceCode:
							'\n\nexport function useCommandHistory(\n\topts: UseCommandHistoryOptions = {},\n): CommandHistory {\n\tconst [historyStack, setHistoryStack] = useState<Command[]>([])\n\tconst [historyIdx, setHistoryIdx] = useState<number>(-1)\n\n\tconst addCommand = useCallback(\n\t\t(commandStr: Command) => {\n\t\t\tsetHistoryStack((prevStack) => {\n\t\t\t\t// Bring index forward to current index again\n\t\t\t\tsetHistoryIdx(prevStack.length)\n\t\t\t\treturn [...prevStack, commandStr]\n\t\t\t})\n\t\t},\n\t\t[setHistoryStack],\n\t)\n\n\tconst clearHistory = useCallback(() => {\n\t\tsetHistoryStack([])\n\t\tsetHistoryIdx(-1)\n\t}, [])\n\n\tconst forwardCommand = useCallback((): Command => {\n\t\tconst currIdx = historyIdx\n\t\tif (currIdx >= historyStack.length - 1) {\n\t\t\treturn {\n\t\t\t\tcommandName: "",\n\t\t\t\trawCommand: "",\n\t\t\t\tcommandArgs: [],\n\t\t\t\tcommandOptions: [],\n\t\t\t}\n\t\t} else {\n\t\t\tsetHistoryIdx((prevIdx) => {\n\t\t\t\treturn prevIdx + 1\n\t\t\t})\n\t\t\treturn historyStack[currIdx + 1]\n\t\t}\n\t}, [historyStack, historyIdx, setHistoryIdx])\n\n\tconst rewindCommand = useCallback((): Command => {\n\t\tconst currIdx = historyIdx\n\t\tif (currIdx === -1) {\n\t\t\treturn {\n\t\t\t\tcommandName: "",\n\t\t\t\trawCommand: "",\n\t\t\t\tcommandArgs: [],\n\t\t\t\tcommandOptions: [],\n\t\t\t}\n\t\t} else if (currIdx === 0) {\n\t\t\treturn historyStack[0]\n\t\t} else {\n\t\t\tsetHistoryIdx((prevIdx) => {\n\t\t\t\treturn prevIdx - 1\n\t\t\t})\n\t\t\treturn historyStack[currIdx]\n\t\t}\n\t}, [historyStack, historyIdx, setHistoryIdx])\n\n\treturn {\n\t\thistoryStack: historyStack,\n\t\tcurrIndex: historyIdx,\n\t\taddCommand: addCommand,\n\t\tforwardCommand: forwardCommand,\n\t\trewindCommand: rewindCommand,\n\t\tclearHistory: clearHistory,\n\t}\n}',
					},
					elementId: "191",
				},
			],
			[
				{
					identity: { low: 192, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "useSecretCode",
						symbolPath: "src/utils/hooks/useSecretCode.ts",
						symbolSourceCode:
							"\n\nexport function useSecretCode(args: UseSecretCodeArgs): SecretCodeRet {\n\tconst { onUnlock, codeSequence } = args\n\tconst [keyQueue, setKeyQueue] = useState<string[]>([])\n\n\tconst onKeyPress = useCallback(\n\t\t(keyCode: string) => {\n\t\t\tlet mergedQueue: string[] = []\n\t\t\tif (keyQueue.length >= codeSequence.length) {\n\t\t\t\tconst copyQueue = [...keyQueue]\n\t\t\t\tconst slicedQueue = copyQueue.slice(1, 12)\n\t\t\t\tmergedQueue = [...slicedQueue, keyCode]\n\t\t\t} else {\n\t\t\t\tmergedQueue = [...keyQueue, keyCode]\n\t\t\t}\n\t\t\tif (mergedQueue.length === codeSequence.length) {\n\t\t\t\tlet matchFlag = true\n\t\t\t\tfor (let idx = 0; idx < codeSequence.length; idx++) {\n\t\t\t\t\tif (mergedQueue[idx] !== codeSequence[idx]) {\n\t\t\t\t\t\tmatchFlag = false\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif (matchFlag) {\n\t\t\t\t\tonUnlock()\n\t\t\t\t}\n\t\t\t} else {\n\t\t\t\t// Do nothing, code cannot be input\n\t\t\t}\n\t\t\tsetKeyQueue(mergedQueue)\n\t\t},\n\t\t[codeSequence, keyQueue, onUnlock],\n\t)\n\n\treturn {\n\t\tonKeyPress: onKeyPress,\n\t}\n}",
					},
					elementId: "192",
				},
			],
			[
				{
					identity: { low: 193, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "UseSecretCodeArgs",
						symbolPath: "src/utils/hooks/useSecretCode.ts",
						symbolSourceCode:
							"\n\nexport type UseSecretCodeArgs = {\n\tonUnlock: () => void\n\tcodeSequence: string[]\n}",
					},
					elementId: "193",
				},
			],
			[
				{
					identity: { low: 194, high: 0 },
					labels: ["Symbol"],
					properties: {
						symbolIdentifier: "SecretCodeRet",
						symbolPath: "src/utils/hooks/useSecretCode.ts",
						symbolSourceCode:
							"\n\nexport type SecretCodeRet = {\n\tonKeyPress: (keyCode: string) => void\n}",
					},
					elementId: "194",
				},
			],
		],
		externalModuleNodes: [
			[
				{
					identity: { low: 147, high: 0 },
					labels: ["ExternalModule"],
					properties: { modulePath: "tailwindcss" },
					elementId: "147",
				},
			],
			[
				{
					identity: { low: 150, high: 0 },
					labels: ["ExternalModule"],
					properties: { modulePath: "react" },
					elementId: "150",
				},
			],
			[
				{
					identity: { low: 152, high: 0 },
					labels: ["ExternalModule"],
					properties: { modulePath: "@/styles/globals.css" },
					elementId: "152",
				},
			],
			[
				{
					identity: { low: 153, high: 0 },
					labels: ["ExternalModule"],
					properties: { modulePath: "next/app" },
					elementId: "153",
				},
			],
			[
				{
					identity: { low: 155, high: 0 },
					labels: ["ExternalModule"],
					properties: { modulePath: "next/document" },
					elementId: "155",
				},
			],
			[
				{
					identity: { low: 157, high: 0 },
					labels: ["ExternalModule"],
					properties: { modulePath: "next/head" },
					elementId: "157",
				},
			],
		],
		externalSymbolNodes: [],
		nodeLinks: [
			[
				{
					identity: { low: 427, high: 0 },
					start: { low: 146, high: 0 },
					end: { low: 165, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "427",
					startNodeElementId: "146",
					endNodeElementId: "165",
				},
			],
			[
				{
					identity: { low: 428, high: 0 },
					start: { low: 148, high: 0 },
					end: { low: 166, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "428",
					startNodeElementId: "148",
					endNodeElementId: "166",
				},
			],
			[
				{
					identity: { low: 429, high: 0 },
					start: { low: 148, high: 0 },
					end: { low: 167, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "429",
					startNodeElementId: "148",
					endNodeElementId: "167",
				},
			],
			[
				{
					identity: { low: 430, high: 0 },
					start: { low: 149, high: 0 },
					end: { low: 168, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "430",
					startNodeElementId: "149",
					endNodeElementId: "168",
				},
			],
			[
				{
					identity: { low: 431, high: 0 },
					start: { low: 149, high: 0 },
					end: { low: 169, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "431",
					startNodeElementId: "149",
					endNodeElementId: "169",
				},
			],
			[
				{
					identity: { low: 432, high: 0 },
					start: { low: 151, high: 0 },
					end: { low: 170, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "432",
					startNodeElementId: "151",
					endNodeElementId: "170",
				},
			],
			[
				{
					identity: { low: 433, high: 0 },
					start: { low: 154, high: 0 },
					end: { low: 171, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "433",
					startNodeElementId: "154",
					endNodeElementId: "171",
				},
			],
			[
				{
					identity: { low: 434, high: 0 },
					start: { low: 156, high: 0 },
					end: { low: 172, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "434",
					startNodeElementId: "156",
					endNodeElementId: "172",
				},
			],
			[
				{
					identity: { low: 457, high: 0 },
					start: { low: 156, high: 0 },
					end: { low: 157, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "457",
					startNodeElementId: "156",
					endNodeElementId: "157",
				},
			],
			[
				{
					identity: { low: 435, high: 0 },
					start: { low: 158, high: 0 },
					end: { low: 173, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "435",
					startNodeElementId: "158",
					endNodeElementId: "173",
				},
			],
			[
				{
					identity: { low: 436, high: 0 },
					start: { low: 158, high: 0 },
					end: { low: 174, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "436",
					startNodeElementId: "158",
					endNodeElementId: "174",
				},
			],
			[
				{
					identity: { low: 437, high: 0 },
					start: { low: 159, high: 0 },
					end: { low: 175, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "437",
					startNodeElementId: "159",
					endNodeElementId: "175",
				},
			],
			[
				{
					identity: { low: 438, high: 0 },
					start: { low: 159, high: 0 },
					end: { low: 176, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "438",
					startNodeElementId: "159",
					endNodeElementId: "176",
				},
			],
			[
				{
					identity: { low: 439, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 177, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "439",
					startNodeElementId: "160",
					endNodeElementId: "177",
				},
			],
			[
				{
					identity: { low: 440, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 178, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "440",
					startNodeElementId: "160",
					endNodeElementId: "178",
				},
			],
			[
				{
					identity: { low: 441, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 179, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "441",
					startNodeElementId: "160",
					endNodeElementId: "179",
				},
			],
			[
				{
					identity: { low: 442, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 180, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "442",
					startNodeElementId: "160",
					endNodeElementId: "180",
				},
			],
			[
				{
					identity: { low: 443, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 181, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "443",
					startNodeElementId: "160",
					endNodeElementId: "181",
				},
			],
			[
				{
					identity: { low: 444, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 182, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "444",
					startNodeElementId: "160",
					endNodeElementId: "182",
				},
			],
			[
				{
					identity: { low: 445, high: 0 },
					start: { low: 160, high: 0 },
					end: { low: 183, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "445",
					startNodeElementId: "160",
					endNodeElementId: "183",
				},
			],
			[
				{
					identity: { low: 446, high: 0 },
					start: { low: 161, high: 0 },
					end: { low: 184, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "446",
					startNodeElementId: "161",
					endNodeElementId: "184",
				},
			],
			[
				{
					identity: { low: 447, high: 0 },
					start: { low: 161, high: 0 },
					end: { low: 185, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "447",
					startNodeElementId: "161",
					endNodeElementId: "185",
				},
			],
			[
				{
					identity: { low: 448, high: 0 },
					start: { low: 162, high: 0 },
					end: { low: 186, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "448",
					startNodeElementId: "162",
					endNodeElementId: "186",
				},
			],
			[
				{
					identity: { low: 449, high: 0 },
					start: { low: 162, high: 0 },
					end: { low: 187, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "449",
					startNodeElementId: "162",
					endNodeElementId: "187",
				},
			],
			[
				{
					identity: { low: 450, high: 0 },
					start: { low: 162, high: 0 },
					end: { low: 188, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "450",
					startNodeElementId: "162",
					endNodeElementId: "188",
				},
			],
			[
				{
					identity: { low: 451, high: 0 },
					start: { low: 162, high: 0 },
					end: { low: 189, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "451",
					startNodeElementId: "162",
					endNodeElementId: "189",
				},
			],
			[
				{
					identity: { low: 452, high: 0 },
					start: { low: 162, high: 0 },
					end: { low: 190, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "452",
					startNodeElementId: "162",
					endNodeElementId: "190",
				},
			],
			[
				{
					identity: { low: 453, high: 0 },
					start: { low: 163, high: 0 },
					end: { low: 191, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "453",
					startNodeElementId: "163",
					endNodeElementId: "191",
				},
			],
			[
				{
					identity: { low: 454, high: 0 },
					start: { low: 164, high: 0 },
					end: { low: 192, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "454",
					startNodeElementId: "164",
					endNodeElementId: "192",
				},
			],
			[
				{
					identity: { low: 455, high: 0 },
					start: { low: 164, high: 0 },
					end: { low: 193, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "455",
					startNodeElementId: "164",
					endNodeElementId: "193",
				},
			],
			[
				{
					identity: { low: 456, high: 0 },
					start: { low: 164, high: 0 },
					end: { low: 194, high: 0 },
					type: "EXPORTS",
					properties: {},
					elementId: "456",
					startNodeElementId: "164",
					endNodeElementId: "194",
				},
			],
			[
				{
					identity: { low: 458, high: 0 },
					start: { low: 165, high: 0 },
					end: { low: 146, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "458",
					startNodeElementId: "165",
					endNodeElementId: "146",
				},
			],
			[
				{
					identity: { low: 460, high: 0 },
					start: { low: 166, high: 0 },
					end: { low: 148, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "460",
					startNodeElementId: "166",
					endNodeElementId: "148",
				},
			],
			[
				{
					identity: { low: 462, high: 0 },
					start: { low: 166, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "462",
					startNodeElementId: "166",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 461, high: 0 },
					start: { low: 167, high: 0 },
					end: { low: 148, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "461",
					startNodeElementId: "167",
					endNodeElementId: "148",
				},
			],
			[
				{
					identity: { low: 470, high: 0 },
					start: { low: 168, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "470",
					startNodeElementId: "168",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 474, high: 0 },
					start: { low: 168, high: 0 },
					end: { low: 156, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "474",
					startNodeElementId: "168",
					endNodeElementId: "156",
				},
			],
			[
				{
					identity: { low: 471, high: 0 },
					start: { low: 169, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "471",
					startNodeElementId: "169",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 472, high: 0 },
					start: { low: 170, high: 0 },
					end: { low: 151, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "472",
					startNodeElementId: "170",
					endNodeElementId: "151",
				},
			],
			[
				{
					identity: { low: 473, high: 0 },
					start: { low: 171, high: 0 },
					end: { low: 154, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "473",
					startNodeElementId: "171",
					endNodeElementId: "154",
				},
			],
			[
				{
					identity: { low: 476, high: 0 },
					start: { low: 172, high: 0 },
					end: { low: 156, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "476",
					startNodeElementId: "172",
					endNodeElementId: "156",
				},
			],
			[
				{
					identity: { low: 464, high: 0 },
					start: { low: 173, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "464",
					startNodeElementId: "173",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 484, high: 0 },
					start: { low: 173, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "484",
					startNodeElementId: "173",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 463, high: 0 },
					start: { low: 174, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "463",
					startNodeElementId: "174",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 485, high: 0 },
					start: { low: 174, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "485",
					startNodeElementId: "174",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 478, high: 0 },
					start: { low: 175, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "478",
					startNodeElementId: "175",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 491, high: 0 },
					start: { low: 175, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "491",
					startNodeElementId: "175",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 477, high: 0 },
					start: { low: 176, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "477",
					startNodeElementId: "176",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 492, high: 0 },
					start: { low: 176, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "492",
					startNodeElementId: "176",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 475, high: 0 },
					start: { low: 177, high: 0 },
					end: { low: 156, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "475",
					startNodeElementId: "177",
					endNodeElementId: "156",
				},
			],
			[
				{
					identity: { low: 489, high: 0 },
					start: { low: 177, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "489",
					startNodeElementId: "177",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 493, high: 0 },
					start: { low: 177, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "493",
					startNodeElementId: "177",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 466, high: 0 },
					start: { low: 178, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "466",
					startNodeElementId: "178",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 494, high: 0 },
					start: { low: 178, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "494",
					startNodeElementId: "178",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 459, high: 0 },
					start: { low: 179, high: 0 },
					end: { low: 148, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "459",
					startNodeElementId: "179",
					endNodeElementId: "148",
				},
			],
			[
				{
					identity: { low: 495, high: 0 },
					start: { low: 179, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "495",
					startNodeElementId: "179",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 488, high: 0 },
					start: { low: 180, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "488",
					startNodeElementId: "180",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 496, high: 0 },
					start: { low: 180, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "496",
					startNodeElementId: "180",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 486, high: 0 },
					start: { low: 181, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "486",
					startNodeElementId: "181",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 497, high: 0 },
					start: { low: 181, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "497",
					startNodeElementId: "181",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 487, high: 0 },
					start: { low: 182, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "487",
					startNodeElementId: "182",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 498, high: 0 },
					start: { low: 182, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "498",
					startNodeElementId: "182",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 465, high: 0 },
					start: { low: 183, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "465",
					startNodeElementId: "183",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 499, high: 0 },
					start: { low: 183, high: 0 },
					end: { low: 160, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "499",
					startNodeElementId: "183",
					endNodeElementId: "160",
				},
			],
			[
				{
					identity: { low: 479, high: 0 },
					start: { low: 184, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "479",
					startNodeElementId: "184",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 500, high: 0 },
					start: { low: 184, high: 0 },
					end: { low: 161, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "500",
					startNodeElementId: "184",
					endNodeElementId: "161",
				},
			],
			[
				{
					identity: { low: 501, high: 0 },
					start: { low: 185, high: 0 },
					end: { low: 161, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "501",
					startNodeElementId: "185",
					endNodeElementId: "161",
				},
			],
			[
				{
					identity: { low: 482, high: 0 },
					start: { low: 186, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "482",
					startNodeElementId: "186",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 502, high: 0 },
					start: { low: 186, high: 0 },
					end: { low: 162, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "502",
					startNodeElementId: "186",
					endNodeElementId: "162",
				},
			],
			[
				{
					identity: { low: 481, high: 0 },
					start: { low: 187, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "481",
					startNodeElementId: "187",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 503, high: 0 },
					start: { low: 187, high: 0 },
					end: { low: 162, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "503",
					startNodeElementId: "187",
					endNodeElementId: "162",
				},
			],
			[
				{
					identity: { low: 480, high: 0 },
					start: { low: 188, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "480",
					startNodeElementId: "188",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 504, high: 0 },
					start: { low: 188, high: 0 },
					end: { low: 162, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "504",
					startNodeElementId: "188",
					endNodeElementId: "162",
				},
			],
			[
				{
					identity: { low: 507, high: 0 },
					start: { low: 188, high: 0 },
					end: { low: 163, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "507",
					startNodeElementId: "188",
					endNodeElementId: "163",
				},
			],
			[
				{
					identity: { low: 469, high: 0 },
					start: { low: 189, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "469",
					startNodeElementId: "189",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 483, high: 0 },
					start: { low: 189, high: 0 },
					end: { low: 158, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "483",
					startNodeElementId: "189",
					endNodeElementId: "158",
				},
			],
			[
				{
					identity: { low: 505, high: 0 },
					start: { low: 189, high: 0 },
					end: { low: 162, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "505",
					startNodeElementId: "189",
					endNodeElementId: "162",
				},
			],
			[
				{
					identity: { low: 490, high: 0 },
					start: { low: 190, high: 0 },
					end: { low: 159, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "490",
					startNodeElementId: "190",
					endNodeElementId: "159",
				},
			],
			[
				{
					identity: { low: 506, high: 0 },
					start: { low: 190, high: 0 },
					end: { low: 162, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "506",
					startNodeElementId: "190",
					endNodeElementId: "162",
				},
			],
			[
				{
					identity: { low: 467, high: 0 },
					start: { low: 191, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "467",
					startNodeElementId: "191",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 508, high: 0 },
					start: { low: 191, high: 0 },
					end: { low: 163, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "508",
					startNodeElementId: "191",
					endNodeElementId: "163",
				},
			],
			[
				{
					identity: { low: 468, high: 0 },
					start: { low: 192, high: 0 },
					end: { low: 149, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "468",
					startNodeElementId: "192",
					endNodeElementId: "149",
				},
			],
			[
				{
					identity: { low: 509, high: 0 },
					start: { low: 192, high: 0 },
					end: { low: 164, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "509",
					startNodeElementId: "192",
					endNodeElementId: "164",
				},
			],
			[
				{
					identity: { low: 510, high: 0 },
					start: { low: 193, high: 0 },
					end: { low: 164, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "510",
					startNodeElementId: "193",
					endNodeElementId: "164",
				},
			],
			[
				{
					identity: { low: 511, high: 0 },
					start: { low: 194, high: 0 },
					end: { low: 164, high: 0 },
					type: "DEPENDS_ON",
					properties: {},
					elementId: "511",
					startNodeElementId: "194",
					endNodeElementId: "164",
				},
			],
		],
	},
}
