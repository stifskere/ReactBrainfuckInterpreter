
# React Brainfuck Interpreter

This is a simple Brainfuck interpreter built with React. It allows you to write and execute Brainfuck programs in your web browser. (i made it in less than 1h)

## What is Brainfuck?

Brainfuck is an esoteric programming language created in 1993 by Urban Müller. It consists of only eight commands, making it one of the simplest programming languages. Despite its simplicity, Brainfuck is Turing-complete, meaning it can compute any computable function.

## Features

- Changeable delay
- Persistent memory
- [Stolen manual](https://gist.github.com/roachhd/dce54bec8ba55fb17d3a)
- Dynamic memory viewer

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
- **Run and reset button**: You can obviously run your brainfuck code and reset the memory without losing your changes
- **Input**: The , instruction will spawn a modal, you can input text
- **Output**: The program has an output for the . instruction.
- **Stolen manual**: You can always check reference right next to your program output.

Feel free to explore the interface and experiment with different Brainfuck programs!

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on the GitHub repository. If you would like to contribute code, fork the repository, create a new branch, and submit a pull request.

## Addition

This readme was half made with ChatGPT because I was lazy to make a readme.