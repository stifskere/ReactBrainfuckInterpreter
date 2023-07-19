
# React Brainfuck Interpreter

This is a simple Brainfuck interpreter built with React. It allows you to write and execute Brainfuck programs in your web browser.

## What is Brainfuck?

Brainfuck is an esoteric programming language created in 1993 by Urban Müller. It consists of only eight commands, making it one of the simplest programming languages. Despite its simplicity, Brainfuck is Turing-complete, meaning it can compute any computable function.

## Features

- Changeable delay
- Persistent memory
- [Stolen manual](https://gist.github.com/roachhd/dce54bec8ba55fb17d3a)
- Dynamic memory viewer
- BrainFuck generator

## Gif

![Brainfuck preview](https://github.com/stifskere/ReactBrainfuckInterpreter/assets/79871802/3e846f8b-a04f-49b8-aa01-8e6f3c29930a)

## Getting Started

To get started with the Brainfuck interpreter, follow these steps:

1. Clone the repository:

   ```shell
   git clone https://github.com/stifskere/ReactBrainfuckInterpreter
   ```
   
2. Move the working directory to the project root

    ```shell
    cd react-brainfuck-interpreter
    ```
3. Start the React development server

    ```shell
   npm start
    ```
4. Open your browser and visit http://localhost:3000 to access the Brainfuck interpreter.

## Usage 

Once you have the interpreter up and running, you can start writing and executing Brainfuck programs. Here's a quick overview of the available features:

- **Not that rich of an editor**: it's an HTML input element, nothing else.
- **Run and reset and stop button**: You can obviously run your brainfuck code and reset the memory without losing your changes
- **Input**: The , instruction will spawn a modal, you can input text
- **Output**: The program has an output for the . instruction.
- **Stolen manual**: You can always check reference right next to your program output.
- **Cursor**: When running the program there will be a cursor that shows the instruction being run.
- **BrainFuck generator**: Clicking the output box will open a prompt asking to generate text, [impl](https://github.com/stifskere/ReactBrainfuckInterpreter/blob/e1897819c7a49cc630bee108e48a8a345c3e4ddf/src/Modules/BrainFuckManager.ts#L115) based from [original program made in java](https://codegolf.stackexchange.com/questions/5418/brainf-golfer/5440#5440)

Feel free to explore the interface and experiment with different Brainfuck programs!

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository. If you would like to contribute code, fork the repository, create a new branch, and submit a pull request.
